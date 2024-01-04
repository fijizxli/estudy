package com.estudy.estudybackend;

import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class EstudyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EstudyBackendApplication.class, args);
    }

    /*
    @Autowired
    RoleRepository roleRepository;

    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository, PasswordEncoder encoder){
        Role adminRole = new Role("ADMIN");
        Role userRole = new Role("USER");
        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        return args -> {
            User admin = new User("admin", encoder.encode("admin"), Set.of(adminRole));
            userRepository.save(admin);

        };
    }

     */

}
