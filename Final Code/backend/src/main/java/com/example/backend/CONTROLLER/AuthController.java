package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.StaffAccount;
import com.example.backend.REPOSITORIES.StaffAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private StaffAccountRepository staffAccountRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     *
     * Returns department info on success so the frontend can navigate
     * directly to the correct department queue.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Username and password are required.");
            return ResponseEntity.badRequest().body(err);
        }

        Optional<StaffAccount> accountOpt = staffAccountRepository.findByUsername(username.trim());

        if (accountOpt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Invalid username or password.");
            return ResponseEntity.status(401).body(err);
        }

        StaffAccount account = accountOpt.get();

        if (!passwordEncoder.matches(password, account.getPassword())) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Invalid username or password.");
            return ResponseEntity.status(401).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("staffID",        account.getStaffID());
        response.put("username",        account.getUsername());
        response.put("departmentID",    account.getDepartment().getDepartmentID());
        response.put("departmentName",  account.getDepartment().getDepartmentName());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register
     * Body: { "username": "...", "password": "...", "departmentID": 1 }
     *
     * Creates a new staff account. Passwords are stored as BCrypt hashes.
     * Restrict this endpoint (or remove it) after initial setup in production.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {
        String username   = (String) body.get("username");
        String password   = (String) body.get("password");
        Integer deptID    = body.get("departmentID") instanceof Integer
                ? (Integer) body.get("departmentID")
                : Integer.valueOf(body.get("departmentID").toString());

        if (username == null || password == null || deptID == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "username, password, and departmentID are required.");
            return ResponseEntity.badRequest().body(err);
        }

        if (staffAccountRepository.findByUsername(username.trim()).isPresent()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Username already exists.");
            return ResponseEntity.status(409).body(err);
        }

        // Fetch the department to associate
        com.example.backend.MODEL.DepartmentList dept = new com.example.backend.MODEL.DepartmentList();
        dept.setDepartmentID(deptID);

        StaffAccount account = new StaffAccount();
        account.setUsername(username.trim());
        account.setPassword(passwordEncoder.encode(password));
        account.setDepartment(dept);

        staffAccountRepository.save(account);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Staff account created successfully.");
        response.put("username", username.trim());
        return ResponseEntity.ok(response);
    }
}
