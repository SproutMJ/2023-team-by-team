package team.teamby.teambyteam.feed.docs;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockPart;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import team.teamby.teambyteam.auth.exception.AuthenticationException;
import team.teamby.teambyteam.common.ApiDocsTest;
import team.teamby.teambyteam.common.fixtures.FeedThreadFixtures;
import team.teamby.teambyteam.common.fixtures.FileFixtures;
import team.teamby.teambyteam.feed.application.FeedImageService;
import team.teamby.teambyteam.feed.application.FeedReadService;
import team.teamby.teambyteam.feed.application.FeedWriteService;
import team.teamby.teambyteam.feed.application.dto.FeedResponse;
import team.teamby.teambyteam.feed.application.dto.FeedThreadWritingRequest;
import team.teamby.teambyteam.feed.application.dto.FeedsResponse;
import team.teamby.teambyteam.feed.domain.FeedType;
import team.teamby.teambyteam.feed.exception.FeedWritingRequestEmptyException;
import team.teamby.teambyteam.feed.presentation.FeedThreadController;
import team.teamby.teambyteam.filesystem.FileStorageManager;
import team.teamby.teambyteam.member.configuration.dto.MemberEmailDto;
import team.teamby.teambyteam.teamplace.exception.TeamPlaceAccessForbiddenException;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.requestHeaders;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.multipart;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseBody;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.partWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.restdocs.request.RequestDocumentation.requestParts;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FeedThreadController.class)
public final class FeedThreadApiDocsTest extends ApiDocsTest {

    @MockBean
    private FeedReadService feedReadService;

    @MockBean
    private FeedWriteService feedWriteService;

    @MockBean
    private FeedImageService feedImageService;

    @MockBean
    private FileStorageManager fileStorageManager;

    @BeforeEach
    void setUp() {
        given(fileStorageManager.upload(any(MultipartFile.class), any(String.class), any(String.class)))
                .willReturn("https://s3://seongha-seeik");
    }

    @Nested
    @DisplayName("스레드 등록 문서화")
    class FeedThreadWriteDocs {

        @Test
        @DisplayName("스레드 등록 성공")
        void success() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final Long registeredId = 1L;
            given(feedWriteService.write(any(), any(), any()))
                    .willReturn(registeredId);

