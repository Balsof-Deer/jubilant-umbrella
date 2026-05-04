package com.example.backend.MODEL;

import jakarta.persistence.*;

@Entity
@Table(name = "requirements")
public class Requirements {

    @EmbeddedId
    private RequirementsKey id;

    public RequirementsKey getId() {
        return id;
    }

    public void setId(RequirementsKey id) {
        this.id = id;
    }
}
