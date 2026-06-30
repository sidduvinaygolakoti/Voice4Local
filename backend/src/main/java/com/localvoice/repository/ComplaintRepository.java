package com.localvoice.repository;

import com.localvoice.entity.Complaint;
import com.localvoice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserOrderByCreatedAtDesc(User user);
    Optional<Complaint> findByComplaintId(String complaintId);
    List<Complaint> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Complaint c WHERE c.complaintId = :query OR c.phone = :query ORDER BY c.createdAt DESC")
    List<Complaint> findByComplaintIdOrPhone(String query);

    long countByStatus(Complaint.Status status);
    List<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.Status status);
    List<Complaint> findByPriorityOrderByCreatedAtDesc(Complaint.Priority priority);
}
