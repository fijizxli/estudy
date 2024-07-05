package com.estudy.estudybackend.services;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.repositories.CourseRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Course getCourseById(Long courseId){
        return courseRepository.findById(courseId).orElse(null);
    }

    public List<Course> getCourses() {
        Iterable<Course> coursesIt = courseRepository.findAll();
        List<Course> courses = new ArrayList<Course>();
        coursesIt.forEach(courses::add);
        return courses;
    }

    @Transactional
    public void deleteCourse(Long courseId){
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new EntityNotFoundException("Course not found"));

        for (StudyMaterial studyMaterial : course.getStudyMaterials()) {
            studyMaterial.setCourse(null);
        }

        course.getStudyMaterials().clear();
        courseRepository.delete(course);
    }

    public void putCourse(Long courseId, Course updatedCourse){
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new EntityNotFoundException("Course not found")
        );
        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setLecturer(updatedCourse.getLecturer());
        course.setId(courseId);
        courseRepository.save(course);
    }

    public void saveCourse(Course c){
        courseRepository.save(c);
    }
}
