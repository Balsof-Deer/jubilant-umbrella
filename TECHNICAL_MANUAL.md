# Technical Manual
## UBotswana Queue Management System

**Version:** Beta v2  
**Date:** April 2026  
**Prepared by:** Pholoso Lekagane

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [System Requirements](#4-system-requirements)
5. [Project Structure](#5-project-structure)
6. [Backend — Spring Boot API](#6-backend--spring-boot-api)
   - 6.1 [Data Models](#61-data-models)
   - 6.2 [REST API Reference](#62-rest-api-reference)
   - 6.3 [Database Schema](#63-database-schema)
   - 6.4 [Configuration](#64-configuration)
7. [User Dashboard — BETAv2-USER](#7-user-dashboard--betav2-user)
8. [Staff Dashboard — BETAv2-STAFF](#8-staff-dashboard--betav2-staff)
9. [Installation & Setup](#9-installation--setup)
10. [Running the System](#10-running-the-system)
11. [API Configuration (Frontend)](#11-api-configuration-frontend)
12. [Known Limitations & Security Notes](#12-known-limitations--security-notes)

---

## 1. System Overview

The **UBotswana Queue Management System** is a three-tier web/mobile application designed for the University of Botswana. It digitises the process of joining and managing service queues at university departments.

**System Components:**

| Component | Role |
|-----------|------|
| Spring Boot Backend | REST API server, database operations |
| User Dashboard (BETAv2-USER) | React Native app for students/users |
| Staff Dashboard (BETAv2-STAFF) | React Native app for departmental staff |

**High-Level Flow:**
```
User selects department & task
        ↓
System assigns a unique Queue ID
        ↓
User monitors their position and required documents
        ↓
Staff views live queue, calls next user, marks as served
        ↓
User is removed from queue
```

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│                                                         │
│  ┌──────────────────┐    ┌──────────────────────────┐   │
│  │  User Dashboard  │    │    Staff Dashboard       │   │
│  │  (React Native / │    │    (React Native /        │   │
│  │   Expo v54)      │    │     Expo v54)             │   │
│  └────────┬─────────┘    └────────────┬─────────────┘   │
└───────────┼──────────────────────────┼─────────────────┘
            │  HTTP REST               │  HTTP REST
            │  (port 8080)             │  (port 8080)
┌───────────┼──────────────────────────┼─────────────────┐
│           ▼        API LAYER         ▼                  │
│                                                         │
│           Spring Boot REST API (Java 21)                │
│           @CrossOrigin(origins = "*")                   │
│                                                         │
│   Controllers:                                          │
│   • UserQController       /api/userq/**                 │
│   • TaskListController    /api/tasks/**                 │
│   • DepartmentController  /api/departments/**           │
│   • RequirementController /api/requirements/**          │
│   • ServiceDeskController /api/serviceDesk/**           │
│   • AuthController        /api/auth/**                  │
└───────────────────────────┬─────────────────────────────┘
                            │  JPA / Hibernate
┌───────────────────────────┼─────────────────────────────┐
│           DATA LAYER      ▼                             │
│                                                         │
│           MySQL 8.x  (Database: ProjectSQL)             │
│                                                         │
│   Tables:                                               │
│   • userq            • tasklist                         │
│   • departmentlist   • requirements                     │
│   • servicedesk      • staffaccount                     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Runtime |
| Spring Boot | 4.0.3 | Web framework |
| Spring Data JPA | (via Boot) | ORM layer |
| Hibernate | (via JPA) | SQL generation |
| MySQL Connector/J | (latest) | Database driver |
| Lombok | (latest) | Boilerplate reduction |
| H2 Database | (runtime) | In-memory test DB |
| Spring Security Crypto | (via Boot) | BCrypt password hashing |
| Maven | (wrapper) | Build & dependency management |

### Frontend (Both Dashboards)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile/web UI |
| Expo | v54 | Build toolchain & native APIs |
| React Navigation | (native-stack) | Screen navigation |
| React Native Picker | (community) | Dropdown selectors |
| Fetch API | (built-in) | HTTP requests |

---

## 4. System Requirements

### Development Machine
- **OS:** macOS, Windows, or Linux
- **Java:** JDK 21+
- **Maven:** 3.8+ (or use included `./mvnw`)
- **Node.js:** 18+
- **npm:** 9+
- **MySQL:** 8.0+
- **Expo CLI:** `npm install -g expo-cli` (optional, `npx expo` works)

### Runtime
- Backend: Any machine with Java 21+ and MySQL access
- Frontends: Any device with a modern browser or Android/iOS (via Expo Go)

---

## 5. Project Structure

```
untitled folder 2/
│
├── backend/                              # Spring Boot REST API
│   ├── pom.xml                           # Maven project descriptor
│   ├── mvnw / mvnw.cmd                   # Maven wrapper scripts
│   └── src/
│       └── main/
│           ├── java/com/example/backend/
│           │   ├── BackendApplication.java    # Entry point (@SpringBootApplication)
│           │   ├── CONTROLLER/                # REST controllers
│           │   │   ├── UserQController.java
│           │   │   ├── TaskListController.java
│           │   │   ├── DepartmentController.java
│           │   │   ├── RequirementController.java
│           │   │   ├── ServiceDeskController.java
│           │   │   └── AuthController.java        # Staff login & registration
│           │   ├── MODEL/                     # JPA entities
│           │   │   ├── UserQ.java
│           │   │   ├── TaskList.java
│           │   │   ├── DepartmentList.java
│           │   │   ├── ServiceDesk.java
│           │   │   ├── ServiceDeskKey.java    # Composite PK
│           │   │   ├── Requirements.java
│           │   │   ├── RequirementsKey.java   # Composite PK
│           │   │   └── StaffAccount.java          # Staff credentials entity
│           │   └── REPOSITORIES/              # Spring Data interfaces
│           │       ├── UserQRepository.java
│           │       ├── TaskListRepository.java
│           │       ├── DepartmentListRepository.java
│           │       ├── RequirementsRepository.java
│           │       ├── ServiceDeskRepository.java
│           │       └── StaffAccountRepository.java
│           └── resources/
│               └── application.properties     # DB config & JPA settings
│
├── BETAv2-USER/
│   └── UserDashboard/                    # User-facing React Native app
│       ├── App.js                        # Navigator setup
│       ├── app.json                      # Expo metadata
│       ├── package.json
│       ├── constants/
│       │   ├── Api.js                    # API base URL
│       │   └── Theme.js                  # Design tokens (colors, styles)
│       ├── screens/
│       │   ├── UserWelcomeScreen.js      # Landing / home screen
│       │   ├── JoinScreen.js             # Join a queue
│       │   └── StatusScreen.js           # Check queue status
│       └── assets/                       # Images (logos, icons)
│
├── BETAv2-STAFF/
│   └── StaffDashboard/                   # Staff-facing React Native app
│       ├── App.js
│       ├── app.json
│       ├── package.json
│       ├── constants/
│       │   ├── Api.js
│       │   └── Theme.js
│       ├── screens/
│       │   ├── WelcomeScreen.js          # Department login
│       │   ├── StaffDashboard.js         # Live queue view
│       │   └── ManageTasks.js            # Task/requirement CRUD
│       └── assets/
│
├── sample_data.sql                       # Seed script (departments, tasks, requirements, staff accounts)
├── TECHNICAL_MANUAL.md                   # This document
├── USER_MANUAL.md                        # End-user guide (students and staff)
├── QA_REPORT.md
└── TEST_CASES.md
```

---

## 6. Backend — Spring Boot API

### 6.1 Data Models

#### `UserQ` — Queue Entry
Represents a user's current position in the queue.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `userID` | `Integer` | Primary Key | Auto-generated 5-digit ID (10000–99999) |
| `taskID` | `Integer` | — | Foreign reference to `TaskList.taskID` |
| `taskName` | `String` | — | Denormalized task name for display |
| `createdAt` | `LocalTime` | — | Time the user joined the queue |
| `position` | `Integer` | — | Stored position value |

**ID Generation Logic** (`UserQController`): A random integer between 10000 and 99999 is generated and checked for uniqueness before insertion.

---

#### `TaskList` — Service / Task
Represents a service offered by a department.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `taskID` | `Integer` | Primary Key | Unique service identifier |
| `taskName` | `String` | — | Human-readable service name |
| `duration` | `LocalTime` | — | Estimated service duration (HH:MM:SS) |
| `availability` | `String` | `"Available"` / `"Unavailable"` | Whether users can join this queue |
| `department` | `DepartmentList` | `@ManyToOne` | Owning department |

---

#### `DepartmentList` — Department
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `departmentID` | `Integer` | Primary Key | Unique department identifier |
| `departmentName` | `String` | — | Display name |

---

#### `Requirements` — Task Documents
Composite-key entity listing required documents per task.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `taskID` | `Integer` | Composite PK (part 1) | Links to `TaskList` |
| `document` | `String` | Composite PK (part 2) | Document name (e.g., "Passport") |

Composite Key class: `RequirementsKey`

---

#### `ServiceDesk` — Service Desk Queue
Composite-key entity tracking user-task assignments at the desk.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `userID` | `Integer` | Composite PK (part 1) | Linked queue user |
| `taskID` | `Integer` | Composite PK (part 2) | Linked task |
| `taskName` | `String` | — | Denormalized display |
| `position` | `Integer` | — | Position at desk |

Composite Key class: `ServiceDeskKey`

---

#### `StaffAccount` — Staff Credentials
Stores staff login credentials linked to a department.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `staffID` | `Integer` | Primary Key, auto-increment | Unique staff identifier |
| `username` | `String` | `UNIQUE`, `NOT NULL` | Login username |
| `password` | `String` | `NOT NULL` | BCrypt-hashed password |
| `department` | `DepartmentList` | `@ManyToOne`, `NOT NULL` | Associated department |

**Password Storage:** Passwords are hashed with `BCryptPasswordEncoder` (Spring Security Crypto). Plain-text passwords are never persisted.

---

### 6.2 REST API Reference

All endpoints are prefixed with `/api`. CORS is globally open (`origins = "*"`).

---

#### Users / Queue — `/api/userq`

| Method | Endpoint | Description | Request Body / Params | Response |
|--------|----------|-------------|----------------------|----------|
| `GET` | `/api/userq/all` | Retrieve all queue entries | — | `List<UserQ>` |
| `GET` | `/api/userq/{userID}` | Get a specific user entry | Path: `userID` | `UserQ` or 404 |
| `GET` | `/api/userq/count` | Total number of users in queue | — | `Integer` |
| `GET` | `/api/userq/position/{userID}` | Get user's position in their department queue | Path: `userID` | `Integer` |
| `GET` | `/api/userq/department/{departmentID}` | All users in a department's queue | Path: `departmentID` | `List<UserQ>` |
| `POST` | `/api/userq/queue?taskID={id}` | Add user to queue | Query: `taskID` | `UserQ` (with assigned `userID`) |
| `DELETE` | `/api/userq/remove/{userID}` | Remove user from queue | Path: `userID` | `200 OK` |

---

#### Tasks — `/api/tasks`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/tasks/all` | All tasks | — | `List<TaskList>` |
| `GET` | `/api/tasks/department/{departmentID}` | Tasks for a department | — | `List<TaskList>` |
| `POST` | `/api/tasks/add` | Create a new task | `TaskList` JSON | `TaskList` |
| `PUT` | `/api/tasks/update/{id}` | Update task fields | `TaskList` JSON | `TaskList` |
| `DELETE` | `/api/tasks/delete/{id}` | Delete task (cascades) | — | `200 OK` |

**Cascade on delete:** Removes associated `Requirements`, `UserQ` entries, and `ServiceDesk` entries.

---

#### Departments — `/api/departments`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/departments/all` | All departments | `List<DepartmentList>` |

---

#### Requirements — `/api/requirements`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/requirements/task/{taskID}` | Requirements for a task | — | `List<Requirements>` |
| `POST` | `/api/requirements/add` | Add a requirement | `Requirements` JSON | `Requirements` |
| `DELETE` | `/api/requirements/delete/{taskID}/{document}` | Remove a requirement | — | `200 OK` |

---

#### Service Desk — `/api/serviceDesk`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/serviceDesk/all` | All service desk entries | `List<ServiceDesk>` |
| `GET` | `/api/serviceDesk/position/{userID}` | User's desk position + required docs | Object |
| `DELETE` | `/api/serviceDesk/delete/{userID}/{taskID}` | Remove desk entry | `200 OK` |

---

#### Authentication — `/api/auth`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/auth/login` | Authenticate a staff member | `{ "username": "...", "password": "..." }` | `{ staffID, username, departmentID, departmentName }` or `401` |
| `POST` | `/api/auth/register` | Create a new staff account | `{ "username": "...", "password": "...", "departmentID": 1 }` | `{ message, username }` or `400`/`409` |

**Login response (200 OK):**
```json
{
  "staffID": 1,
  "username": "finance_staff",
  "departmentID": 1,
  "departmentName": "Finance Office"
}
```

> **Note:** The `/register` endpoint should be restricted or removed after initial staff account setup in production.

---

### 6.3 Database Schema

**Database name:** `ProjectSQL`

```sql
-- Departments
CREATE TABLE departmentlist (
    departmentID INT PRIMARY KEY,
    departmentName VARCHAR(255)
);

-- Tasks / Services
CREATE TABLE tasklist (
    taskID INT PRIMARY KEY,
    taskName VARCHAR(255),
    duration TIME,
    availability VARCHAR(50),    -- 'Available' or 'Unavailable'
    department_departmentID INT,
    FOREIGN KEY (department_departmentID) REFERENCES departmentlist(departmentID)
);

-- User Queue Entries
CREATE TABLE userq (
    userID INT PRIMARY KEY,      -- Random 5-digit, 10000-99999
    taskID INT,
    taskName VARCHAR(255),
    createdAt TIME,
    position INT
);

-- Task Requirements (documents)
CREATE TABLE requirements (
    taskID INT,
    document VARCHAR(255),
    PRIMARY KEY (taskID, document),
    FOREIGN KEY (taskID) REFERENCES tasklist(taskID)
);

-- Service Desk Queue
CREATE TABLE servicedesk (
    userID INT,
    taskID INT,
    taskName VARCHAR(255),
    position INT,
    PRIMARY KEY (userID, taskID)
);

-- Staff Accounts
CREATE TABLE staffaccount (
    staffID    INT PRIMARY KEY AUTO_INCREMENT,
    username   VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- BCrypt hash
    departmentID INT NOT NULL,
    FOREIGN KEY (departmentID) REFERENCES departmentlist(departmentID)
);
```

> **Note:** JPA `ddl-auto=update` manages schema creation automatically. The SQL above is for reference.

#### Sample Data
A `sample_data.sql` script is included in the project root. Run it after the backend has started at least once (so JPA can create the tables). It seeds all five departments, tasks, requirements, queue entries, service desk entries, and staff accounts.

Staff accounts included in the seed data:

| Username | Password | Department |
|----------|----------|------------|
| `finance_staff` | `Finance@2026` | Finance Office |
| `registrar_staff` | `Registrar@2026` | Registrar's Office |
| `student_affairs` | `StudentAffairs@2026` | Student Affairs |
| `it_staff` | `ITServices@2026` | IT Services |
| `library_staff` | `Library@2026` | Library Services |

---

### 6.4 Configuration

**File:** `backend/src/main/resources/application.properties`

```properties
spring.application.name=backend

# MySQL DataSource
spring.datasource.url=jdbc:mysql://localhost:3306/ProjectSQL
spring.datasource.username=root
spring.datasource.password=12345678
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.show-sql=true
```

> **Security Note:** Change `spring.datasource.password` before any non-local deployment and never commit credentials to version control.

---

## 7. User Dashboard — BETAv2-USER

### Entry Point
`BETAv2-USER/UserDashboard/App.js` — sets up React Navigation with a `NativeStack` navigator. Initial screen: `UserWelcomeScreen`.

### Navigation Stack

```
UserWelcomeScreen (Home)
    ├── → JoinScreen (Join)
    └── → StatusScreen (Status)
```

### Screen Reference

| Screen | File | Route Name | Purpose |
|--------|------|------------|---------|
| Welcome | `UserWelcomeScreen.js` | `"Home"` | Landing page with "Join the Queue" and "Check Queue Status" navigation |
| Join Queue | `JoinScreen.js` | `"Join"` | Select department/task, join queue |
| Queue Status | `StatusScreen.js` | `"Status"` | Look up queue ID, view live position, cancel |

### Key Logic — UserWelcomeScreen

- **Desktop/tablet layout:** split-panel — left maroon branding panel (logo, title, feature list) + right action panel with two large buttons.
- **Mobile layout:** full-screen maroon background with a centered white card containing the logo, title, and two action buttons.
- Uses `useResponsive()` to switch between layouts at the `md` (768px) breakpoint.

### Key Logic — JoinScreen

1. On mount: fetches `/api/departments/all` to populate department dropdown.
2. On department select: fetches `/api/tasks/department/{id}`. All tasks are shown in the picker; unavailable tasks display a warning banner.
3. On submit: `POST /api/userq/queue?taskID={id}` — on success, navigates directly to `StatusScreen` with the returned `userID` pre-loaded (`initialUserID` route param).
4. Responsive layout: two-column (form + info panel) on tablet/desktop; single-column card stack on mobile.

### Key Logic — StatusScreen

1. Accepts `initialUserID` route param — if present, auto-fetches status on mount.
2. On lookup: parallel `Promise.all` calls to `/api/userq/{userID}` and `/api/userq/position/{userID}`.
3. Fetches `/api/requirements/task/{taskID}` to list required documents.
4. **Auto-polling:** starts a 30-second interval (`POLL_INTERVAL_MS = 30000`) after a successful lookup; silently updates the displayed position.
5. **Position alerts:** when position drops to ≤ 3 (`ALERT_THRESHOLD`), an alert prompts the user to stay nearby. When position reaches 1, a "You're Next!" alert fires once per lookup session.
6. On cancel ("Leave Queue"): `DELETE /api/userq/remove/{userID}` with confirmation dialog; polling stops on cancel.
7. Responsive layout: two-column (lookup panel + status display) on tablet/desktop; single-column on mobile.

### API Configuration
`BETAv2-USER/UserDashboard/constants/Api.js`
```javascript
export const IP_ADDRESS = 'localhost';
export const PORT = '8080';
export const API_BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;
```

### Design Tokens
`BETAv2-USER/UserDashboard/constants/Theme.js`

The theme was fully redesigned. It now exports a comprehensive design system shared across all screens.

**`COLORS` — brand palette**

| Token | Value | Usage |
|-------|-------|-------|
| `primaryMaroon` | `#7A0019` | Primary buttons, badges, brand elements |
| `maroonDark` | `#5C0013` | Hover / pressed states |
| `maroonLight` | `#9B0020` | Lighter accent |
| `gold` / `goldLight` | `#C9A84C` / `#F0D080` | Dividers, decorative accents |
| `darkGray` | `#101828` | Headings, primary text |
| `bodyGray` | `#344054` | Body text |
| `subtleGray` | `#667085` | Placeholders, secondary labels |
| `borderGray` | `#E4E7EC` | Card and input borders |
| `lightGray` | `#F2F4F7` | Screen backgrounds |
| `surfaceGray` | `#F8F9FB` | Card inner surfaces |
| `error` / `errorLight` | `#D92D20` / `#FEF3F2` | Destructive actions, error states |
| `success` / `successLight` | `#027A48` / `#ECFDF3` | Confirmations, position-1 indicator |
| `warning` / `warningLight` | `#B54708` / `#FFFAEB` | Near-turn alerts, unavailable services |
| `info` / `infoLight` | `#026AA2` / `#F0F9FF` | Informational banners |

**`BP` — responsive breakpoints**

| Key | Value | Description |
|-----|-------|-------------|
| `sm` | 480px | Small mobile |
| `md` | 768px | Tablet (mobile/desktop split point) |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

**`useResponsive()` hook** — call inside any component to get `{ width, isMobile, isTablet, isDesktop, isWide, contentWidth, cols }`.

**`RADIUS`** — `{ sm: 8, md: 12, lg: 16, xl: 24 }`

**`SHADOW`** — `sm`, `md`, `lg` shadow presets with matching elevation values.

**`COMMON_STYLES`** — reusable style objects: `card`, `header`, `headerText`, `btnPrimary`, `btnText`, `label`, `input`, `sectionLabel`.

> The Staff Dashboard (`BETAv2-STAFF/StaffDashboard/constants/Theme.js`) exports an identical design system, keeping both apps visually consistent.

---

## 8. Staff Dashboard — BETAv2-STAFF

### Entry Point
`BETAv2-STAFF/StaffDashboard/App.js` — same stack navigation pattern. Initial screen: `WelcomeScreen`.

### Navigation Stack

```
WelcomeScreen (Welcome)
    └── → StaffDashboard (Staff)  [receives departmentID, departmentName, staffID, username params]
            └── → ManageTasks (ManageTasks)
```

### Screen Reference

| Screen | File | Route Name | Purpose |
|--------|------|------------|---------|
| Staff Welcome | `WelcomeScreen.js` | `"Welcome"` | Username/password login |
| Queue View | `StaffDashboard.js` | `"Staff"` | Live queue for department, serve users |
| Task Manager | `ManageTasks.js` | `"ManageTasks"` | CRUD for tasks and requirements |

### Key Logic — WelcomeScreen (Login)

- Displays a username and password form.
- On submit: `POST /api/auth/login` with `{ username, password }`.
- On success: navigates to `StaffDashboard` passing `departmentID`, `departmentName`, `staffID`, and `username` from the response.
- On failure: displays the error message returned by the API (e.g. "Invalid username or password.").

### Key Logic — StaffDashboard

- Receives `departmentID` and `departmentName` via route params.
- Fetches `/api/userq/department/{departmentID}` on mount and every 10 seconds (auto-refresh via `setInterval`).
- Sorts queue by `createdAt` (ascending — first in, first served).
- Removal: `DELETE /api/userq/remove/{userID}` with `Alert.alert` confirmation.

### Key Logic — ManageTasks

**Existing Tasks:**
- Loads all tasks (`/api/tasks/all`) and requirements per task (`/api/requirements/task/{taskID}`) on mount.
- Task cards are collapsible; only one expands at a time.
- Updates via `PUT /api/tasks/update/{taskID}` with the full updated task object.
- Cascading delete via `DELETE /api/tasks/delete/{taskID}`.

**New Task Form:**
- Fields: Task ID (manual), Task Name, Duration (`HH:MM:SS`), Availability (toggle), Department (picker).
- Submits via `POST /api/tasks/add`.

**Requirements Management:**
- Per-task text input adds new document: `POST /api/requirements/add`.
- Inline delete button: `DELETE /api/requirements/delete/{taskID}/{document}`.

---

## 9. Installation & Setup

### Step 1 — Database Setup

```sql
-- In MySQL shell or workbench
CREATE DATABASE ProjectSQL;
USE ProjectSQL;
-- Tables are created automatically by JPA on first run
```

After the backend has started once and JPA has created all tables, load the sample data:

```bash
mysql -u root -p ProjectSQL < sample_data.sql
```

This seeds departments, tasks, requirements, queue entries, service desk entries, and staff accounts.

### Step 2 — Backend Setup

```bash
cd "untitled folder 2/backend"

# Build
./mvnw clean install

# Run
./mvnw spring-boot:run
```

The API will start at `http://localhost:8080`.

### Step 3 — User Dashboard Setup

```bash
cd "untitled folder 2/BETAv2-USER/UserDashboard"
npm install
npx expo start
```

Press `w` for web, `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

### Step 4 — Staff Dashboard Setup

```bash
cd "untitled folder 2/BETAv2-STAFF/StaffDashboard"
npm install
npx expo start
```

---

## 10. Running the System

Start components in this order:

1. **MySQL** — ensure the service is running and `ProjectSQL` database exists.
2. **Backend** — `./mvnw spring-boot:run` inside `backend/`.
3. **User Dashboard** — `npx expo start` inside `BETAv2-USER/UserDashboard/`.
4. **Staff Dashboard** — `npx expo start` inside `BETAv2-STAFF/StaffDashboard/`.

---

## 11. API Configuration (Frontend)

Both dashboards share the same pattern. To point the frontends at a different backend host:

**User Dashboard:** `BETAv2-USER/UserDashboard/constants/Api.js`  
**Staff Dashboard:** `BETAv2-STAFF/StaffDashboard/constants/Api.js`

```javascript
// Change IP_ADDRESS to the backend machine's IP on your network
export const IP_ADDRESS = '192.168.1.100';   // example
export const PORT = '8080';
export const API_BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;
```

> On physical devices, `localhost` refers to the device itself. You must use the backend machine's LAN IP (e.g., `192.168.x.x`).

---

## 12. Known Limitations & Security Notes

| Area | Issue | Recommendation |
|------|-------|----------------|
| Authentication | Staff login uses BCrypt password verification, but there is no session/token management — the frontend receives no JWT/session; any client can still call staff-only endpoints directly | Add JWT or session tokens; add Spring Security filter to protect staff endpoints |
| Staff Registration | `POST /api/auth/register` is open with no admin guard | Remove or restrict after initial account setup |
| CORS | `@CrossOrigin(origins = "*")` allows all origins | Restrict to known frontend origins in production |
| Database credentials | Hardcoded in `application.properties` | Use environment variables or a secrets manager |
| API URL | Hardcoded `localhost:8080` in frontend constants | Use a config file or environment variable per build target |
| User ID generation | Random 5-digit int — collisions possible under high concurrency | Use a database sequence or UUID |
| No HTTPS | All communication is plain HTTP | Add TLS/SSL for any network beyond localhost |
| `ddl-auto=update` | Can alter schema unexpectedly in production | Switch to `validate` or use Flyway/Liquibase for migrations |
| No input validation on frontend | Text fields accept any value | Add length and format validation to all form fields |
