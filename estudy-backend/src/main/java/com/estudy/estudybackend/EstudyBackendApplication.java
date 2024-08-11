package com.estudy.estudybackend;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.estudy.estudybackend.models.Course;
import com.estudy.estudybackend.models.Role;
import com.estudy.estudybackend.models.StudyMaterial;
import com.estudy.estudybackend.models.User;
import com.estudy.estudybackend.repositories.CourseRepository;
import com.estudy.estudybackend.repositories.RoleRepository;
import com.estudy.estudybackend.repositories.StudyMaterialRepository;
import com.estudy.estudybackend.repositories.UserRepository;

@SpringBootApplication
public class EstudyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EstudyBackendApplication.class, args);
    }

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    StudyMaterialRepository studyMaterialRepository;

    @Autowired
    UserRepository userRepository;

    public void genSampleData(){
        User test_lecturer = userRepository.findByUsername("John");

        Course c1 = new Course(
            "Introduction to Computer Science", 
            "This course provides an overview of fundamental concepts in computer science, including algorithms, data structures, and programming languages",
            test_lecturer);
        Course c2 = new Course(
            "Data Science Fundamentals", 
            "Explore data analysis, visualization, and machine learning techniques in this hands-on course",
            test_lecturer);
        Course c3 = new Course(
            "Web Development Basics", 
            "Learn HTML, CSS, and JavaScript to build interactive web applications.",
            test_lecturer);

        courseRepository.save(c1);
        courseRepository.save(c2);
        courseRepository.save(c3);


        StudyMaterial c1_s1 = new StudyMaterial(c1,
            "Introduction to Algorithms",
            "A comprehensive textbook by Cormen, Leiserson, Rivest, and Stein.");
        StudyMaterial c1_s2 = new StudyMaterial(c1,
            "Python Crash Course",
            "A beginner-friendly book for learning Python programming.");
        StudyMaterial c2_s1 = new StudyMaterial(c2,
            "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
            "A practical guide to machine learning using Python libraries.");
        StudyMaterial c3_s1 = new StudyMaterial(c3,
            "HTML and CSS: Design and Build Websites",
            "A beginner-friendly book for web design.");

        studyMaterialRepository.save(c1_s1);
        studyMaterialRepository.save(c1_s2);
        studyMaterialRepository.save(c2_s1);
        studyMaterialRepository.save(c3_s1);
   }

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository, PasswordEncoder encoder){

        if (roleRepository.findByName("ADMIN") == null){
            Role adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByName("USER") == null){
            Role userRole = new Role("USER");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName("LECTURER") == null){
            Role lecturerRole = new Role("LECTURER");
            roleRepository.save(lecturerRole);
        }

        return args -> {
            if (userRepository.findByUsername(adminUsername) == null){
                User admin = new User(adminUsername,
                encoder.encode(adminPassword),
                Set.of(roleRepository.findByName("admin")));
                userRepository.save(admin);
            }

            if (userRepository.findByUsername("John") == null){
                User test_lecturer= new User(
                "John", 
                encoder.encode("john9999"), 
                Set.of(roleRepository.findByName("LECTURER")), 
                "john@john.joe");
                userRepository.save(test_lecturer);
            }

            genSampleData();
        };
    }
}
