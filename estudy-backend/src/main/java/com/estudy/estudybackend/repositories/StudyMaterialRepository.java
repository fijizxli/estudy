package com.estudy.estudybackend.repositories;

import com.estudy.estudybackend.models.StudyMaterial;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudyMaterialRepository extends CrudRepository<StudyMaterial, Long> {
}
