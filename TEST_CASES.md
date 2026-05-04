# Test Cases for UBotswana Queue Management System

This document outlines the test cases for the UBotswana Queue Management System, covering the User Dashboard, Staff Dashboard, and Backend services.

## 1. User Dashboard (BETAv2-USER)

### 1.1 Welcome Screen
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-USER-01 | Verify Welcome Screen Load | App is installed and opened | Launch the User Dashboard app | Logo, "Queue Management System" title, and buttons for "Join the Queue" and "Check Queue Status" are visible. |
| TC-USER-02 | Navigate to Join Queue | Welcome screen is open | Click "Join the Queue" button | User is navigated to the Join Screen. |
| TC-USER-03 | Navigate to Status Screen | Welcome screen is open | Click "Check Queue Status" button | User is navigated to the Status Screen. |

### 1.2 Join Queue Screen
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-USER-04 | Join Queue Successfully | Backend is running | 1. Select a Department. 2. Select an Available Task. 3. Click "Join Queue". | User is navigated directly to the Status Screen with their Queue ID pre-loaded and status displayed. |
| TC-USER-05 | Validation: Incomplete Selection | Join screen is open | Select department but leave task unselected. | "Join Queue" button is disabled; no submission possible. |
| TC-USER-06 | Task Availability Warning | Department has some unavailable tasks | Select a department with an 'Unavailable' task and select it. | A warning banner ("This service is currently unavailable.") appears below the picker. |
| TC-USER-07 | Department Task Dependency | Join screen is open | Select Department A, then switch to Department B. | The Task list automatically clears and updates based on Department B. |
| TC-USER-08 | Handle Network Error on Load | Backend is offline | Open Join Queue Screen | Error message "Error loading departments" or "Error loading tasks" is displayed. |

### 1.3 Queue Status Screen
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-USER-09 | View Queue Position | User has a valid Queue ID | 1. Enter Queue ID. 2. Click "View Queue Details". | Details (ID, Task, Position, Required Documents) are displayed correctly. |
| TC-USER-10 | Leave Queue | User is viewing their status | 1. Click "Leave Queue". 2. Tap "Yes, Cancel" on the confirmation prompt. | Success alert "Your queue entry has been removed." is shown; status details are cleared. |
| TC-USER-11 | Non-existent Queue ID | ID is not in current queue | 1. Enter a non-existent ID. 2. Click "View Queue Details". | Error alert "Error: User not found in queue" is displayed. |
| TC-USER-12 | Empty Documents List | Task has no requirements | View status for a task with 0 requirements. | Display text: "No specific documents required." |
| TC-USER-13 | Invalid Input Type | Status screen is open | Try to type non-numeric characters in ID field. | Keyboard is restricted to numeric input (on mobile) or only numbers are accepted. |
| TC-USER-14 | Auto-Polling Position Update | User has active status loaded | Wait 30 seconds without interaction. | Position value refreshes automatically; "Updates automatically every 30 seconds" note is visible. |
| TC-USER-15 | Position Alert — Almost Your Turn | User's position drops to 2 or 3 | Monitor queue until position updates to ≤ 3 | Alert "Almost Your Turn" with current position number is displayed. |
| TC-USER-16 | Position Alert — You're Next | User's position reaches 1 | Monitor queue until position updates to 1 | Alert "You're Next!" directing user to the service desk is displayed once. |
| TC-USER-17 | Auto-Navigate After Join | Backend is running | Join a queue | User is automatically taken to Status Screen with Queue ID pre-filled and status loaded. |

---

## 2. Staff Dashboard (BETAv2-STAFF)

### 2.1 Staff Welcome Screen
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-STAFF-01 | Successful Staff Login | Backend is running, staff account exists | 1. Enter valid username (e.g. `finance_staff`). 2. Enter valid password (`Finance@2026`). 3. Click "Login". | Staff Dashboard opens filtered to the staff member's department. |
| TC-STAFF-02 | Login with Invalid Credentials | Backend is running | 1. Enter wrong username or password. 2. Click "Login". | Error message "Invalid username or password." is displayed; navigation does not occur. |
| TC-STAFF-02B | Login with Empty Fields | Welcome screen is open | Click "Login" without entering credentials. | Error message "Please enter your username and password." is displayed. |

