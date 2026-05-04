package com.example.backend.REPOSITORIES;

import com.example.backend.MODEL.ServiceDesk;
import com.example.backend.MODEL.ServiceDeskKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceDeskRepository extends JpaRepository<ServiceDesk, ServiceDeskKey> {

    Optional<ServiceDesk> findByUserID(Integer userID);

    void deleteByTaskID(Integer taskID);
}
