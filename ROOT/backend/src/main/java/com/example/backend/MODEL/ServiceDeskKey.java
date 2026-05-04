package com.example.backend.MODEL;

import java.io.Serializable;

public class ServiceDeskKey implements Serializable {

    private Integer userID;
    private Integer taskID;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ServiceDeskKey that = (ServiceDeskKey) o;
        return java.util.Objects.equals(userID, that.userID) &&
                java.util.Objects.equals(taskID, that.taskID);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userID, taskID);
    }
}
