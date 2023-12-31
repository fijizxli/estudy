package com.estudy.estudybackend.controllers;
import com.estudy.estudybackend.models.dtos.UserRegistrationDto;
import com.estudy.estudybackend.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class AuthController {

    @Autowired
    private RegistrationService registrationService;
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/login")
    public ResponseEntity<Void> login(){
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserRegistrationDto user)
    {
        try {
            registrationService.registerUser(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
