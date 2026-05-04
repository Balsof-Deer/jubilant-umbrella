package com.example.backend.REPOSITORIES;

import com.example.backend.MODEL.Requirements;
import com.example.backend.MODEL.RequirementsKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementsRepository extends JpaRepository<Requirements, RequirementsKey> {
    List<Requirements> findById_TaskID(Integer taskID);

    void deleteById_TaskID(Integer taskID);
}
