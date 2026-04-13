package com.example.backend.REPOSITORIES;

import com.example.backend.MODEL.UserQ;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserQRepository extends JpaRepository<UserQ, Integer> {

    Optional<UserQ> findByUserID(Integer userID);

    List<UserQ> findAll();

    void deleteByTaskID(Integer taskID);

    @Query("SELECT u FROM UserQ u WHERE u.taskID IN (SELECT t.taskID FROM TaskList t WHERE t.department.departmentID = :departmentID)")
    List<UserQ> findByDepartmentID(@Param("departmentID") Integer departmentID);

    @Query("SELECT COUNT(u) + 1 FROM UserQ u WHERE u.taskID IN (SELECT t.taskID FROM TaskList t WHERE t.department.departmentID = :departmentID) AND u.createdAt < :createdAt")
    int countUsersAhead(@Param("departmentID") Integer departmentID, @Param("createdAt") java.time.LocalTime createdAt);
}
