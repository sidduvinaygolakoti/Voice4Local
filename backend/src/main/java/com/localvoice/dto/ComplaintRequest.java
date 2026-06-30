package com.localvoice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String fatherName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;

    private String doorNumber;

    @NotBlank(message = "Street/Village is required")
    private String streetVillage;

    private String mandal;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String assemblyConstituency;
    private String parliamentConstituency;

    @NotBlank(message = "Complaint title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    private String locationText;
    private Double latitude;
    private Double longitude;

    private List<String> imageUrls;
}
