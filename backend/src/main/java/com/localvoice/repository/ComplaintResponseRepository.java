package com.localvoice.repository;

import com.localvoice.entity.Complaint;
import com.localvoice.entity.ComplaintResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintResponseRepository extends JpaRepository<ComplaintResponse, Long> {
    List<ComplaintResponse> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}
