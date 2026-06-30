package com.localvoice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponseItemDto {
    private Long id;
    private String message;
    private String statusAtTime;
    private LocalDateTime createdAt;
    private String authorityName;
}
