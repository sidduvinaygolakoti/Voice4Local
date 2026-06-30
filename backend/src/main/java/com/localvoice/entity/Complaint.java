package com.localvoice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Complaint entity — stores all complaint data including location,
 * images (as JSON array), status and priority.
 */
@Entity
@Table(name = "complaints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_id", unique = true, nullable = false)
    private String complaintId; // e.g. LV-2024-0001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Citizen info (stored separately for anonymous tracking)
    private String fullName;
    private String fatherName;
    private String phone;
    private String email;

    // Address
    private String doorNumber;
    private String streetVillage;
    private String mandal;
    private String district;
    private String state;

    // Constituency
    private String assemblyConstituency;
    private String parliamentConstituency;

    // Problem
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String locationText;
    private Double latitude;
    private Double longitude;

    // Images stored as JSON array of Cloudinary URLs
    @Column(columnDefinition = "JSON")
    private String imageUrls;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {
        SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, EMERGENCY
    }
}
