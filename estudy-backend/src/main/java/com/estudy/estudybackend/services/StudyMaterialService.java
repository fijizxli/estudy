package com.estudy.estudybackend.services;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.repositories.StudyMaterialRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudyMaterialService {

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private CourseService courseService;

    @PersistenceContext
    private EntityManager entityManager;

    public StudyMaterial getStudyMaterialById(Long studyMaterialId){
        return studyMaterialRepository.findById(studyMaterialId).orElse(null);
    }

    /*
    public List<StudyMaterial> getStudyMaterials(){
        Iterable<StudyMaterial> smIt = studyMaterialRepository.findAll();
        List<StudyMaterial> studyMaterials = new ArrayList<StudyMaterial>();
        smIt.forEach(studyMaterials::add);
        return studyMaterials;
    }
    */

    @Transactional
    public void addStudyMaterialToCourse(StudyMaterial studyMaterial, Long courseId){
        Course course = courseService.getCourseById(courseId);
        if (course != null){
            Course attachedCourse = entityManager.merge(course);
            studyMaterial.setCourse(attachedCourse);
            attachedCourse.getStudyMaterials().add(studyMaterial);
            saveStudyMaterial(studyMaterial);
            entityManager.clear();
        }
    }

    public void saveStudyMaterial(StudyMaterial studyMaterial){
        studyMaterialRepository.save(studyMaterial);
    }


}