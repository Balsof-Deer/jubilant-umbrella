package com.example.backend.REPOSITORIES;

import com.example.backend.MODEL.DepartmentList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentListRepository extends JpaRepository<DepartmentList, Integer> {
}
