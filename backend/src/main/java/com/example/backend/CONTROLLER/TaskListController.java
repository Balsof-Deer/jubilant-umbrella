package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.TaskList;
import com.example.backend.REPOSITORIES.RequirementsRepository;
import com.example.backend.REPOSITORIES.ServiceDeskRepository;
import com.example.backend.REPOSITORIES.TaskListRepository;
import com.example.backend.REPOSITORIES.UserQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskListController {

    @Autowired
    public TaskListRepository taskListRepository;

    @Autowired
    private RequirementsRepository requirementsRepository;

    @Autowired
    private UserQRepository userQRepository;

    @Autowired
    private ServiceDeskRepository serviceDeskRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addTask(@RequestBody TaskList task,
                                     @RequestParam(required = false) Integer staffDepartmentID) {
        if (task.getDepartment() == null || task.getDepartment().getDepartmentID() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Department is required."));
        }
        if (staffDepartmentID != null && !task.getDepartment().getDepartmentID().equals(staffDepartmentID)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only add tasks for your own department."));
        }
        return ResponseEntity.ok(taskListRepository.save(task));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Integer id,
                                        @RequestBody TaskList task,
                                        @RequestParam(required = false) Integer staffDepartmentID) {
        TaskList existing = taskListRepository.findById(id).orElseThrow();

        if (staffDepartmentID != null) {
            Integer existingDeptID = existing.getDepartment() != null ? existing.getDepartment().getDepartmentID() : null;
            if (!staffDepartmentID.equals(existingDeptID)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only update tasks in your own department."));
            }
        }

        existing.setTaskName(task.getTaskName());
        existing.setDuration(task.getDuration());
        existing.setAvailability(task.getAvailability());

        return ResponseEntity.ok(taskListRepository.save(existing));
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteTask(@PathVariable Integer id,
                                        @RequestParam(required = false) Integer staffDepartmentID) {
        if (!taskListRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        if (staffDepartmentID != null) {
            TaskList task = taskListRepository.findById(id).orElseThrow();
            Integer taskDeptID = task.getDepartment() != null ? task.getDepartment().getDepartmentID() : null;
            if (!staffDepartmentID.equals(taskDeptID)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete tasks in your own department."));
            }
        }

        requirementsRepository.deleteById_TaskID(id);
        userQRepository.deleteByTaskID(id);
        serviceDeskRepository.deleteByTaskID(id);
        taskListRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public List<TaskList> getAllTasks(){
        return taskListRepository.findAll();
    }

    @GetMapping("/department/{departmentID}")
    public List<TaskList> getTasksByDepartment(@PathVariable Integer departmentID) {
        return taskListRepository.findByDepartment_DepartmentID(departmentID);
    }

}
