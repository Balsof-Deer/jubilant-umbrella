package com.example.backend.MODEL;

import jakarta.persistence.*;

@Entity
@Table(name = "serviceDesk")
@IdClass(ServiceDeskKey.class)
public class ServiceDesk {

    @Id
    @Column(name = "userID")
    private Integer userID;

    @Id
    @Column(name = "taskID")
    private Integer taskID;

    @Column(name = "taskName")
    private String taskName;

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

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
