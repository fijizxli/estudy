package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService cs;

    public CourseController(CourseService cs) {
        this.cs = cs;
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses(){
        List<Course> courses = cs.getCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long courseId){
        Course course = cs.getCourseById(courseId);
        if (course != null){
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Void> createCourse(@RequestBody Course c){
        cs.saveCourse(c);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourseById(@PathVariable Long courseId){
        cs.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/{courseId}")
    public ResponseEntity<Void> patchCourse(@PathVariable Long courseId, @RequestBody Course course){
        Course existingCourse = cs.getCourseById(courseId);
        if (course.getTitle() != null){
            existingCourse.setTitle(course.getTitle());
        }
        if (course.getDescription() != null){
            existingCourse.setDescription(course.getDescription());
        }
        if (course.getLecturer() != null){
            existingCourse.setLecturer(course.getLecturer());
        }
        cs.saveCourse(existingCourse);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
