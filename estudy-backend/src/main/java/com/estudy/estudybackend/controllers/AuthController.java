package com.estudy.estudybackend.controllers;
import com.estudy.estudybackend.models.dtos.UserRegistrationDto;
import com.estudy.estudybackend.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class AuthController {

    @Autowired
    private RegistrationService registrationService;
    @CrossOrigin(origins = "http://localhost:3000")
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
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
