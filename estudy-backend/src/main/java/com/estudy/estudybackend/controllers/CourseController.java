package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses(){
        List<Course> courses = cs.getCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long courseId){
        Course course = cs.getCourseById(courseId);
        if (course != null){
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createCourse(@RequestBody Course c){
        cs.saveCourse(c);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
