package team.teamby.teambyteam.notice.acceptance;

import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.OVER_SIZE_PNG_FILE;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.UNDER_SIZE_PNG_FILE1;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.UNDER_SIZE_PNG_FILE2;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.UNDER_SIZE_PNG_FILE3;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.UNDER_SIZE_PNG_FILE4;
import static team.teamby.teambyteam.common.fixtures.FileFixtures.UNDER_SIZE_WRONG_EXTENSION_FILE;
import static team.teamby.teambyteam.common.fixtures.MemberFixtures.PHILIP;
import static team.teamby.teambyteam.common.fixtures.MemberFixtures.ROY;
import static team.teamby.teambyteam.common.fixtures.NoticeFixtures.FIRST_CONTENT;
import static team.teamby.teambyteam.common.fixtures.NoticeFixtures.THIRD_CONTENT;
import static team.teamby.teambyteam.common.fixtures.TeamPlaceFixtures.ENGLISH_TEAM_PLACE;
import static team.teamby.teambyteam.common.fixtures.TeamPlaceFixtures.JAPANESE_TEAM_PLACE;
import static team.teamby.teambyteam.common.fixtures.acceptance.NoticeAcceptanceFixtures.GET_NOTICE_REQUEST;
import static team.teamby.teambyteam.common.fixtures.acceptance.NoticeAcceptanceFixtures.POST_NOTICE_IMAGE_AND_CONTENT_REQUEST;
import static team.teamby.teambyteam.common.fixtures.acceptance.NoticeAcceptanceFixtures.POST_NOTICE_ONLY_CONTENT_REQUEST;
import static team.teamby.teambyteam.common.fixtures.acceptance.NoticeAcceptanceFixtures.POST_NOTICE_ONLY_IMAGE_REQUEST;

import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import team.teamby.teambyteam.common.AcceptanceTest;
import team.teamby.teambyteam.common.fixtures.NoticeFixtures;
import team.teamby.teambyteam.common.fixtures.NoticeImageFixtures;
import team.teamby.teambyteam.filesystem.FileStorageManager;
import team.teamby.teambyteam.member.domain.Member;
import team.teamby.teambyteam.member.domain.MemberTeamPlace;
import team.teamby.teambyteam.notice.application.dto.NoticeImageResponse;
import team.teamby.teambyteam.notice.application.dto.NoticeResponse;
import team.teamby.teambyteam.teamplace.domain.TeamPlace;

public class NoticeAcceptanceTest extends AcceptanceTest {

    @MockBean
    private FileStorageManager fileStorageManager;

    @SpyBean
    private Clock clock;

    @Nested
    @DisplayName("공지 등록 시")
    class RegisterNotice {

        private Member authedMember;
        private TeamPlace participatedTeamPlace;
        private MemberTeamPlace participatedMemberTeamPlace;
        private String authToken;

        @BeforeEach
        void setup() {
            authedMember = testFixtureBuilder.buildMember(PHILIP());
            participatedTeamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            participatedMemberTeamPlace = testFixtureBuilder.buildMemberTeamPlace(authedMember, participatedTeamPlace);
            authToken = jwtTokenProvider.generateAccessToken(authedMember.getEmail().getValue());
            given(fileStorageManager.upload(any(MultipartFile.class), any(String.class), any(String.class)))
                    .willReturn("https://s3://seongha-seeik");
        }

