-- ============================================================
-- UBotswana Queue Management System — Sample Data
-- Database: ProjectSQL
-- Tables:   departmentList | tasklist | requirements |
--           userQ | serviceDesk | staffAccount
--
-- Run AFTER the backend has started at least once.
-- JPA (ddl-auto=update) creates the tables on first boot.
-- ============================================================

USE ProjectSQL;

-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================
INSERT INTO departmentList (departmentID, departmentName) VALUES
(1, 'Finance Office'),
(2, 'Registrar''s Office'),
(3, 'Student Affairs'),
(4, 'IT Services'),
(5, 'Library Services');


-- ============================================================
-- 2. TASKS / SERVICES
-- departmentID = FK column set explicitly via @JoinColumn(name = "departmentID")
-- in the TaskList entity's @ManyToOne relationship
-- ============================================================
INSERT INTO tasklist (taskID, taskName, duration, availability, departmentID) VALUES
-- Finance Office (dept 1)
(101, 'Fee Payment',               '00:10:00', 'Available',   1),
(102, 'Scholarship Application',   '00:20:00', 'Available',   1),
(103, 'Student Loan Processing',   '00:30:00', 'Available',   1),
(104, 'Bursary Enquiry',           '00:15:00', 'Available',   1),

-- Registrar's Office (dept 2)
(201, 'Transcript Request',        '00:15:00', 'Available',   2),
(202, 'Certificate Collection',    '00:10:00', 'Available',   2),
(203, 'Course Registration',       '00:15:00', 'Available',   2),
(204, 'Graduation Application',    '00:20:00', 'Unavailable', 2),
(205, 'Name Change Request',       '00:20:00', 'Available',   2),

-- Student Affairs (dept 3)
(301, 'Student Card Renewal',      '00:10:00', 'Available',   3),
(302, 'Accommodation Application', '00:25:00', 'Available',   3),
(303, 'Counselling Appointment',   '00:45:00', 'Available',   3),
(304, 'Disciplinary Enquiry',      '00:30:00', 'Unavailable', 3),

-- IT Services (dept 4)
(401, 'Email Account Setup',       '00:15:00', 'Available',   4),
(402, 'Software License Request',  '00:10:00', 'Available',   4),
(403, 'IT Support',                '00:30:00', 'Available',   4),
(404, 'Network Access Request',    '00:20:00', 'Available',   4),

-- Library Services (dept 5)
(501, 'Library Card Registration', '00:05:00', 'Available',   5),
(502, 'Research Assistance',       '00:30:00', 'Available',   5),
(503, 'Book Return Processing',    '00:05:00', 'Available',   5),
(504, 'Interlibrary Loan Request', '00:20:00', 'Available',   5);


-- ============================================================
-- 3. REQUIREMENTS (documents users must bring per task)
-- ============================================================
INSERT INTO requirements (taskID, document) VALUES
-- Fee Payment (101)
(101, 'Student ID Card'),
(101, 'Fee Statement'),

-- Scholarship Application (102)
(102, 'Student ID Card'),
(102, 'Application Form'),
(102, 'Academic Transcript'),
(102, 'Recommendation Letter'),

-- Student Loan Processing (103)
(103, 'Student ID Card'),
(103, 'Proof of Registration'),
(103, 'Bank Account Details'),
(103, 'Parent/Guardian ID'),

-- Bursary Enquiry (104)
(104, 'Student ID Card'),
(104, 'Proof of Registration'),
(104, 'Household Income Statement'),

-- Transcript Request (201)
(201, 'Student ID Card'),
(201, 'Application Form'),
(201, 'Payment Receipt'),

-- Certificate Collection (202)
(202, 'Student ID Card'),
(202, 'Completion Letter'),
(202, 'Payment Receipt'),

-- Course Registration (203)
(203, 'Student ID Card'),
(203, 'Course Registration Form'),

-- Graduation Application (204)
(204, 'Student ID Card'),
(204, 'Graduation Application Form'),
(204, 'Proof of Fee Payment'),
(204, 'Academic Clearance Letter'),

-- Name Change Request (205)
(205, 'Student ID Card'),
(205, 'Deed Poll / Legal Name Change Document'),
(205, 'Certified Copy of Birth Certificate'),

-- Student Card Renewal (301)
(301, 'Old Student Card'),
(301, 'Recent Passport Photo'),
(301, 'Proof of Registration'),

-- Accommodation Application (302)
(302, 'Student ID Card'),
(302, 'Application Form'),
(302, 'Proof of Registration'),
(302, 'Guardian Contact Details'),

-- Counselling Appointment (303)
(303, 'Student ID Card'),

-- Disciplinary Enquiry (304)
(304, 'Student ID Card'),
(304, 'Notice of Hearing Letter'),

-- Email Account Setup (401)
(401, 'Student ID Card'),
(401, 'Proof of Registration'),

-- Software License Request (402)
(402, 'Student ID Card'),
(402, 'Department Approval Form'),

-- IT Support (403)
(403, 'Student ID Card'),
(403, 'Device Serial Number (if applicable)'),

-- Network Access Request (404)
(404, 'Student ID Card'),
(404, 'Proof of Registration'),
(404, 'Device MAC Address'),

-- Library Card Registration (501)
(501, 'Student ID Card'),
(501, 'Proof of Registration'),

-- Research Assistance (502)
(502, 'Student ID Card'),

-- Book Return Processing (503)
(503, 'Library Card'),
(503, 'Books to Return'),

-- Interlibrary Loan Request (504)
(504, 'Library Card'),
(504, 'Book Request Form'),
(504, 'Supervisor Approval (postgraduate students only)');


