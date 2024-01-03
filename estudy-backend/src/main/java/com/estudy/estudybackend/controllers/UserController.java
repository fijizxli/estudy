package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.models.dtos.AddToCourseDto;
import com.estudy.estudybackend.services.CourseService;
import com.estudy.estudybackend.services.UserDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class UserController {
    @Autowired
    UserDetailServiceImpl userService;

    @Autowired
    CourseService courseService;

    @PostMapping("/enroll")
    public ResponseEntity<?> addUserToCourse(@RequestBody AddToCourseDto addToCourseDto){
        try {
            User user = userService.findById(addToCourseDto.getUserId());
            Course course = courseService.getCourseById(addToCourseDto.getCourseId());

            if (user.getCourses().contains(course)){
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            userService.addUserToCourse(addToCourseDto.getUserId(),addToCourseDto.getCourseId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/leave/{courseId}/{userId}")
    public ResponseEntity<?> removeUserFromCourse(@PathVariable Long courseId, @PathVariable Long userId){
        try {
            userService.removeUserFromCourse(userId, courseId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @GetMapping("/userbyname/{username}")
    public ResponseEntity<User> getUserIdByName(@PathVariable String username){
        try {
            User user = userService.findByUsername(username);
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
