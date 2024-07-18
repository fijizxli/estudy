package com.estudy.estudybackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.estudy.estudybackend.repositories.LecturerRepository;
import com.estudy.estudybackend.models.Lecturer;

@Service
public class LecturerService {
    @Autowired
    private LecturerRepository lecturerRepository;

    public Lecturer getLecturerById(Long lecturerId){
        return lecturerRepository.findById(lecturerId).orElse(null);
    }

    public void saveLecturer(Lecturer l){
        lecturerRepository.save(l);
    }
}