-- ============================================================
-- 4. USER QUEUE (userQ)
-- Represents students currently waiting in each department.
-- createdAt is in TIME format (HH:MM:SS).
-- position is the student's place in the overall queue.
-- ============================================================
INSERT INTO userQ (userID, taskID, taskName, createdAt, position) VALUES
-- Finance Office queue (tasks 101, 102, 103, 104)
(23451, 101, 'Fee Payment',              '08:05:12', 1),
(89034, 101, 'Fee Payment',              '08:12:47', 2),
(54219, 102, 'Scholarship Application',  '08:18:03', 3),
(76102, 103, 'Student Loan Processing',  '08:22:31', 4),
(33897, 104, 'Bursary Enquiry',          '08:29:55', 5),

-- Registrar's Office queue (tasks 201, 202, 203, 205)
(67823, 201, 'Transcript Request',       '08:07:55', 1),
(31092, 203, 'Course Registration',      '08:15:30', 2),
(48560, 202, 'Certificate Collection',   '08:21:14', 3),
(92741, 205, 'Name Change Request',      '08:33:09', 4),

-- Student Affairs queue (tasks 301, 302, 303)
(45612, 301, 'Student Card Renewal',     '08:03:41', 1),
(78345, 302, 'Accommodation Application','08:09:22', 2),
(61034, 303, 'Counselling Appointment',  '08:25:47', 3),

-- IT Services queue (tasks 401, 402, 403, 404)
(12567, 401, 'Email Account Setup',      '08:11:08', 1),
(55230, 403, 'IT Support',               '08:16:52', 2),
(87419, 402, 'Software License Request', '08:24:39', 3),
(40023, 404, 'Network Access Request',   '08:31:20', 4),

-- Library Services queue (tasks 501, 502, 503, 504)
(96201, 501, 'Library Card Registration','08:06:33', 1),
(43887, 502, 'Research Assistance',      '08:19:50', 2),
(72654, 503, 'Book Return Processing',   '08:27:15', 3),
(18390, 504, 'Interlibrary Loan Request','08:35:02', 4);


-- ============================================================
-- 5. SERVICE DESK (serviceDesk)
-- Represents users who have been called forward and are
-- currently being attended to at the physical service desk.
-- These are separate from the waiting queue (userQ).
-- Composite PK: (userID, taskID)
-- ============================================================
INSERT INTO serviceDesk (userID, taskID, taskName, position) VALUES
-- Finance Office desk — 2 users being served
(11201, 101, 'Fee Payment',              1),
(29834, 102, 'Scholarship Application',  2),

-- Registrar's Office desk — 2 users being served
(60415, 201, 'Transcript Request',       1),
(73928, 203, 'Course Registration',      2),

-- Student Affairs desk — 1 user being served
(52177, 301, 'Student Card Renewal',     1),

-- IT Services desk — 2 users being served
(84630, 401, 'Email Account Setup',      1),
(37291, 403, 'IT Support',               2),

-- Library Services desk — 1 user being served
(91045, 501, 'Library Card Registration',1);


-- ============================================================
-- 6. STAFF ACCOUNTS (staffAccount)
-- Passwords are BCrypt-hashed (cost factor 10).
-- Compatible with Spring Security BCryptPasswordEncoder.
--
-- Username            | Plain-text password
-- --------------------|------------------------
-- finance_staff       | Finance@2026
-- registrar_staff     | Registrar@2026
-- student_affairs     | StudentAffairs@2026
-- it_staff            | ITServices@2026
-- library_staff       | Library@2026
-- ============================================================
INSERT INTO staffAccount (username, password, departmentID) VALUES
('finance_staff',
 '$2b$10$tKhs2l0daincKbKmIjTzkO0LC.QzYr7Ca/EmrhmLMY1tybn6v45pa',
 1),

('registrar_staff',
 '$2b$10$nL2otXXnoA6WvF0rf9hVXeTUy1BLIFBLaVv.gW/FSGspU/NembXqa',
 2),

('student_affairs',
 '$2b$10$X32B2LLAGwwnfswst9DhFuvXxD1YzGEAd6H8vSNqZaBPZTbyouH3K',
 3),

('it_staff',
 '$2b$10$VGtmYSqFiQe8wR4LjFEIHOZ/qSB0lhB59bL2oI1IViiUuMErAl0Z2',
 4),

('library_staff',
 '$2b$10$ltJnF5/0/.zClbMCd9Ij2./KiOO92tfLcA8hAltJU8KaQbNJG/jB6',
 5);


-- ============================================================
-- QUICK REFERENCE
-- ===============================3=============================
--
-- STAFF LOGIN CREDENTIALS (Staff Dashboard):
--   finance_staff       / Finance@2026
--   registrar_staff     / Registrar@2026
--   student_affairs     / StudentAffairs@2026
--   it_staff            / ITServices@2026
--   library_staff       / Library@2026
--
-- TEST QUEUE IDs (User Dashboard — Status screen):
--   Waiting in queue:
--     23451  → Finance / Fee Payment             (Position 1)
--     89034  → Finance / Fee Payment             (Position 2)
--     67823  → Registrar / Transcript Request    (Position 1)
--     45612  → Student Affairs / Card Renewal    (Position 1)
--     12567  → IT Services / Email Account Setup (Position 1)
--     96201  → Library / Card Registration       (Position 1)
--
--   Currently at service desk (serviceDesk table):
--     11201  → Finance / Fee Payment
--     60415  → Registrar / Transcript Request
--     52177  → Student Affairs / Card Renewal
--     84630  → IT Services / Email Account Setup
--     91045  → Library / Card Registration
--
-- UNAVAILABLE TASKS (hidden from User Dashboard join screen):
--   204 — Graduation Application (Registrar's Office)
--   304 — Disciplinary Enquiry   (Student Affairs)
-- ============================================================
