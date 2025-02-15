package team.teamby.teambyteam.feed.application;

import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import team.teamby.teambyteam.common.ServiceTest;
import team.teamby.teambyteam.common.fixtures.FeedThreadFixtures;
import team.teamby.teambyteam.common.fixtures.FeedThreadImageFixtures;
import team.teamby.teambyteam.feed.application.dto.FeedResponse;
import team.teamby.teambyteam.feed.application.dto.FeedsResponse;
import team.teamby.teambyteam.feed.domain.Feed;
import team.teamby.teambyteam.feed.domain.FeedThread;
import team.teamby.teambyteam.feed.domain.FeedType;
import team.teamby.teambyteam.feed.domain.image.FeedThreadImage;
import team.teamby.teambyteam.feed.domain.image.Status;
import team.teamby.teambyteam.feed.domain.image.vo.ImageName;
import team.teamby.teambyteam.feed.domain.image.vo.ImageUrl;
import team.teamby.teambyteam.feed.domain.vo.Content;
import team.teamby.teambyteam.member.configuration.dto.MemberEmailDto;
import team.teamby.teambyteam.member.domain.Member;
import team.teamby.teambyteam.member.domain.MemberTeamPlace;
import team.teamby.teambyteam.member.domain.vo.DisplayMemberName;
import team.teamby.teambyteam.teamplace.domain.TeamPlace;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static team.teamby.teambyteam.common.fixtures.MemberFixtures.PHILIP;
import static team.teamby.teambyteam.common.fixtures.MemberFixtures.PHILIP_EMAIL;
import static team.teamby.teambyteam.common.fixtures.MemberFixtures.ROY;
import static team.teamby.teambyteam.common.fixtures.MemberTeamPlaceFixtures.PHILIP_ENGLISH_TEAM_PLACE;
import static team.teamby.teambyteam.common.fixtures.TeamPlaceFixtures.ENGLISH_TEAM_PLACE;
import static team.teamby.teambyteam.common.fixtures.TeamPlaceFixtures.JAPANESE_TEAM_PLACE;

class FeedReadServiceTest extends ServiceTest {

    @Autowired
    private FeedReadService feedReadService;

    @Nested
    @DisplayName("피드의 스레드 조회시")
    class ReadThread {

        @Test
        @DisplayName("피드의 스레드를 비어있는 경우 처음 조회한다.")
        void firstNoneThreadReadSuccess() {
            // given
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            final int size = 10;
            final MemberEmailDto memberEmailDto = new MemberEmailDto(PHILIP_EMAIL);

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);

            //then
            assertThat(feedsResponse.threads()).isEmpty();
        }

        @Test
        @DisplayName("피드의 스레드를 사이즈 이하인 경우 처음 조회한다.")
        void firstThreadReadUnderSizeSuccess() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(member.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);

            final Feed feed1 = testFixtureBuilder.buildFeed(FeedThreadFixtures.CONTENT_AND_IMAGE(teamPlace.getId(), member.getId()));
            testFixtureBuilder.buildFeedThreadFeedThreadImage((FeedThread) feed1, FeedThreadImageFixtures.A_FEED_THREAD_IMAGE);

            final Feed feed2 = testFixtureBuilder.buildFeed(FeedThreadFixtures.CONTENT_EMPTY_AND_IMAGE_ONLY(teamPlace.getId(), member.getId()));
            testFixtureBuilder.buildFeedThreadFeedThreadImage((FeedThread) feed2, FeedThreadImageFixtures.B_FEED_THREAD_IMAGE);

            final Feed feed3 = testFixtureBuilder.buildFeed(FeedThreadFixtures.CONTENT_ONLY_AND_IMAGE_EMPTY(teamPlace.getId(), member.getId()));