            // when & then
            mockMvc.perform(multipart("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .file("images", FileFixtures.UNDER_SIZE_PNG_MOCK_MULTIPART_FILE1.getBytes())
                            .part(new MockPart("content", "TEST".getBytes()))
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
                    .andExpect(status().isCreated())
                    .andExpect(header().string(HttpHeaders.LOCATION,
                            "/api/team-place/" + teamPlaceId + "/feed/threads/" + registeredId))
                    .andDo(print())
                    .andDo(document("feeds/write/success",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ),
                                    requestParts(
                                            partWithName("content").description("등록할 내용"),
                                            partWithName("images").description("등록할 이미지들")
                                    ),
                                    responseHeaders(
                                            headerWithName(HttpHeaders.LOCATION).description("create 후 location 헤더")
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("내용과 이미지가 빈 값이면 요청 시 실패")
        void failIfEmptyContentAndImages() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            willThrow(new FeedWritingRequestEmptyException())
                    .given(feedWriteService)
                    .write(any(FeedThreadWritingRequest.class), any(MemberEmailDto.class), eq(teamPlaceId));

            // when & then
            mockMvc.perform(multipart("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE))
                    .andExpect(status().isBadRequest())
                    .andDo(print())
                    .andDo(document("feeds/write/fail/emptyContentAndImages",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("참가하지 않은 팀플레이스로 요청 시 실패")
        void failIfNotParticipated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final FeedThreadWritingRequest request = FeedThreadFixtures.CONTENT_AND_IMAGE_REQUEST;
            given(teamPlaceParticipationInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new TeamPlaceAccessForbiddenException(teamPlaceId, "사용자 email"));

            // when & then
            mockMvc.perform(multipart("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .file("images", FileFixtures.UNDER_SIZE_PNG_MOCK_MULTIPART_FILE1.getBytes())
                            .part(new MockPart("content", "TEST".getBytes()))
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
                    .andExpect(status().isForbidden())
                    .andDo(print())
                    .andDo(document("feeds/write/fail/notParticipatedTeamPlace",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("인증되지 않은 요청 시 실패")
        void failIfNotAuthenticated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            given(memberInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new AuthenticationException.FailAuthenticationException("잘못된 액세스 토큰"));

            // when & then
            mockMvc.perform(multipart("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .file("images", FileFixtures.UNDER_SIZE_PNG_MOCK_MULTIPART_FILE1.getBytes())
                            .part(new MockPart("content", "TEST".getBytes()))
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
                    .andExpect(status().isUnauthorized())
                    .andDo(print())
                    .andDo(document("feeds/write/fail/unAuthorized",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    )
                            )
                    );
        }
    }

    @Nested
    @DisplayName("스레드 조회 문서화")
    class FeedThreadReadDocs {

        @Test
        @DisplayName("스레드 처음 조회 성공")
        void firstRead() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final int size = 3;
            final Long authorId = 1L;

            final LocalDateTime createdAt = LocalDateTime.now();
            FeedResponse feedResponse = new FeedResponse(
                    1L,
                    FeedType.THREAD.name(),
                    authorId,
                    "author",
                    "/",
                    createdAt,
                    "hello",
                    List.of(),
                    false);
            final FeedsResponse feedsResponse = new FeedsResponse(List.of(feedResponse));
            given(feedReadService.firstRead(any(), any(), any()))
                    .willReturn(feedsResponse);

            // when & then
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .param("size", String.valueOf(size)))
                    .andExpect(status().isOk())
                    .andDo(print())
                    .andDo(document("feeds/read/first/success",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ), responseBody(
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("인증되지 않은 사용자는 조회를 실패한다.")
        void readFailUnAuthenticated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final int size = 3;
            given(memberInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new AuthenticationException.FailAuthenticationException("잘못된 액세스 토큰"));

            // when & then
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .param("size", String.valueOf(size)))
                    .andExpect(status().isUnauthorized())
                    .andDo(print())
                    .andDo(document("feeds/read/first/fail/unAuthorized",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ), responseBody(
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("참여하지 않은 팀플레이스의 조회를 실패한다.")
        void failNotParticipated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final int size = 3;
            given(teamPlaceParticipationInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new TeamPlaceAccessForbiddenException(teamPlaceId, "사용자 email"));

            // when & then
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .param("size", String.valueOf(size)))
                    .andExpect(status().isForbidden())
                    .andDo(print())
                    .andDo(document("feeds/read/first/fail/notParticipated",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ), responseBody(
                                    )
                            )
                    );
        }

        @Test
        @DisplayName("스레드 재조회 성공")
        void reRead() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final Long lastThreadId = 5L;
            final int size = 3;
            final Long authorId = 1L;

            final LocalDateTime createdAt = LocalDateTime.now();
            final FeedResponse feedResponse = new FeedResponse(
                    1L,
                    FeedType.THREAD.name(),
                    authorId,
                    "author",
                    "/",
                    createdAt,
                    "hello",
                    List.of(),
                    false
            );
            final FeedsResponse feedsResponse = new FeedsResponse(List.of(feedResponse));
            given(feedReadService.reRead(any(), any(), any(), any()))
                    .willReturn(feedsResponse);

            // when & then
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("size", String.valueOf(size));
            params.add("last-thread-id", String.valueOf(lastThreadId));
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .params(params))
                    .andExpect(status().isOk())
                    .andDo(print())
                    .andDo(document("feeds/read/repeat/success",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수"),
                                            parameterWithName("last-thread-id").description("이전 요청의 마지막 피드 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ),
                                    responseBody()
                            )
                    );
        }

        @Test
        @DisplayName("인증되지 않으면 재조회를 실패한다.")
        void reReadFailUnAuthenticated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final Long lastThreadId = 5L;
            final int size = 3;
            given(memberInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new AuthenticationException.FailAuthenticationException("잘못된 액세스 토큰"));

            // when & then
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("size", String.valueOf(size));
            params.add("last-thread-id", String.valueOf(lastThreadId));
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .params(params))
                    .andExpect(status().isUnauthorized())
                    .andDo(print())
                    .andDo(document("feeds/read/repeat/fail/unAuthorized",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수"),
                                            parameterWithName("last-thread-id").description("이전 요청의 마지막 피드 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ),
                                    responseBody()
                            )
                    );
        }

        @Test
        @DisplayName("참여하지 않은 팀플레이스의 재조회를 실패한다.")
        void reReadFailNotParticipated() throws Exception {
            // given
            final Long teamPlaceId = 1L;
            final Long lastThreadId = 5L;
            final int size = 3;
            given(teamPlaceParticipationInterceptor.preHandle(any(), any(), any()))
                    .willThrow(new TeamPlaceAccessForbiddenException(teamPlaceId, "사용자 email"));

            // when & then
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("size", String.valueOf(size));
            params.add("last-thread-id", String.valueOf(lastThreadId));
            mockMvc.perform(get("/api/team-place/{teamPlaceId}/feed/threads", teamPlaceId)
                            .header(AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_VALUE)
                            .params(params))
                    .andExpect(status().isForbidden())
                    .andDo(print())
                    .andDo(document("feeds/read/repeat/fail/notParticipated",
                                    preprocessRequest(prettyPrint()),
                                    preprocessResponse(prettyPrint()),
                                    pathParameters(
                                            parameterWithName("teamPlaceId").description("멤버가 속한 팀 플레이스 ID")
                                    ),
                                    queryParameters(
                                            parameterWithName("size").description("요청할 최신 피드의 개수"),
                                            parameterWithName("last-thread-id").description("이전 요청의 마지막 피드 ID")
                                    ),
                                    requestHeaders(
                                            headerWithName(AUTHORIZATION_HEADER_KEY).description("사용자 JWT 인증 정보")
                                    ),
                                    responseBody()
                            )
                    );
        }
    }
}
