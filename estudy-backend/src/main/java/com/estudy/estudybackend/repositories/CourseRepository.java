package com.estudy.estudybackend.repositories;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.User;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends CrudRepository<Course, Long> {
    List<Course> findByLecturer(User lecturer);
}
