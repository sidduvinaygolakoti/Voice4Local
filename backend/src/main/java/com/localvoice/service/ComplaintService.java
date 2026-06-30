package com.localvoice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.localvoice.dto.*;
import com.localvoice.entity.Complaint;
import com.localvoice.entity.ComplaintResponse;
import com.localvoice.entity.User;
import com.localvoice.repository.ComplaintRepository;
import com.localvoice.repository.ComplaintResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintResponseRepository complaintResponseRepository;
    private final ObjectMapper objectMapper;

    // We cannot use Lombok's @RequiredArgsConstructor directly if we want to be safe,
    // but the project uses Lombok, so it's fully fine. To be safe, we will write a constructor explicitly or use Lombok.
    // Let's use standard Java constructor injection or Lombok's @RequiredArgsConstructor.
    // Let's write the constructor explicitly so that we don't have compilation surprises.

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintResponseRepository complaintResponseRepository,
                            ObjectMapper objectMapper) {
        this.complaintRepository = complaintRepository;
        this.complaintResponseRepository = complaintResponseRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ComplaintResponseDto createComplaint(ComplaintRequest request, User user) {
        String complaintId = generateComplaintId();
        String imageUrlsJson = "";
        try {
            if (request.getImageUrls() != null) {
                imageUrlsJson = objectMapper.writeValueAsString(request.getImageUrls());
            } else {
                imageUrlsJson = "[]";
            }
        } catch (JsonProcessingException e) {
            imageUrlsJson = "[]";
        }

        Complaint complaint = Complaint.builder()
                .complaintId(complaintId)
                .user(user)
                .fullName(request.getFullName())
                .fatherName(request.getFatherName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .doorNumber(request.getDoorNumber())
                .streetVillage(request.getStreetVillage())
                .mandal(request.getMandal())
                .district(request.getDistrict())
                .state(request.getState())
                .assemblyConstituency(request.getAssemblyConstituency())
                .parliamentConstituency(request.getParliamentConstituency())
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                .locationText(request.getLocationText())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrls(imageUrlsJson)
                .status(Complaint.Status.SUBMITTED)
                .priority(Complaint.Priority.MEDIUM)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> getMyComplaints(User user) {
        return complaintRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> getAllComplaints(String search, String category, String priority, String status) {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();

        return complaints.stream()
                .filter(c -> {
                    if (search != null && !search.isEmpty()) {
                        String sLower = search.toLowerCase();
                        boolean matchId = c.getComplaintId().toLowerCase().contains(sLower);
                        boolean matchPhone = c.getPhone() != null && c.getPhone().contains(sLower);
                        boolean matchName = c.getFullName() != null && c.getFullName().toLowerCase().contains(sLower);
                        boolean matchMandal = c.getMandal() != null && c.getMandal().toLowerCase().contains(sLower);
                        boolean matchDistrict = c.getDistrict() != null && c.getDistrict().toLowerCase().contains(sLower);
                        return matchId || matchPhone || matchName || matchMandal || matchDistrict;
                    }
                    return true;
                })
                .filter(c -> {
                    if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
                        return c.getCategory().equalsIgnoreCase(category);
                    }
                    return true;
                })
                .filter(c -> {
                    if (priority != null && !priority.isEmpty() && !priority.equalsIgnoreCase("All")) {
                        return c.getPriority().name().equalsIgnoreCase(priority);
                    }
                    return true;
                })
                .filter(c -> {
                    if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("All")) {
                        return c.getStatus().name().equalsIgnoreCase(status);
                    }
                    return true;
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponseDto getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
        return mapToDto(complaint);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> trackComplaint(String query) {
        return complaintRepository.findByComplaintIdOrPhone(query)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponseDto updateComplaintStatus(Long id, String statusStr, User authority) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        Complaint.Status status = Complaint.Status.valueOf(statusStr.toUpperCase());
        complaint.setStatus(status);

        // Auto assign priority based on status or keep it
        if (status == Complaint.Status.IN_PROGRESS) {
            complaint.setPriority(Complaint.Priority.HIGH);
        }

        Complaint saved = complaintRepository.save(complaint);

        // Save automatic response log
        ComplaintResponse response = ComplaintResponse.builder()
                .complaint(saved)
                .authority(authority)
                .message("Status updated to " + status.name().replace("_", " "))
                .statusAtTime(status)
                .build();
        complaintResponseRepository.save(response);

        return mapToDto(saved);
    }

    @Transactional
    public ComplaintResponseDto addResponse(Long id, String message, User authority) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        ComplaintResponse response = ComplaintResponse.builder()
                .complaint(complaint)
                .authority(authority)
                .message(message)
                .statusAtTime(complaint.getStatus())
                .build();
        complaintResponseRepository.save(response);

        return mapToDto(complaint);
    }

    private String generateComplaintId() {
        int year = LocalDateTime.now().getYear();
        int random = 1000 + new Random().nextInt(9000);
        return "LV-" + year + "-" + random;
    }

    @SuppressWarnings("unchecked")
    private ComplaintResponseDto mapToDto(Complaint c) {
        List<String> urls = new ArrayList<>();
        if (c.getImageUrls() != null && !c.getImageUrls().isEmpty()) {
            try {
                urls = objectMapper.readValue(c.getImageUrls(), List.class);
            } catch (Exception e) {
                urls = Collections.singletonList(c.getImageUrls());
            }
        }

        List<ComplaintResponse> dbResponses = complaintResponseRepository.findByComplaintOrderByCreatedAtAsc(c);
        List<ComplaintResponseItemDto> responseItems = dbResponses.stream()
                .map(r -> ComplaintResponseItemDto.builder()
                        .id(r.getId())
                        .message(r.getMessage())
                        .statusAtTime(r.getStatusAtTime() != null ? r.getStatusAtTime().name() : null)
                        .createdAt(r.getCreatedAt())
                        .authorityName(r.getAuthority() != null ? r.getAuthority().getName() : "System")
                        .build())
                .collect(Collectors.toList());

        return ComplaintResponseDto.builder()
                .id(c.getId())
                .complaintId(c.getComplaintId())
                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .fullName(c.getFullName())
                .fatherName(c.getFatherName())
                .phone(c.getPhone())
                .email(c.getEmail())
                .doorNumber(c.getDoorNumber())
                .streetVillage(c.getStreetVillage())
                .mandal(c.getMandal())
                .district(c.getDistrict())
                .state(c.getState())
                .assemblyConstituency(c.getAssemblyConstituency())
                .parliamentConstituency(c.getParliamentConstituency())
                .title(c.getTitle())
                .category(c.getCategory())
                .description(c.getDescription())
                .locationText(c.getLocationText())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .imageUrls(urls)
                .status(c.getStatus().name())
                .priority(c.getPriority().name())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .responses(responseItems)
                .build();
    }
}
