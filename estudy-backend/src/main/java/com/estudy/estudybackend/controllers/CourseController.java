package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.models.dtos.CourseDto;
import com.estudy.estudybackend.models.dtos.CourseDtoMin;
import com.estudy.estudybackend.models.dtos.StudentDto;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.services.CourseService;
import com.estudy.estudybackend.services.UserDetailServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService cs;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserDetailServiceImpl userService;

    public CourseController(CourseService cs) {
        this.cs = cs;
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<CourseDto>> getCourses(){
        List<CourseDto> courses = cs.getCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long courseId){
        Course course = cs.getCourseById(courseId);
        List<StudentDto> studentDtos = new ArrayList<>();
        for (User user: course.getStudents()){
            studentDtos.add(new StudentDto(user.getId(), user.getUsername(), user.getEmailAddress()));
        }
        CourseDto courseDto = new CourseDto(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName(), course.getStudyMaterials(), studentDtos);

        return new ResponseEntity<>(courseDto, HttpStatus.OK);

    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{courseId}/less")
    public ResponseEntity<CourseDtoMin> getCourseMinById(@PathVariable Long courseId){
        Course course = cs.getCourseById(courseId);

        CourseDtoMin courseDtoMin = new CourseDtoMin(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName());

        return new ResponseEntity<>(courseDtoMin, HttpStatus.OK);

    }


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{courseId}/lecturer")
    public ResponseEntity<String> getLecturerOfCourse(@PathVariable Long courseId){
        Course course = cs.getCourseById(courseId);
        if (course != null){
            return new ResponseEntity<>(course.getLecturerName(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/lecturer/{lecturerName}")
    public ResponseEntity<List<CourseDto>> getCoursesByLecturerName(@PathVariable String lecturerName){
        User lecturer = userService.findByUsername(lecturerName);
        if (lecturer != null){
            Role lecturerRole = roleRepository.findByName("LECTURER");
            if (lecturer.getRole().equals(lecturerRole)){
                List<Course> courses = cs.getCoursesByLecturer(lecturer);
                List<CourseDto> courseDtos = new ArrayList<>();
                for (Course course: courses){
                    List<StudentDto> studentDtos = new ArrayList<>();
                    for (User user : course.getStudents()){
                        studentDtos.add(
                            new StudentDto(user.getId(), user.getUsername(), user.getEmailAddress())
                        );
                    }
                    courseDtos.add(
                        new CourseDto(course.getId(), course.getTitle(), course.getDescription(), course.getLecturerName(), course.getStudyMaterials(), studentDtos)
                    );
                }
                if (courseDtos != null){
                    return new ResponseEntity<>(courseDtos, HttpStatus.OK);
                } 
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Void> createCourse(@RequestBody Course c){
        User lecturer = userService.findByUsername(c.getLecturerName());
        c = new Course(c.getTitle(), c.getDescription(), lecturer);
        cs.saveCourse(c);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourseById(@PathVariable Long courseId){
        cs.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @PatchMapping("/{courseId}")
    public ResponseEntity<Void> patchCourse(@PathVariable Long courseId, @RequestBody Course course){
        Course existingCourse = cs.getCourseById(courseId);

        if (course.getTitle() != null){
            existingCourse.setTitle(course.getTitle());
        }
        if (course.getDescription() != null){
            existingCourse.setDescription(course.getDescription());
        }

        if (course.getLecturerName() != null){
            User user = userService.findByUsername(course.getLecturerName());
            if (user.getRole().equals(existingCourse.getLecturer().getRole())){
                existingCourse.setLecturer(user);
            }
        }
        cs.saveCourse(existingCourse);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
