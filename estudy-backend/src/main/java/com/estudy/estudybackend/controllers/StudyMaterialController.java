package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.services.CourseService;
import com.estudy.estudybackend.services.StudyMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses/{courseId}")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialService studyMaterialService;

    @Autowired
    private CourseService courseService;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{studyMaterialId}")
    public ResponseEntity<StudyMaterial> getStudyMaterialById(@PathVariable Long courseId, @PathVariable Long studyMaterialId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        StudyMaterial studyMaterial = studyMaterialService.getStudyMaterialById(studyMaterialId);
        if (studyMaterial != null) {
            return new ResponseEntity<>(studyMaterial, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Long> createStudyMaterial(@PathVariable Long courseId, @RequestBody StudyMaterial studyMaterial){
        try {
            Course course = courseService.getCourseById(courseId);
            if (course == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            studyMaterialService.addStudyMaterialToCourse(studyMaterial, courseId);

            return new ResponseEntity<>(studyMaterial.getId(), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PreAuthorize("hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
    @PatchMapping("/{studyMaterialId}")
    public ResponseEntity<Course> updateStudyMaterial(@PathVariable Long studyMaterialId, @RequestBody StudyMaterial studyMaterial){
        StudyMaterial existingStudyMaterial = studyMaterialService.getStudyMaterialById(studyMaterialId);
        if (studyMaterial.getTitle() != null) {
            existingStudyMaterial.setTitle(studyMaterial.getTitle());
        }
        if (studyMaterial.getDescription() != null) {
            existingStudyMaterial.setDescription(studyMaterial.getDescription());
        }

        studyMaterialService.saveStudyMaterial(existingStudyMaterial);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{studyMaterialId}")
    public ResponseEntity<StudyMaterial> deleteStudyMaterialById(@PathVariable Long studyMaterialId) {
        studyMaterialService.deleteStudyMaterialById(studyMaterialId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
