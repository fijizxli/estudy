package com.estudy.estudybackend.repositories;

import com.estudy.estudybackend.models.Lecturer;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends CrudRepository<Lecturer, Long> {
}