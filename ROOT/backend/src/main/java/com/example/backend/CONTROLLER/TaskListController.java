package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.TaskList;
import com.example.backend.REPOSITORIES.RequirementsRepository;
import com.example.backend.REPOSITORIES.ServiceDeskRepository;
import com.example.backend.REPOSITORIES.TaskListRepository;
import com.example.backend.REPOSITORIES.UserQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public TaskList addTask(@RequestBody TaskList task) {
        return taskListRepository.save(task);
    }

    @PutMapping("/update/{id}")
    public TaskList updateTask(@PathVariable Integer id, @RequestBody TaskList task) {

        TaskList existing = taskListRepository.findById(id).orElseThrow();

        existing.setTaskName(task.getTaskName());
        existing.setDuration(task.getDuration());
        existing.setAvailability(task.getAvailability());
        existing.setDepartment(task.getDepartment());

        return taskListRepository.save(existing);
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public void deleteTask(@PathVariable Integer id) {
        if (taskListRepository.existsById(id)) {
            // Delete associated requirements
            requirementsRepository.deleteById_TaskID(id);

            // Delete associated queue entries
            userQRepository.deleteByTaskID(id);

            // Delete associated service desk entries
            serviceDeskRepository.deleteByTaskID(id);

            // Finally delete the task
            taskListRepository.deleteById(id);
        }
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
