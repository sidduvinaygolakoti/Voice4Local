package com.localvoice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponseDto {
    private Long id;
    private String complaintId;
    private Long userId;
    private String fullName;
    private String fatherName;
    private String phone;
    private String email;
    private String doorNumber;
    private String streetVillage;
    private String mandal;
    private String district;
    private String state;
    private String assemblyConstituency;
    private String parliamentConstituency;
    private String title;
    private String category;
    private String description;
    private String locationText;
    private Double latitude;
    private Double longitude;
    private List<String> imageUrls;
    private String status;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ComplaintResponseItemDto> responses;
}
