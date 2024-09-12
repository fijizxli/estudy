package com.estudy.estudybackend.models.dtos;

public class CourseDtoMin {
    private Long id;
    private String title;
    private String description;
    private String lecturerName;


    public CourseDtoMin() {
    }

    public CourseDtoMin(Long id, String title, String description, String lecturerName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lecturerName = lecturerName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLecturerName() {
        return lecturerName;
    }

    public void setLecturerName(String lecturerName) {
        this.lecturerName = lecturerName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
