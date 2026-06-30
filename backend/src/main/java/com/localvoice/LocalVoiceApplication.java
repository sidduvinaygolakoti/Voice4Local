package com.localvoice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LOCAL VOICE — Citizen Problem Reporting Platform
 * Main Spring Boot Application Entry Point
 */
@SpringBootApplication
public class LocalVoiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(LocalVoiceApplication.class, args);
        System.out.println("==============================================");
        System.out.println(" LOCAL VOICE Backend Started Successfully!");
        System.out.println(" Connecting Citizens. Solving Problems.");
        System.out.println("==============================================");
    }
}
