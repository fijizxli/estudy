package com.estudy.estudybackend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String title;
    private String description;

    private String lecturer;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<StudyMaterial> studyMaterials = new ArrayList<>();


    public Course() {
    }

    public Course(String title, String description, String lecturer, List<StudyMaterial> studyMaterials) {
        this.title = title;
        this.description = description;
        this.lecturer = lecturer;
        this.studyMaterials = studyMaterials;
    }

    public Course(String title, String description) {
        this.title= title;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title= title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLecturer() {
        return lecturer;
    }

    public void setLecturer(String lecturer) {
        this.lecturer = lecturer;
    }

    public List<StudyMaterial> getStudyMaterials() {
        return studyMaterials;
    }

    public void setStudyMaterials(List<StudyMaterial> studyMaterials) {
        this.studyMaterials = studyMaterials;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        for (StudyMaterial s: studyMaterials){
            sb.append(s);
            sb.append(", ");
        }
        sb.append("}");

        return "Course{" +
                "id=" + id +
                ", title='" + title+ '\'' +
                ", description='" + description + '\'' +
                ", lecturer='" + lecturer + '\'' +
                ", study materials:'" + studyMaterials + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return Objects.equals(id, course.id) && Objects.equals(title, course.title) && Objects.equals(description, course.description) && Objects.equals(lecturer, course.lecturer) && Objects.equals(studyMaterials, course.studyMaterials);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, lecturer, studyMaterials);
    }

}
