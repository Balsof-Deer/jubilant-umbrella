package com.example.backend.MODEL;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "userQ")
public class UserQ {

    @Id
    @Column(name = "userID")
    private Integer userID;

    @Column(name = "taskID")
    private Integer taskID;

    @Column(name = "taskName")
    private String taskName;

    @Column(name = "createdAt")
    private LocalTime createdAt;

    @Column(name = "position")
    private Integer position;

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    public Integer getTaskID() {
        return taskID;
    }

    public void setTaskID(Integer taskID) {
        this.taskID = taskID;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public LocalTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}