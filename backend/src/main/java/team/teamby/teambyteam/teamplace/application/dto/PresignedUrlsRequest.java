package team.teamby.teambyteam.teamplace.application.dto;

import jakarta.validation.constraints.Size;

import java.util.List;

public record PresignedUrlsRequest(
        @Size(min = 1, max = 4) List<PresignedUrlRequest> images
) {
}
