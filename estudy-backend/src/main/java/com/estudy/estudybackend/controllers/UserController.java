package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.models.dtos.*;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.services.CourseService;
import com.estudy.estudybackend.services.UserDetailServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
    RoleRepository roleRepository;

    @Autowired
    CourseService courseService;

    @PostMapping("/enroll")
    public ResponseEntity<?> addUserToCourse(@RequestBody AddToCourseDto addToCourseDto){
        try {
            User user = userService.findById(addToCourseDto.getUserId());
            Course course = courseService.getCourseById(addToCourseDto.getCourseId());

            if (user.getCourses().contains(course) || course.getLecturer().equals(user) || course.getLecturerName().equals(user.getUsername())){
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

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/userbyname/{username}")
    public ResponseEntity<LoginDto> getUserIdByName(@PathVariable String username){
        try {
            User user = userService.findByUsername(username);
            LoginDto loginDtoUser = new LoginDto(user.getId(), user.getUsername(), user.getEmailAddress(), user.getRole().getName());

            return new ResponseEntity<LoginDto>(loginDtoUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/lecturer/{id}")
    public ResponseEntity<LecturerDto> getUserIdByName(@PathVariable Long id){
        try {
            User user = userService.findById(id);
            List<Course> coursesTaught = user.getCoursesTaught();
            List<CourseDtoMin> coursesTaughtDtoMin = new ArrayList<>();
            for (Course course : coursesTaught){
                coursesTaughtDtoMin.add(new CourseDtoMin(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName()));
            }
            LecturerDto lecturerDto = new LecturerDto(user.getId(), user.getUsername(), user.getEmailAddress(), coursesTaughtDtoMin);

            return new ResponseEntity<LecturerDto>(lecturerDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/role/{roleString}")
    public ResponseEntity<List<UserDto>> getLecturers(@PathVariable String roleString){
        try {
            Role role = roleRepository.findByName(roleString);
            List<UserDto> userDtos = new ArrayList<>();
            Set<User> users = userService.findByRole(role);
            for (User user: users){
                userDtos.add(new UserDto(user.getId(), user.getUsername()));
            }
            return new ResponseEntity<List<UserDto>>(userDtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/role/lecturer/more")
    public ResponseEntity<List<LecturerDto>> getLecturersMore(){
        try {
            Role role = roleRepository.findByName("lecturer");
            List<LecturerDto> lecturerDtos = new ArrayList<>();
            Set<User> users = userService.findByRole(role);
            for (User user: users){
                List<CourseDtoMin> coursesTaught = new ArrayList<>();
                for (Course course : user.getCoursesTaught()){
                    CourseDtoMin courseDtoMin = new CourseDtoMin(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName());
                    coursesTaught.add(courseDtoMin);
                }
                lecturerDtos.add(new LecturerDto(user.getId(), user.getUsername(), user.getEmailAddress(), coursesTaught));
            }
            return new ResponseEntity<List<LecturerDto>>(lecturerDtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{username}/courses")
    public ResponseEntity<List<CourseDto>> getUserCoursesByName(@PathVariable String username){
        try {
            User user = userService.findByUsername(username);
            Set<Course> courses = user.getCourses();
            List<CourseDto> courseDtos = new ArrayList<>();
            for (Course course : courses){
                List<StudentDto> studentDtos = new ArrayList<>();
                for (User student: course.getStudents()){
                    studentDtos.add(new StudentDto(student.getId(), student.getUsername(), student.getEmailAddress()));
                }
                courseDtos.add(
                    new CourseDto(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName(), course.getStudyMaterials(), studentDtos)
                );
            }

            return new ResponseEntity<>(courseDtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
