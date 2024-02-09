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

    public void genSampleData(){
        Course c1 = new Course(
            "Introduction to Computer Science", 
            "This course provides an overview of fundamental concepts in computer science, including algorithms, data structures, and programming languages",
            "Prof. Emily Johnson");
        Course c2 = new Course(
            "Data Science Fundamentals", 
            "Explore data analysis, visualization, and machine learning techniques in this hands-on course",
            "Dr. Alex Rodriguez");
        Course c3 = new Course(
            "Web Development Basics", 
            "Learn HTML, CSS, and JavaScript to build interactive web applications.",
            "Prof. David Lee");
        Course c4 = new Course(
            "Introduction to Psychology", 
            "Understand the basics of human behavior, cognition, and mental processes.",
            "Dr. Maria Hernandez");
        Course c5 = new Course(
            "Financial Accounting", 
            "Explore accounting principles, financial statements, and business transactions.",
            "Prof. Mark Davis");
        Course c6 = new Course(
            "Art History: Renaissance to Modern Era", 
            "Dive into the world of art, from the Renaissance period to contemporary art movements.",
            "Dr. Sofia Martinez");
        courseRepository.save(c1);
        courseRepository.save(c2);
        courseRepository.save(c3);
        courseRepository.save(c4);
        courseRepository.save(c5);
        courseRepository.save(c6);

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
        StudyMaterial c4_s1 = new StudyMaterial(c4,
            "Psychology: Themes and Variations",
            "A widely used textbook covering various psychological theories.");
        StudyMaterial c5_s1 = new StudyMaterial(c5,
            "Financial Accounting: Tools for Business Decision Making",
            "A comprehensive guide to financial accounting concepts.");
        StudyMaterial c6_s1 = new StudyMaterial(c6,
            "Gardner’s Art through the Ages",
            "A classic art history textbook.");
        studyMaterialRepository.save(c1_s1);
        studyMaterialRepository.save(c1_s2);
        studyMaterialRepository.save(c2_s1);
        studyMaterialRepository.save(c3_s1);
        studyMaterialRepository.save(c4_s1);
        studyMaterialRepository.save(c5_s1);
        studyMaterialRepository.save(c6_s1);
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

        return args -> {
            if (userRepository.findByUsername(adminUsername) == null){
                genSampleData();
                User admin = new User(adminUsername,
                encoder.encode(adminPassword),
                Set.of(roleRepository.findByName("admin")));
                userRepository.save(admin);
            }
        };
    }
}
