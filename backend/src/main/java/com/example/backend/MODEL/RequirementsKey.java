package com.example.backend.MODEL;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class RequirementsKey implements Serializable {

    @jakarta.persistence.Column(name = "taskID")
    private Integer taskID;
    @jakarta.persistence.Column(name = "document")
    private String document;

    public Integer getTaskID() {
        return taskID;
    }

    public void setTaskID(Integer taskID) {
        this.taskID = taskID;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RequirementsKey that = (RequirementsKey) o;
        return java.util.Objects.equals(taskID, that.taskID) &&
                java.util.Objects.equals(document, that.document);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(taskID, document);
    }
}