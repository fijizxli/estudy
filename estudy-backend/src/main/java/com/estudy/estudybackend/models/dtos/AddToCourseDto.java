package com.estudy.estudybackend.models.dtos;

public class AddToCourseDto {
    private Long courseId;
    private Long userId;

    public AddToCourseDto(Long courseId, Long userId) {
        this.courseId = courseId;
        this.userId = userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
