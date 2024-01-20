package com.estudy.estudybackend;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.repositories.UserRepository;

@SpringBootApplication
public class EstudyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EstudyBackendApplication.class, args);
    }

    @Autowired
    RoleRepository roleRepository;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository, PasswordEncoder encoder){

        if (roleRepository.findByName("ADMIN") == null){
            Role adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByName("USER") == null){
            Role userRole = new Role("USER");
            roleRepository.save(userRole);
        }

        return args -> {
            if (userRepository.findByUsername(adminUsername) == null){
                User admin = new User(adminUsername,
                encoder.encode(adminPassword),
                Set.of(roleRepository.findByName("admin")));
                userRepository.save(admin);
            }
        };
    }
}
