package com.estudy.estudybackend.services;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.repositories.StudyMaterialRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        }
    }

    public void updateStudyMaterial(Long studyMaterialId, StudyMaterial updatedStudyMaterial){
        StudyMaterial studyMaterial = studyMaterialRepository.findById(studyMaterialId).orElseThrow(
                () -> new EntityNotFoundException("Study material not found")
        );
        studyMaterial.setTitle(updatedStudyMaterial.getTitle());
        studyMaterial.setDescription(updatedStudyMaterial.getDescription());
        studyMaterial.setCourse(studyMaterial.getCourse());
        studyMaterial.setId(studyMaterialId);
        studyMaterialRepository.save(studyMaterial);
    }



    @Transactional
    public void deleteStudyMaterialById(Long studyMaterialId){
        StudyMaterial studyMaterial = studyMaterialRepository.findById(studyMaterialId).orElseThrow(
                () -> new EntityNotFoundException("Study material not found")
        );
        studyMaterialRepository.deleteById(studyMaterial.getId());
    }

    public void saveStudyMaterial(StudyMaterial studyMaterial){
        studyMaterialRepository.save(studyMaterial);
    }


}
