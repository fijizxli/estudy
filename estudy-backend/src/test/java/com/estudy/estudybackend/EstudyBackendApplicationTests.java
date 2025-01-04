package com.estudy.estudybackend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.repositories.CourseRepository;
import com.estudy.estudybackend.services.CourseService;

@SpringBootTest
class EstudyBackendApplicationTests {
    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void shouldReturnCourseWhenCourseExists() {
        Course course = new Course("Data Structures and Algorithms", "text");
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        Course result = courseService.getCourseById(1L);

        assertNotNull(result);
        assertEquals(course, result);
        assertEquals("Data Structures and Algorithms", result.getTitle());
        assertEquals("text", result.getDescription());
    }
}
