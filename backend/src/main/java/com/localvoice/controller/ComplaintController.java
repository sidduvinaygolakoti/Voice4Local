package com.localvoice.controller;

import com.localvoice.dto.ComplaintRequest;
import com.localvoice.dto.ComplaintResponseDto;
import com.localvoice.dto.ReplyRequest;
import com.localvoice.dto.StatusRequest;
import com.localvoice.entity.User;
import com.localvoice.repository.UserRepository;
import com.localvoice.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public ComplaintController(ComplaintService complaintService, UserRepository userRepository) {
        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            throw new RuntimeException("Not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ComplaintResponseDto> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        User user = getAuthenticatedUser();
        ComplaintResponseDto response = complaintService.createComplaint(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<ComplaintResponseDto>> getMyComplaints() {
        User user = getAuthenticatedUser();
        List<ComplaintResponseDto> complaints = complaintService.getMyComplaints(user);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping
    @PreAuthorize("hasRole('AUTHORITY')")
    public ResponseEntity<List<ComplaintResponseDto>> getAllComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status) {
        List<ComplaintResponseDto> complaints = complaintService.getAllComplaints(search, category, priority, status);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponseDto> getComplaintById(@PathVariable Long id) {
        ComplaintResponseDto complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/track/{complaintId}")
    public ResponseEntity<?> trackComplaint(@PathVariable String complaintId) {
        List<ComplaintResponseDto> results = complaintService.trackComplaint(complaintId);
        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No complaint found with ID or Phone number: " + complaintId));
        }
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('AUTHORITY')")
    public ResponseEntity<ComplaintResponseDto> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {
        User user = getAuthenticatedUser();
        ComplaintResponseDto updated = complaintService.updateComplaintStatus(id, request.getStatus(), user);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/response")
    @PreAuthorize("hasRole('AUTHORITY')")
    public ResponseEntity<ComplaintResponseDto> addResponse(
            @PathVariable Long id,
            @RequestBody ReplyRequest request) {
        User user = getAuthenticatedUser();
        ComplaintResponseDto updated = complaintService.addResponse(id, request.getMessage(), user);
        return ResponseEntity.ok(updated);
    }
}
