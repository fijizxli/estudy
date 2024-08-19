package com.estudy.estudybackend.models.dtos;

import java.util.ArrayList;
import java.util.List;
import com.estudy.estudybackend.models.StudyMaterial;

public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String lecturerName;
    private List<StudyMaterial> studyMaterials = new ArrayList<>();
    private List<StudentDto> students;
    
    public CourseDto() {
    }

    public CourseDto(Long id, String title, String description, String lecturerName, List<StudyMaterial> studyMaterials, List<StudentDto> students) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lecturerName = lecturerName;
        this.studyMaterials = studyMaterials;
        this.students = students;
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

    public List<StudyMaterial> getStudyMaterials() {
        return studyMaterials;
    }

    public void setStudyMaterials(List<StudyMaterial> studyMaterials) {
        this.studyMaterials = studyMaterials;
    }

    public List<StudentDto> getStudents() {
        return students;
    }

    public void setStudents(List<StudentDto> students) {
        this.students = students;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
