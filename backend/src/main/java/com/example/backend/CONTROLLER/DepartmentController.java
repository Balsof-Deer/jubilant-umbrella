package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.DepartmentList;
import com.example.backend.REPOSITORIES.DepartmentListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentListRepository departmentRepository;

    @GetMapping("/all")
    public List<DepartmentList> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
