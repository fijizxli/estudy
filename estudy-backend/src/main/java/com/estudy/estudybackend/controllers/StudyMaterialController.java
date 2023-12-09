package com.estudy.estudybackend.controllers;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.services.CourseService;
import com.estudy.estudybackend.services.StudyMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses/{courseId}")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialService studyMaterialService;

    @Autowired
    private CourseService courseService;

    /*
    @GetMapping("/m")
    public ResponseEntity<List<StudyMaterial>> getStudyMaterials(){
        List<StudyMaterial> studyMaterials = studyMaterialService.getStudyMaterials();
        return new ResponseEntity<>(studyMaterials, HttpStatus.OK);
    }
    */

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

    @PostMapping("/create")
    public ResponseEntity<Course> createStudyMaterial(@PathVariable Long courseId, @RequestBody StudyMaterial studyMaterial){

        try {
            Course course = courseService.getCourseById(courseId);
            if (course == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            studyMaterialService.addStudyMaterialToCourse(studyMaterial, courseId);

            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @PutMapping("/{studyMaterialId}")
    public ResponseEntity<Course> updateStudyMaterial(@PathVariable Long studyMaterialId, @RequestBody StudyMaterial updatedStudyMaterial){

        try {
            StudyMaterial studyMaterial = studyMaterialService.getStudyMaterialById(studyMaterialId);
            if (studyMaterial == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            studyMaterialService.updateStudyMaterial(studyMaterialId, updatedStudyMaterial);

            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @DeleteMapping("/sm/{studyMaterialId}")
    public ResponseEntity<StudyMaterial> deleteStudyMaterialById(@PathVariable Long studyMaterialId) {
        studyMaterialService.deleteStudyMaterialById(studyMaterialId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
