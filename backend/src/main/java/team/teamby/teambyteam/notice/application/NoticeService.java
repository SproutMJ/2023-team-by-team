package team.teamby.teambyteam.notice.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import team.teamby.teambyteam.filesystem.FileStorageManager;
import team.teamby.teambyteam.filesystem.ImageValidationService;
import team.teamby.teambyteam.member.configuration.dto.MemberEmailDto;
import team.teamby.teambyteam.member.domain.IdOnly;
import team.teamby.teambyteam.member.domain.MemberRepository;
import team.teamby.teambyteam.member.domain.MemberTeamPlace;
import team.teamby.teambyteam.member.domain.MemberTeamPlaceRepository;
import team.teamby.teambyteam.member.domain.vo.Email;
import team.teamby.teambyteam.member.exception.MemberNotFoundException;
import team.teamby.teambyteam.notice.application.dto.NoticeImageResponse;
import team.teamby.teambyteam.notice.application.dto.NoticeRegisterRequest;
import team.teamby.teambyteam.notice.application.dto.NoticeResponse;
import team.teamby.teambyteam.notice.domain.Notice;
import team.teamby.teambyteam.notice.domain.NoticeRepository;
import team.teamby.teambyteam.notice.domain.event.NoticeCreationEvent;
import team.teamby.teambyteam.notice.domain.image.NoticeImage;
import team.teamby.teambyteam.notice.domain.image.NoticeImageRepository;
import team.teamby.teambyteam.notice.domain.image.vo.ImageName;
import team.teamby.teambyteam.notice.domain.image.vo.ImageUrl;
import team.teamby.teambyteam.notice.domain.vo.Content;
import team.teamby.teambyteam.notice.exception.NoticeWritingRequestEmptyException;
import team.teamby.teambyteam.teamplace.domain.TeamPlaceRepository;
import team.teamby.teambyteam.teamplace.exception.TeamPlaceNotFoundException;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class NoticeService {

    private static final int IMAGE_EXPIRATION_DATE = 90;

    @Value("${aws.s3.image-directory}")
    private String imageDirectory;

    private final Clock clock;

    private final ApplicationEventPublisher applicationEventPublisher;
    private final NoticeRepository noticeRepository;
    private final TeamPlaceRepository teamPlaceRepository;
    private final MemberRepository memberRepository;
    private final MemberTeamPlaceRepository memberTeamPlaceRepository;
    private final NoticeImageRepository noticeImageRepository;
    private final FileStorageManager fileStorageManager;
    private final ImageValidationService imageValidationService;

    public Long register(final NoticeRegisterRequest noticeRegisterRequest,
                         final Long teamPlaceId,
                         final MemberEmailDto memberEmailDto
    ) {
        final String content = noticeRegisterRequest.content();
        final List<MultipartFile> images = noticeRegisterRequest.images();
        validateEmptyRequest(content, images);
        validateImages(images);

        checkTeamPlaceExist(teamPlaceId);
        final IdOnly memberId = memberRepository.findIdByEmail(new Email(memberEmailDto.email()))
                .orElseThrow(() -> new MemberNotFoundException(memberEmailDto.email()));
        final Content contentVo = new Content(noticeRegisterRequest.content());
        final Notice savedNotice = noticeRepository.save(new Notice(contentVo, teamPlaceId, memberId.id()));
        saveImages(images, savedNotice);

        final Long savedNoticeId = savedNotice.getId();
        log.info("공지 등록 - 등록자 이메일 : {}, 팀플레이스 아이디 : {}, 공지 아이디 : {}", memberEmailDto.email(), teamPlaceId,
                savedNoticeId);
        applicationEventPublisher.publishEvent(new NoticeCreationEvent(savedNotice));
        return savedNoticeId;
    }

    private void checkTeamPlaceExist(final Long teamPlaceId) {
        if (notExistTeamPlace(teamPlaceId)) {
            throw new TeamPlaceNotFoundException(teamPlaceId);
        }
    }

    private boolean notExistTeamPlace(final Long teamPlaceId) {
        return !teamPlaceRepository.existsById(teamPlaceId);
    }

    private void validateEmptyRequest(final String content, final List<MultipartFile> images) {
        if (isEmptyRequest(content, images)) {
            throw new NoticeWritingRequestEmptyException();
        }
    }

    private boolean isEmptyRequest(final String content, final List<MultipartFile> images) {
        return (("".equals(content) || Objects.isNull(content)) && images.size() == 0);
    }

    private void validateImages(final List<MultipartFile> images) {
        images.forEach(imageValidationService::validateImage);
    }

    private void saveImages(final List<MultipartFile> images, final Notice savedNotice) {
        images.forEach(image -> {
            final String originalFilename = image.getOriginalFilename();
            final String generatedImageUrl = fileStorageManager.upload(image, imageDirectory + "/" + UUID.randomUUID(), originalFilename);
            final ImageUrl imageUrl = new ImageUrl(generatedImageUrl);
            final ImageName imageName = new ImageName(originalFilename);
            final NoticeImage noticeImage = new NoticeImage(imageUrl, imageName);
            noticeImage.confirmNotice(savedNotice);
            noticeImageRepository.save(noticeImage);
        });
    }

    @Transactional(readOnly = true)
    public Optional<NoticeResponse> findMostRecentNotice(final Long teamPlaceId) {
        checkTeamPlaceExist(teamPlaceId);

        return noticeRepository.findMostRecentByTeamPlaceId(teamPlaceId)
                .map(this::mapToNoticeResponse);
    }

    private NoticeResponse mapToNoticeResponse(final Notice notice) {
        final MemberTeamPlace memberTeamPlace = memberTeamPlaceRepository
                .findByTeamPlaceIdAndMemberId(notice.getTeamPlaceId(), notice.getAuthorId())
                .orElse(MemberTeamPlace.UNKNOWN_MEMBER_TEAM_PLACE);
        return NoticeResponse.of(notice, memberTeamPlace, mapNoticeImageResponse(notice.getImages()));
    }

    private List<NoticeImageResponse> mapNoticeImageResponse(final List<NoticeImage> images) {
        return images.stream()
                .map(image ->
                        new NoticeImageResponse(
                                image.getId(),
                                isExpired(image.getCreatedAt()),
                                image.getImageNameValue(),
                                image.getImageUrlValue())
                ).toList();
    }

    private boolean isExpired(final LocalDateTime createdAt) {
        return createdAt.plusDays(IMAGE_EXPIRATION_DATE).isBefore(LocalDateTime.now(clock));
    }
}
