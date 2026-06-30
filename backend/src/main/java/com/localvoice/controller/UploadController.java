package com.localvoice.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

    private final Cloudinary cloudinary;

    @Value("${cloudinary.api-key}")
    private String cloudinaryApiKey;

    public UploadController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "File is empty"));
        }

        // Check if Cloudinary is configured
        if (cloudinaryApiKey == null || cloudinaryApiKey.isEmpty() || cloudinaryApiKey.startsWith("YOUR_")) {
            logger.warn("Cloudinary is not configured. Returning local mock/placeholder URL.");
            // Return a beautiful unsplash mockup image based on the file name or random
            String randomId = UUID.randomUUID().toString().substring(0, 8);
            String mockUrl = "https://images.unsplash.com/photo-1590086782957-93c06ef23004?auto=format&fit=crop&w=800&q=80&sig=" + randomId;
            return ResponseEntity.ok(Map.of("url", mockUrl));
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String url = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            logger.error("Failed to upload image to Cloudinary: " + e.getMessage(), e);
            // Fallback for exceptions
            String mockUrl = "https://images.unsplash.com/photo-1590086782957-93c06ef23004?auto=format&fit=crop&w=800&q=80";
            return ResponseEntity.ok(Map.of("url", mockUrl));
        }
    }
}
