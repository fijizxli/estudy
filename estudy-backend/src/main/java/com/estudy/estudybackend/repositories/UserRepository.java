package com.estudy.estudybackend.repositories;

import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    Set<User> findByRole(Role role);
}

