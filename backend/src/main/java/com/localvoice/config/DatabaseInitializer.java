package com.localvoice.config;

import com.localvoice.entity.User;
import com.localvoice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Demo Citizen
        if (!userRepository.existsByEmail("citizen@demo.com")) {
            User citizen = User.builder()
                    .name("Demo Citizen")
                    .email("citizen@demo.com")
                    .phone("9876543210")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .role(User.Role.CITIZEN)
                    .state("Telangana")
                    .build();
            userRepository.save(citizen);
            System.out.println("Seeded Demo Citizen account: citizen@demo.com / Demo@1234");
        }

        // Seed Demo Authority
        if (!userRepository.existsByEmail("authority@demo.com")) {
            User authority = User.builder()
                    .name("Demo Authority")
                    .email("authority@demo.com")
                    .phone("9876543211")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .role(User.Role.AUTHORITY)
                    .state("Telangana")
                    .build();
            userRepository.save(authority);
            System.out.println("Seeded Demo Authority account: authority@demo.com / Demo@1234");
        }
    }
}
