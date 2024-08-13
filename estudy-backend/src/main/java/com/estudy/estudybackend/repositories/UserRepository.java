package com.estudy.estudybackend.repositories;

import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    User findByRole(Role role);
}

