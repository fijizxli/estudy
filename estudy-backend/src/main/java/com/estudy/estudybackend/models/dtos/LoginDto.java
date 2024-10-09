package com.estudy.estudybackend.models.dtos;

public class LoginDto {
    private Long id;
    private String username;
    private String emailAddress;
    private String role;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmailAddress() {
        return emailAddress;
    }
    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public LoginDto(Long id, String username, String emailAddress, String role) {
        this.id = id;
        this.username = username;
        this.emailAddress = emailAddress;
        this.role = role;
    }
    public LoginDto() {
    }

}
