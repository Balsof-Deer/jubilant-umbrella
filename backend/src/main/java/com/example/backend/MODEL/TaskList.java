package com.example.backend.MODEL;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.example.backend.MODEL.Requirements;

import java.time.LocalTime;

@Setter
@Getter
@Entity
@Table(name = "taskList")
public class TaskList {

    // getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "taskID")
    private Integer taskID;

    @Column(name = "taskName")
    private String taskName;

    @Column(name = "duration")
    private LocalTime duration;

    @Column(name = "availability")
    private String availability;

    @ManyToOne
    @JoinColumn(name = "departmentID")
    private DepartmentList department;
}