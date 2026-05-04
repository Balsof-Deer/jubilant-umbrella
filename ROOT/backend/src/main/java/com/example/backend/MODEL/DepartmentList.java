package com.example.backend.MODEL;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "departmentList")
public class DepartmentList {

    @Id
    @Column(name = "departmentID")
    private Integer departmentID;

    @Column(name = "departmentName", nullable = false)
    private String departmentName;
}
