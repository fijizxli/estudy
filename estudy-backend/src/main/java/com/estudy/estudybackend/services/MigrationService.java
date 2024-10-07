package com.estudy.estudybackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;

@Service
public class MigrationService {
    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;

    @Value("${dataMigrationService}")
    private String dataMigrationService ="";

    @Autowired
    public MigrationService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @PostConstruct
    public void init() {
        this.webClient = webClientBuilder.baseUrl(dataMigrationService).build();
    }

    public void migrateAll() {
        if (dataMigrationService != null){
            webClient.get()
                .uri("/m/lecturers")
                .retrieve()
                .bodyToMono(String.class)
                .subscribe();
        }
    }

    public void migrateLecturer(Long id) { // new course gets added when updating lecturers
        if (dataMigrationService != null){
            webClient.get()
                .uri("/m/lecturer/"+id.toString())
                .retrieve()
                .bodyToMono(String.class)
                .subscribe();
        }
    }

    public void updateLecturer(Long id) { // not yet used, user details cant be modified currently
        if (dataMigrationService != null){
            webClient.get()
                .uri("/u/lecturer/"+id.toString())
                .retrieve()
                .bodyToMono(String.class)
                .subscribe();
        }
    }

    public void updateCourse(Long id) {
        if (dataMigrationService != null){
            webClient.get()
                .uri("/u/courses/"+id.toString())
                .retrieve()
                .bodyToMono(String.class)
                .subscribe();
        }
    }
}