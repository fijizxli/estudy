package com.estudy.estudybackend.services;

import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.models.dtos.UserRegistrationDto;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class RegistrationService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public void registerUser(UserRegistrationDto user) throws Exception {
        boolean passwordsMatch = user.getPassword().equals(user.getConfirmPassword());
        boolean userExists = userRepository.existsByUsername(user.getUsername());

        if (passwordsMatch && !userExists) {
            Role role = roleRepository.findByName("USER");
            User newUser = new User(user.getUsername(), encoder.encode(user.getPassword()), Set.of(role));
            userRepository.save(newUser);
        }else {
            if (!passwordsMatch) {
                throw new Exception("Registration error: passwords do not match.");
            } else if (userExists){
                throw new Exception("Registration error: user already exists.");
            }
        }
    }
}