        @Test
        @DisplayName("이미지와 내용이 있을 때 공지 등록에 성공한다.")
        void successWhenImageAndContentExist() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), "content");

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.CREATED.value());
                softly.assertThat(response.header(HttpHeaders.LOCATION)).contains(
                        "/api/team-place/" + participatedMemberTeamPlace.getTeamPlace().getId() + "/feed/threads");
            });
        }

        @Test
        @DisplayName("이미지만 있을 때 공지 등록에 성공한다.")
        void successWhenOnlyImageExist() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_IMAGE_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2));

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.CREATED.value());
                softly.assertThat(response.header(HttpHeaders.LOCATION)).contains(
                        "/api/team-place/" + participatedMemberTeamPlace.getTeamPlace().getId() + "/feed/threads");
            });
        }

        @Test
        @DisplayName("내용만 있을 때 공지 등록에 성공한다.")
        void successWhenOnlyContentExist() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_CONTENT_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    "content");

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.CREATED.value());
                softly.assertThat(response.header(HttpHeaders.LOCATION)).contains(
                        "/api/team-place/" + participatedMemberTeamPlace.getTeamPlace().getId() + "/feed/threads");
            });
        }

        @Test
        @DisplayName("공지 내용으로 빈 내용과 빈 이미지의의 요청이 오면 등록이 실패한다.")
        void failWithEmptyContentAndImages() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    Collections.emptyList(), "");

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
                softly.assertThat(response.body().asString()).contains("내용과 이미지가 모두 존재하지 않습니다.");
            });
        }

        @Test
        @DisplayName("이미지 개수가 4개보다 많은 요청이 오면 등록이 실패한다.")
        void failWhenImageOverCount() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_IMAGE_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2, UNDER_SIZE_PNG_FILE3,
                            UNDER_SIZE_PNG_FILE4)
            );

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
                softly.assertThat(response.body().asString()).contains("이미지는 최대 4개까지 첨부할 수 있습니다.");
            });
        }

        @Test
        @DisplayName("이미지 크기가 허용된 크기보다 큰 요청이 오면 등록이 실패한다.")
        void failWhenImageOverSize() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_IMAGE_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    List.of(OVER_SIZE_PNG_FILE));

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
                softly.assertThat(response.body().asString()).contains("Maximum upload size exceeded");
            });
        }

        @Test
        @DisplayName("이미지 확장자가 허용되지 않은 확장자의 요청이 오면 등록이 실패한다.")
        void failWhenNotAllowedImageExtension() {
            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_IMAGE_REQUEST(authToken,
                    participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_WRONG_EXTENSION_FILE));

            //then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
                softly.assertThat(response.body().asString()).contains("허용되지 않은 확장자입니다.");
            });
        }

        @Test
        @DisplayName("사용자가 소속되지 않은 팀플레이스 아이디로 요청 시 등록이 실패한다.")
        void failWithForbiddenTeamPlace() {
            // given
            final TeamPlace UN_PARTICIPATED_TEAM_PLACE = testFixtureBuilder.buildTeamPlace(
                    testFixtureBuilder.buildTeamPlace(JAPANESE_TEAM_PLACE()));

            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_CONTENT_REQUEST(authToken,
                    UN_PARTICIPATED_TEAM_PLACE.getId(), NoticeFixtures.FIRST_CONTENT);

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.FORBIDDEN.value());
                softly.assertThat(response.body().asString()).contains("접근할 수 없는 팀플레이스입니다.");
            });
        }

        @Test
        @DisplayName("존재하지 않는 팀플레이스 아이디로 요청 시 등록에 실패한다.")
        void failWithNonExistTeamPlace() {
            // given
            Long nonExistTeamPlaceId = -1L;

            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_CONTENT_REQUEST(authToken,
                    nonExistTeamPlaceId, FIRST_CONTENT);

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.FORBIDDEN.value());
                softly.assertThat(response.body().asString()).contains("접근할 수 없는 팀플레이스입니다.");
            });
        }

        @Test
        @DisplayName("인증되지 않은 사용자로 요청 시 등록이 실패한다.")
        void failUnAuthorizedMember() {
            // given
            final String unauthorizedToken = jwtTokenProvider.generateAccessToken(ROY().getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = POST_NOTICE_ONLY_CONTENT_REQUEST(unauthorizedToken,
                    participatedTeamPlace.getId(), FIRST_CONTENT);

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
                softly.assertThat(response.body().asString()).contains("인증이 실패했습니다.");
            });
        }
    }

    @Nested
    @DisplayName("공지 조회 시")
    class FindNotice {

        private Member authedMember;
        private TeamPlace participatedTeamPlace;
        private MemberTeamPlace participatedMemberTeamPlace;
        private String authToken;

        @BeforeEach
        void setup() {
            authedMember = testFixtureBuilder.buildMember(PHILIP());
            participatedTeamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            participatedMemberTeamPlace = testFixtureBuilder.buildMemberTeamPlace(authedMember, participatedTeamPlace);
            authToken = jwtTokenProvider.generateAccessToken(authedMember.getEmail().getValue());
            given(fileStorageManager.upload(any(MultipartFile.class), any(String.class), any(String.class)))
                    .willReturn("https://s3://seongha-seeik");
        }

        @Test
        @DisplayName("가장 최근에 등록된 공지가 조회된다.")
        void successFindingNotice() {
            // given
            final Long recentNoticeId = 3L;
            final String recentNoticeContent = THIRD_CONTENT;
            POST_NOTICE_ONLY_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(), FIRST_CONTENT);
            POST_NOTICE_ONLY_IMAGE_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2));
            POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), recentNoticeContent);

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(authToken, participatedTeamPlace.getId());

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(response.jsonPath().getLong("id")).isEqualTo(recentNoticeId);
                softly.assertThat(response.jsonPath().getString("content")).isEqualTo(recentNoticeContent);
                softly.assertThat(response.jsonPath().getLong("authorId")).isEqualTo(authedMember.getId());
                softly.assertThat(response.jsonPath().getString("authorName"))
                        .isEqualTo(participatedMemberTeamPlace.getDisplayMemberName().getValue());
                softly.assertThat(response.jsonPath().getString("profileImageUrl"))
                        .isEqualTo(authedMember.getProfileImageUrl().getValue());
                softly.assertThat(response.jsonPath().getList("images")).hasSize(2);
            });
        }

        @Test
        @DisplayName("공지 이미지가 만료되었을 경우 이미지 만료를 응답한다.")
        void expiredImage() {
            // given
            final Long recentNoticeId = 1L;
            final String recentNoticeContent = THIRD_CONTENT;
            POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), recentNoticeContent);

            final Instant expiredDate = LocalDateTime.now().plusDays(NoticeImageFixtures.IMAGE_EXPIRATION_DATE).plusNanos(1).toInstant(
                    ZoneOffset.systemDefault().getRules().getOffset(LocalDateTime.now()));
            given(clock.instant()).willReturn(expiredDate);

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(authToken, participatedTeamPlace.getId());
            final NoticeResponse noticeResponse = response.as(NoticeResponse.class);
            final List<NoticeImageResponse> images = noticeResponse.images();

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(response.jsonPath().getLong("id")).isEqualTo(recentNoticeId);
                softly.assertThat(response.jsonPath().getString("content")).isEqualTo(recentNoticeContent);
                softly.assertThat(response.jsonPath().getLong("authorId")).isEqualTo(authedMember.getId());
                softly.assertThat(response.jsonPath().getString("authorName"))
                        .isEqualTo(participatedMemberTeamPlace.getDisplayMemberName().getValue());
                softly.assertThat(response.jsonPath().getString("profileImageUrl"))
                        .isEqualTo(authedMember.getProfileImageUrl().getValue());
                softly.assertThat(images.size()).isEqualTo(2);
                softly.assertThat(images.get(0).isExpired()).isTrue();
                softly.assertThat(images.get(1).isExpired()).isTrue();
            });
        }

        @Test
        @DisplayName("팀 내 다른 사용자가 등록한 공지를 조회한다.")
        void successFindingNoticeWrittenByOtherMember() {
            //given
            final Long recentNoticeId = 1L;
            final String recentNoticeContent = THIRD_CONTENT;
            POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), recentNoticeContent);

            final Member otherMember = testFixtureBuilder.buildMember(ROY());
            testFixtureBuilder.buildMemberTeamPlace(otherMember, participatedTeamPlace);

            final String otherMemberToken = jwtTokenProvider.generateAccessToken(otherMember.getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(otherMemberToken,
                    participatedTeamPlace.getId());

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(response.jsonPath().getLong("id")).isEqualTo(recentNoticeId);
                softly.assertThat(response.jsonPath().getString("content")).isEqualTo(recentNoticeContent);
                softly.assertThat(response.jsonPath().getLong("authorId")).isEqualTo(authedMember.getId());
                softly.assertThat(response.jsonPath().getString("authorName"))
                        .isEqualTo(participatedMemberTeamPlace.getDisplayMemberName().getValue());
                softly.assertThat(response.jsonPath().getString("profileImageUrl"))
                        .isEqualTo(authedMember.getProfileImageUrl().getValue());
                softly.assertThat(response.jsonPath().getList("images")).hasSize(2);
            });
        }

        @Test
        @DisplayName("팀플레이스에 등록 된 공지가 없을 경우 빈 값이 반환된다.")
        void successFindingEmptyNotice() {
            // given
            final Member additionalMember = testFixtureBuilder.buildMember(ROY());
            final TeamPlace additionalTeamPlace = testFixtureBuilder.buildTeamPlace(JAPANESE_TEAM_PLACE());
            final MemberTeamPlace additionalMemberTeamPlace = testFixtureBuilder.buildMemberTeamPlace(additionalMember,
                    additionalTeamPlace);
            final String additionalToken = jwtTokenProvider.generateAccessToken(additionalMember.getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(additionalToken,
                    additionalTeamPlace.getId());

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(StringUtils.isBlank(response.body().asString())).isTrue();
            });
        }

        @Test
        @DisplayName("팀플레이스를 탈퇴한 사용자가 작성한 공지를 조회한다.")
        void getRecentNoticeWhichWrittenByLeavedTeamPlaceMember() {
            // given
            final Long recentNoticeId = 1L;
            final String recentNoticeContent = THIRD_CONTENT;
            POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), recentNoticeContent);

            final Member otherMember = testFixtureBuilder.buildMember(ROY());
            testFixtureBuilder.buildMemberTeamPlace(otherMember, participatedTeamPlace);
            authedMember.leaveTeamPlace(participatedTeamPlace.getId());
            testFixtureBuilder.deleteMemberTeamPlace(participatedMemberTeamPlace);
            final String otherMemberToken = jwtTokenProvider.generateAccessToken(otherMember.getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(otherMemberToken,
                    participatedTeamPlace.getId());

            //then
            final NoticeResponse noticeResponse = response.body().as(NoticeResponse.class);
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(noticeResponse.id()).isEqualTo(recentNoticeId);
                softly.assertThat(noticeResponse.content()).isEqualTo(recentNoticeContent);
                softly.assertThat(noticeResponse.authorId()).isNull();
                softly.assertThat(noticeResponse.authorName()).isEqualTo(Member.UNKNOWN_MEMBER_NAME);
                softly.assertThat(noticeResponse.profileImageUrl()).isEqualTo(Member.UNKNOWN_MEMBER_PROFILE_URL);
                softly.assertThat(response.jsonPath().getList("images")).hasSize(2);
            });
        }

        @Test
        @DisplayName("탈퇴한 사용자가 작성한 공지를 조회한다.")
        void getRecentNoticeWhichWrittenByLeavedServiceMember() {
            // given
            final Long recentNoticeId = 1L;
            final String recentNoticeContent = THIRD_CONTENT;
            POST_NOTICE_IMAGE_AND_CONTENT_REQUEST(authToken, participatedTeamPlace.getId(),
                    List.of(UNDER_SIZE_PNG_FILE1, UNDER_SIZE_PNG_FILE2), recentNoticeContent);

            final Member otherMember = testFixtureBuilder.buildMember(ROY());
            testFixtureBuilder.buildMemberTeamPlace(otherMember, participatedTeamPlace);
            testFixtureBuilder.deleteMember(authedMember);
            final String otherMemberToken = jwtTokenProvider.generateAccessToken(otherMember.getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(otherMemberToken,
                    participatedTeamPlace.getId());

            //then
            final NoticeResponse noticeResponse = response.body().as(NoticeResponse.class);
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
                softly.assertThat(noticeResponse.id()).isEqualTo(recentNoticeId);
                softly.assertThat(noticeResponse.content()).isEqualTo(recentNoticeContent);
                softly.assertThat(noticeResponse.authorId()).isNull();
                softly.assertThat(noticeResponse.authorName()).isEqualTo(Member.UNKNOWN_MEMBER_NAME);
                softly.assertThat(noticeResponse.profileImageUrl()).isEqualTo(Member.UNKNOWN_MEMBER_PROFILE_URL);
            });
        }

        @Test
        @DisplayName("존재하지 않는 팀플레이스로 공지 조회 요청 시 예외가 발생한다.")
        void failWithNonExistTeamPlace() {
            // given
            final Long nonExistTeamPlaceId = -1L;

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(authToken, nonExistTeamPlaceId);

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.FORBIDDEN.value());
                softly.assertThat(response.body().asString()).contains("접근할 수 없는 팀플레이스입니다.");
            });
        }

        @Test
        @DisplayName("사용자가 소속되지 않은 팀플레이스 Id로 공지 조회 요청 시 예외가 발생한다.")
        void failWithForbiddenTeamPlace() {
            // given
            final Member forbiddenMember = testFixtureBuilder.buildMember(ROY());
            final String forbiddenToken = jwtTokenProvider.generateAccessToken(forbiddenMember.getEmail().getValue());

            // when
            final ExtractableResponse<Response> response = GET_NOTICE_REQUEST(forbiddenToken,
                    participatedTeamPlace.getId());

            // then
            assertSoftly(softly -> {
                softly.assertThat(response.statusCode()).isEqualTo(HttpStatus.FORBIDDEN.value());
                softly.assertThat(response.body().asString()).contains("접근할 수 없는 팀플레이스입니다.");
            });
        }
    }
}
