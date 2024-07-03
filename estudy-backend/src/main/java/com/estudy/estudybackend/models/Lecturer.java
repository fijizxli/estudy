package com.estudy.estudybackend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Objects;
import java.util.List;
import jakarta.validation.constraints.Email;

@Entity
@Table(name="lecturers")
public class Lecturer{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String name;

    @Email
    private String emailAddress;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "lecturer")
    private List<Course> courses = new ArrayList<>();

    public Lecturer() {
    }

    public Lecturer(String name, String emailAddress){
        this.name = name;
        this.emailAddress = emailAddress;
    }

    public Lecturer(String name, String emailAddress, List<Course> courses){
        this.name = name;
        this.emailAddress = emailAddress;
        this.courses = courses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Course> courses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        for (Course c: courses){
            sb.append(c);
            sb.append(", ");
        }
        sb.append("}");

        return "Course{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email address='" + emailAddress+ '\'' +
                ", courses:'" + courses + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lecturer lecturer = (Lecturer) o;
        return Objects.equals(id, lecturer.id) && Objects.equals(name, lecturer.name) && Objects.equals(emailAddress, lecturer.emailAddress) && Objects.equals(courses, lecturer.courses);
    }



    @Override
    public int hashCode() {
        return Objects.hash(id, name, emailAddress, courses);
    }

}
