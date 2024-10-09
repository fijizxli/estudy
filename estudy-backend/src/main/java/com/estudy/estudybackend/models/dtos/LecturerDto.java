package com.estudy.estudybackend.models.dtos;

import java.util.List;

public class LecturerDto {
    private Long id;
    private String username;
    private String emailAddress;

    private List<CourseDtoMin> coursesTaught;
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

    public List<CourseDtoMin> getCoursesTaught() {
        return coursesTaught;
    }

    public void setCoursesTaught(List<CourseDtoMin> coursesTaught) {
        this.coursesTaught = coursesTaught;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LecturerDto() {
    }

    public LecturerDto(Long id, String username, String emailAddress, List<CourseDtoMin> coursesTaught) {
        this.id = id;
        this.username = username;
        this.emailAddress = emailAddress;
        this.coursesTaught = coursesTaught;
    }
}
