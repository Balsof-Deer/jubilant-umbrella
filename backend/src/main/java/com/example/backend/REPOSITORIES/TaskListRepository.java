package com.example.backend.REPOSITORIES;

import com.example.backend.MODEL.TaskList;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Integer> {
    List<TaskList> findByDepartment_DepartmentID(Integer departmentID);
}