            final int size = 10;

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);
            final FeedResponse contentOnly = feedsResponse.threads().get(0);
            final FeedResponse imageOnly = feedsResponse.threads().get(1);
            final FeedResponse contentAndImage = feedsResponse.threads().get(2);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(contentOnly.id()).isEqualTo(3);
                softly.assertThat(contentOnly.content()).isEqualTo(feed3.getContent().getValue());
                softly.assertThat(contentOnly.images()).isEmpty();

                softly.assertThat(imageOnly.id()).isEqualTo(2);
                softly.assertThat(imageOnly.content()).isEqualTo(feed2.getContent().getValue());
                softly.assertThat(imageOnly.images()).isNotEmpty();

                softly.assertThat(contentAndImage.id()).isEqualTo(1);
                softly.assertThat(contentAndImage.content()).isEqualTo(feed1.getContent().getValue());
                softly.assertThat(contentAndImage.images()).isNotEmpty();
            });
        }

        @Test
        @DisplayName("이미지는 90일이 지나면 만료된다.")
        void imageExpireAfter90Days() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(member.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);
            final FeedThreadImage EXPIRED_IMAGE = BDDMockito.spy(new FeedThreadImage(new ImageUrl("expired.com"), new ImageName("expiredImageName"), Status.ACTIVATED));
            BDDMockito.given(EXPIRED_IMAGE.isExpired())
                    .willReturn(true);

            final Feed feed1 = testFixtureBuilder.buildFeed(FeedThreadFixtures.CONTENT_AND_IMAGE(teamPlace.getId(), member.getId()));
            testFixtureBuilder.buildFeedThreadFeedThreadImage((FeedThread) feed1, EXPIRED_IMAGE);

            final int size = 10;

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);
            final FeedResponse contentAndImage = feedsResponse.threads().get(0);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(contentAndImage.id()).isEqualTo(1);
                softly.assertThat(contentAndImage.content()).isEqualTo(feed1.getContent().getValue());
                softly.assertThat(contentAndImage.images()).isNotEmpty();
                softly.assertThat(contentAndImage.images().get(0).isExpired()).isTrue();
            });
        }

        @Test
        @DisplayName("피드 스레드 조회시 내가 작성한 글과 다른사람이 작성한 글을 구분할 수 있다.")
        void checkAuthorByIsMe() {
            // given
            final Member PHILIP = testFixtureBuilder.buildMember(PHILIP());
            final Member ROY = testFixtureBuilder.buildMember(ROY());
            final MemberEmailDto PHILIP_EMAIL_DTO = new MemberEmailDto(PHILIP.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(PHILIP, teamPlace);
            testFixtureBuilder.buildMemberTeamPlace(ROY, teamPlace);

            final List<Feed> feeds = new ArrayList<>();
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello1"), PHILIP.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello2"), ROY.getId()));
            testFixtureBuilder.buildFeeds(feeds);
            final int size = 10;

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), PHILIP_EMAIL_DTO, size);
            feedsResponse.threads().forEach(System.out::println);

            // then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).isMe()).isFalse();
                softly.assertThat(feedsResponse.threads().get(0).authorName()).isEqualTo(ROY.getName().getValue());
                softly.assertThat(feedsResponse.threads().get(1).isMe()).isTrue();
                softly.assertThat(feedsResponse.threads().get(1).authorName()).isEqualTo(PHILIP.getName().getValue());
            });
        }

        @Test
        @DisplayName("피드의 스레드조회 시 팀플레이스의 이름이 나온다.")
        void threadReadTeamPlaceMemberName() {
            // given
            final Member PHILIP = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(PHILIP.getEmailValue());
            final TeamPlace ENGLISH_TEAM_PLACE = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            final MemberTeamPlace PHILIP_ENGLISH_TEAM_PLACE = PHILIP_ENGLISH_TEAM_PLACE();
            PHILIP_ENGLISH_TEAM_PLACE.setMemberAndTeamPlace(PHILIP, ENGLISH_TEAM_PLACE);
            DisplayMemberName displayMemberName = new DisplayMemberName("changedName");
            PHILIP_ENGLISH_TEAM_PLACE.changeDisplayMemberName(displayMemberName);
            testFixtureBuilder.buildMemberTeamPlace(PHILIP_ENGLISH_TEAM_PLACE);
            final List<Feed> feeds = new ArrayList<>();
            feeds.add(new FeedThread(ENGLISH_TEAM_PLACE.getId(), new Content("Hello1"), PHILIP.getId()));
            testFixtureBuilder.buildFeeds(feeds);
            final int size = 10;

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(PHILIP_ENGLISH_TEAM_PLACE.getId(),
                    memberEmailDto, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).authorName()).isEqualTo(displayMemberName.getValue());
                softly.assertThat(feedsResponse.threads().get(0).authorName())
                        .isNotEqualTo(PHILIP.getName().getValue());
            });
        }

        @Test
        @DisplayName("피드의 스레드를 사이즈 초과인 경우 처음 조회한다.")
        void firstThreadReadOverSizeSuccess() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(member.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);
            final List<Feed> feeds = new ArrayList<>();
            final int size = 3;
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            testFixtureBuilder.buildFeeds(feeds);

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).id()).isEqualTo(5);
                softly.assertThat(feedsResponse.threads().get(1).id()).isEqualTo(4);
                softly.assertThat(feedsResponse.threads().get(2).id()).isEqualTo(3);
            });
        }

        @Test
        @DisplayName("피드 스레드 타입이 소문자다.")
        void threadTypeLowerCase() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(member.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);
            final List<Feed> feeds = new ArrayList<>();
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello1"), member.getId()));
            testFixtureBuilder.buildFeeds(feeds);
            final int size = 10;
            final String type = FeedType.THREAD.name().toLowerCase();

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).type()).isEqualTo(type);
            });
        }

        @Test
        @DisplayName("피드를 조회하면 스레드와 일정 알림이 동시에 조회된다.")
        void feedCombinationReadSuccess() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final MemberEmailDto memberEmailDto = new MemberEmailDto(member.getEmailValue());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);
            final List<Feed> feeds = new ArrayList<>();
            feeds.add(new FeedThread(1L, new Content("테스트 스레드"), member.getId()));
            feeds.add(new FeedThread(1L, new Content("테스트 스레드"), member.getId()));
            feeds.add(new FeedThread(1L, new Content("테스트 스레드"), member.getId()));
            testFixtureBuilder.buildFeeds(feeds);
            final String threadType = FeedType.THREAD.name().toLowerCase();
            final int size = 3;

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), memberEmailDto, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).type()).isEqualTo(threadType);
                softly.assertThat(feedsResponse.threads().get(1).type()).isEqualTo(threadType);
                softly.assertThat(feedsResponse.threads().get(2).type()).isEqualTo(threadType);
            });
        }

        @Test
        @DisplayName("피드의 스레드를 사이즈 초과인 경우 다음 페이지를 재조회한다.")
        void ThreadReReadOverSizeSuccess() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, teamPlace);
            final List<Feed> feeds = new ArrayList<>();
            final int size = 3;
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), member.getId()));
            testFixtureBuilder.buildFeeds(feeds);

            // when
            final FeedsResponse feedsResponse = feedReadService.reRead(teamPlace.getId(),
                    new MemberEmailDto(member.getEmailValue()), 4L, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).id()).isEqualTo(3);
                softly.assertThat(feedsResponse.threads().get(1).id()).isEqualTo(2);
                softly.assertThat(feedsResponse.threads().get(2).id()).isEqualTo(1);
            });
        }

        @Test
        @DisplayName("피드의 스레드를 조회할 때 다른 팀플레이스의 피드는 조회되지 않는다.")
        void ThreadReadNotIncludeAnotherTeamPlaceSuccess() {
            // given
            final Member member = testFixtureBuilder.buildMember(PHILIP());
            final TeamPlace englishTeamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            final TeamPlace japaneseTeamPlace = testFixtureBuilder.buildTeamPlace(JAPANESE_TEAM_PLACE());
            testFixtureBuilder.buildMemberTeamPlace(member, englishTeamPlace);
            testFixtureBuilder.buildMemberTeamPlace(member, japaneseTeamPlace);
            final int size = 2;

            final List<Feed> feeds = new ArrayList<>();
            feeds.add(new FeedThread(englishTeamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(japaneseTeamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(englishTeamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(japaneseTeamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(englishTeamPlace.getId(), new Content("Hello"), member.getId()));
            feeds.add(new FeedThread(japaneseTeamPlace.getId(), new Content("Hello"), member.getId()));
            testFixtureBuilder.buildFeeds(feeds);

            // when
            final FeedsResponse feedsResponse = feedReadService.reRead(englishTeamPlace.getId(),
                    new MemberEmailDto(member.getEmailValue()), 5L, size);

            //then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads().get(0).id()).isEqualTo(3);
                softly.assertThat(feedsResponse.threads().get(1).id()).isEqualTo(1);
            });
        }

        @Test
        @DisplayName("존재하지 않는 멤버로 조회하면 (알수없음)작성자로 조회가 된다.")
        void failFeedThreadMemberNotFound() {
            // given
            final TeamPlace teamPlace = testFixtureBuilder.buildTeamPlace(ENGLISH_TEAM_PLACE());
            final List<Feed> feeds = new ArrayList<>();
            final int size = 10;
            final MemberEmailDto philipEmailDto = new MemberEmailDto(PHILIP().getEmailValue());
            feeds.add(new FeedThread(teamPlace.getId(), new Content("Hello"), 0L));

            testFixtureBuilder.buildFeeds(feeds);

            // when
            final FeedsResponse feedsResponse = feedReadService.firstRead(teamPlace.getId(), philipEmailDto, size);

            // then
            SoftAssertions.assertSoftly(softly -> {
                softly.assertThat(feedsResponse.threads()).hasSize(1);
                softly.assertThat(feedsResponse.threads().get(0).authorId()).isNull();
                softly.assertThat(feedsResponse.threads().get(0).authorName()).isEqualTo(Member.UNKNOWN_MEMBER_NAME);
                softly.assertThat(feedsResponse.threads().get(0).profileImageUrl())
                        .isEqualTo(Member.UNKNOWN_MEMBER_PROFILE_URL);
            });
        }
    }
}
