package com.localvoice.controller;

import com.localvoice.dto.AIRequest;
import com.localvoice.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody AIRequest request) {
        String language = request.getLanguage() != null ? request.getLanguage() : "en";
        String reply = aiService.analyzeMessage(request.getMessage(), language);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
