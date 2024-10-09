package com.estudy.estudybackend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name="courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String title;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="lecturer_id")
    @JsonIgnore
    private User lecturer;

    @Transient
    @JsonProperty("lecturerName")
    private String lecturerName;

    @PostLoad
    @PostPersist
    @PostUpdate
    public void populateLecturer() {
        if (lecturer != null){
            this.lecturerName = lecturer.getUsername();
        }
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "course")
    private List<StudyMaterial> studyMaterials = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, mappedBy = "courses")
    @JsonIgnoreProperties("courses")
    private Set<User> students;

    public Course() {
    }

    public Course(String title, String description, User lecturer, List<StudyMaterial> studyMaterials, Set<User> students) {
        this.title = title;
        this.description = description;
        this.lecturer = lecturer;
        this.studyMaterials = studyMaterials;
        this.students = students;
    }

    public Course(String title, String description, User lecturer, List<StudyMaterial> studyMaterials) {
        this.title = title;
        this.description = description;
        this.lecturer = lecturer;
        this.studyMaterials = studyMaterials;
    }

    public Course(String title, String description) {
        this.title= title;
        this.description = description;
    }

    public Course(String title, String description, User lecturer) {
        this.title= title;
        this.description = description;
        this.lecturer = lecturer;
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
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getLecturer() {
        return lecturer;
    }

    public void setLecturer(User lecturer) {
        this.lecturer = lecturer;
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

    public Set<User> getStudents() {
        return students;
    }

    public void setStudents(Set<User> students) {
        this.students = students;
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
                ", lecturerName='" + lecturerName + '\'' +
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