### 2.2 Staff Dashboard (Queue View)
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-STAFF-03 | Automatic Refresh | Staff Dashboard is open | Wait for 10 seconds | The queue list refreshes automatically; no loading text interrupts the view. |
| TC-STAFF-04 | Manual Refresh | Staff Dashboard is open | Click the "Refresh" button | The queue list updates; "Loading queue..." text may appear briefly. |
| TC-STAFF-05 | Serve / Remove User | Users are in the queue | 1. Click "Serve / Remove". 2. Confirm "OK". | The user is removed from the dashboard and backend. |
| TC-STAFF-06 | Queue Empty State | No users in selected dept | Open Staff Dashboard for empty dept | Display text: "Queue is empty" is visible. |
| TC-STAFF-07 | Sorting Order | Multiple users join | Observe the queue list | Users are sorted by "Joined" time (oldest first/position 1). |

### 2.3 Manage Tasks Screen
| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-STAFF-08 | Add New Task | Manage Tasks is open | 1. Enter Task ID, Name, Duration. 2. Select Dept. 3. Click "Create Task". | Success alert "Task added" is shown; Task appears in "Existing Tasks". |
| TC-STAFF-09 | Toggle Task Availability | Existing task exists | 1. Expand task. 2. Toggle "Availability" switch. 3. Click "Save Changes". | Task status updates globally (e.g., changes from Available to Unavailable). |
| TC-STAFF-10 | Add Document Requirement | Existing task exists | 1. Expand task. 2. Enter "Passport". 3. Click "Add". | "Passport" appears in the required documents list for that task. |
| TC-STAFF-11 | Remove Document Requirement | Task has requirements | 1. Expand task. 2. Click "✕" next to a document. | Requirement is immediately removed from the task. |
| TC-STAFF-12 | Delete Task | Existing task exists | 1. Click "Delete". 2. Confirm "OK". | Task and all its associated requirements are deleted from the system. |
| TC-STAFF-13 | Task Expansion | Multiple tasks exist | Click on a task card header | Card expands to show edit fields and requirements; other cards remain collapsed. |

---

## 3. Backend (Java/Spring Boot)

### 3.1 REST API endpoints
| Test Case ID | Description | Method | Endpoint | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-API-01 | Fetch All Departments | GET | `/departments/all` | Returns JSON list of all departments. |
| TC-API-02 | Fetch Tasks by Dept | GET | `/tasks/department/{id}` | Returns only tasks assigned to the specific department. |
| TC-API-03 | Join Queue (Auto-ID) | POST | `/userq/queue?taskID={id}` | Creates new entry and returns JSON with generated `userID`. |
| TC-API-04 | Get User Position | GET | `/userq/position/{id}` | Returns integer representing wait position (e.g., 1). |
| TC-API-05 | Remove User | DELETE | `/userq/remove/{id}` | Removes entry; returns 200 OK. |
| TC-API-06 | Fetch All Tasks | GET | `/tasks/all` | Returns all tasks with their department objects. |
| TC-API-07 | Fetch Requirements | GET | `/requirements/task/{id}` | Returns list of documents for specific task. |
| TC-API-08 | Staff Login — Valid Credentials | POST | `/auth/login` | Returns JSON with `staffID`, `username`, `departmentID`, `departmentName`. |
| TC-API-09 | Staff Login — Invalid Password | POST | `/auth/login` | Returns `401` with `{ "error": "Invalid username or password." }`. |
| TC-API-10 | Staff Login — Missing Fields | POST | `/auth/login` | Returns `400` with appropriate error message. |
| TC-API-11 | Staff Register — New Account | POST | `/auth/register` | Returns `200` with `{ "message": "Staff account created successfully.", "username": "..." }`. |
| TC-API-12 | Staff Register — Duplicate Username | POST | `/auth/register` | Returns `409` with `{ "error": "Username already exists." }`. |

---

## 4. Visual & UI Consistency (Web/Mobile)

| Test Case ID | Description | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-UI-01 | Button Hover Effect | Running on Web | Hover over "Serve / Remove" or "Delete" | Bordered button fills with Red; text turns White. |
| TC-UI-02 | Logo Consistency | Any screen | View the logo | `UBotswana.png` is displayed in the header and welcome screens. |
| TC-UI-03 | Form Validation Feedback | Join Screen | Submit with missing data | Warning/Error box appears with descriptive text. |
| TC-UI-04 | Navigation Links | Staff Dashboard | Click "Back to Home" | User is returned to the initial Staff Welcome Screen. |
| TC-UI-05 | Responsive Cards | Any device | Resize window | Cards take full width on mobile and fixed width on desktop. |
