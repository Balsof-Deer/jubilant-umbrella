# User Manual
## UBotswana Queue Management System

**Version:** Beta v2  
**Date:** April 2026  
**Prepared by:** Pholoso Lekagane

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Student / User Guide](#3-student--user-guide)
   - 3.1 [Welcome Screen](#31-welcome-screen)
   - 3.2 [Joining a Queue](#32-joining-a-queue)
   - 3.3 [Checking Your Queue Status](#33-checking-your-queue-status)
   - 3.4 [Position Alerts](#34-position-alerts)
   - 3.5 [Leaving the Queue](#35-leaving-the-queue)
4. [Staff Guide](#4-staff-guide)
   - 4.1 [Logging In](#41-logging-in)
   - 4.2 [Viewing the Live Queue](#42-viewing-the-live-queue)
   - 4.3 [Serving a User](#43-serving-a-user)
   - 4.4 [Managing Tasks and Services](#44-managing-tasks-and-services)
5. [Troubleshooting](#5-troubleshooting)
6. [Quick Reference](#6-quick-reference)

---

## 1. Introduction

The **UBotswana Queue Management System** lets University of Botswana students join department service queues digitally — without standing in a physical line. Students receive a Queue ID, track their position in real time, and are notified when it is almost their turn.

Departmental staff use a separate app to monitor the live queue, serve students, and manage the services on offer.

**There are two apps:**

| App | Who uses it | What it does |
|-----|-------------|--------------|
| User Dashboard | Students / visitors | Join queues and check position |
| Staff Dashboard | Departmental staff | Manage the queue and serve students |

---

## 2. Getting Started

Both apps run in a web browser (via Expo for web) or on a mobile device through Expo Go.

**Requirements:**
- A device with a modern web browser, or the **Expo Go** app installed (Android / iOS)
- Access to the university's local network (the backend must be reachable)

**Accessing the apps:**
- Open the provided URL or scan the QR code shown when the app is started.
- If asked about the backend address and you are on a physical device, the system administrator will provide the correct IP address.

---

## 3. Student / User Guide

### 3.1 Welcome Screen

When you open the User Dashboard you will see the Welcome Screen.

**On desktop/tablet:** A split layout appears — the left side shows the University of Botswana branding; the right side shows two action buttons.

**On mobile:** A white card is centred on a maroon background with the same two buttons.

| Button | Where it takes you |
|--------|--------------------|
| **Join the Queue** | Join Screen — select a department and service |
| **Check Queue Status** | Status Screen — look up your position by Queue ID |

---

### 3.2 Joining a Queue

1. From the Welcome Screen, tap **Join the Queue**.
2. On the **Join Screen**, use the first dropdown to select your **Department** (e.g. Finance Office, Registrar's Office).
3. After selecting a department, the **Service** dropdown becomes active. Choose the service you need.
   - If a service shows an orange warning banner ("This service is currently unavailable"), it cannot be joined at this time. Select a different service or visit the desk directly.
4. Tap **Join Queue**.
5. You are automatically taken to the **Status Screen** with your **Queue ID** already loaded and your current position displayed.

> **Write down or remember your Queue ID.** You will need it if you close the app and want to check your position later.

---

### 3.3 Checking Your Queue Status

If you already have a Queue ID (e.g. you joined earlier):

1. From the Welcome Screen, tap **Check Queue Status**.
2. Enter your **Queue ID** in the text field (numbers only).
3. Tap **View Queue Details**.

The Status Screen shows:

| Detail | Description |
|--------|-------------|
| **Current Position** | Your place in the queue (1 = next to be served) |
| **Task / Service** | The service you are waiting for |
| **Queue ID** | Your unique identifier |
| **Joined** | The time you joined the queue |
| **Required Documents** | Documents you must bring to the desk |

The position updates **automatically every 30 seconds** — you do not need to refresh the page.

---

### 3.4 Position Alerts

The app will notify you as you move closer to the front:

| Your Position | Alert |
|--------------|-------|
| 3 or fewer | "Almost Your Turn" — an alert prompts you to stay nearby |
| 1 (next!) | "You're Next!" — an alert tells you to proceed to the service desk immediately |

These alerts appear once per session so they do not repeat unnecessarily.

The position card also changes colour to indicate urgency:
- **Green** — Position 1 (your turn now)
- **Orange** — Position 2 or 3 (almost your turn)
- **Maroon** — Position 4 or higher (continue waiting)

---

### 3.5 Leaving the Queue

If you no longer need to be served:

1. On the Status Screen, tap **Leave Queue**.
2. A confirmation dialog appears. Tap **Yes, Cancel** to confirm, or **Keep My Place** to stay in the queue.
3. On success, your queue entry is removed and the status display clears.

> This action cannot be undone. If you leave the queue you will need to join again.

---

## 4. Staff Guide

### 4.1 Logging In

1. Open the **Staff Dashboard** app.
2. Enter your **Username** and **Password**.
3. Tap **Login**.

On success, you are taken directly to the queue view for your department. Your login credentials are linked to a specific department — you will only see the queue for that department.

**If login fails:** Double-check your username and password. Contact your system administrator if you have forgotten your credentials or do not have an account.

> **Staff credentials are set up by the system administrator.** See the Technical Manual (Section 6.3 — Sample Data) for the default seed accounts used during testing.

---

### 4.2 Viewing the Live Queue

After logging in, the **Staff Dashboard** screen shows all users currently waiting in your department's queue.

Each queue card displays:

| Detail | Description |
|--------|-------------|
| **Queue ID** | The student's unique identifier |
| **Service** | The task / service they are waiting for |
| **Position** | Their place in the queue |
| **Joined** | The time they joined |

The queue is **sorted by join time** (oldest first — first in, first served).

The queue **auto-refreshes every 10 seconds**. You can also tap **Refresh** to update immediately.

If nobody is waiting, the screen shows: *"Queue is empty."*

---

### 4.3 Serving a User

When you are ready to serve the next student:

1. Find their card (the one at **Position 1**, or the next student in line).
2. Tap **Serve / Remove** on their card.
3. Confirm by tapping **OK** in the dialog.
4. The student is removed from the queue and the list updates.

> Call the student's **Queue ID** aloud or via your department's intercom so they know it is their turn.

---

### 4.4 Managing Tasks and Services

From the Staff Dashboard, tap **Manage Tasks** to open the Task Manager.

#### Viewing Existing Tasks

All tasks for all departments are listed as collapsible cards. Tap a card header to expand it and see its details and requirements.

#### Editing a Task

1. Expand the task card.
2. Update any fields: **Task Name**, **Duration** (`HH:MM:SS` format), or **Availability** (toggle on/off).
3. Tap **Save Changes**.

Changing **Availability** to *Unavailable* hides the service from students on the Join Screen — they will see a warning if they somehow select it.

#### Deleting a Task

1. Expand the task card.
2. Tap **Delete**.
3. Confirm by tapping **OK**.

> Deleting a task also removes all associated requirements and any users currently in the queue for that task. This action cannot be undone.

#### Adding a New Task

1. Fill in the **New Task** form at the bottom of the screen:
   - **Task ID** — a unique number you assign manually
   - **Task Name** — the service name students will see
   - **Duration** — estimated time in `HH:MM:SS`
   - **Availability** — whether it appears as joinable
   - **Department** — the department this task belongs to
2. Tap **Create Task**.

#### Managing Required Documents

Each task can have a list of documents students must bring.

**To add a document:**
1. Expand the task card.
2. Type the document name in the requirements text field (e.g. "Student ID Card").
3. Tap **Add**.

**To remove a document:**
1. Expand the task card.
2. Tap the **✕** button next to the document you want to remove.

---

## 5. Troubleshooting

| Problem | Likely Cause | What to do |
|---------|-------------|------------|
| "Error loading departments" on Join Screen | Backend is not running | Ensure the Spring Boot backend is started and reachable |
| "Could not reach the server" on Status Screen | Network issue or server offline | Check your network connection; confirm the backend is running |
| "No one with that Queue ID is currently in the queue" | ID does not exist or was already served | Verify the ID is correct; you may have already been served |
| Staff login returns "Invalid username or password" | Wrong credentials | Check for typos; contact the system administrator |
| Queue position not updating | Auto-poll is running (30s interval) | Wait up to 30 seconds; or close and reopen the Status Screen |
| Tasks not showing on Join Screen | All tasks are marked Unavailable, or no tasks exist for the department | Ask staff to check task availability via the Staff Dashboard |
| Staff Dashboard shows blank queue | No users have joined yet, or queue was cleared | This is expected — wait for students to join |

---

## 6. Quick Reference

### Student — Quick Steps

```
1. Open User Dashboard
2. Tap "Join the Queue"
3. Select Department → Select Service → Tap "Join Queue"
4. Note your Queue ID
5. Watch for position alerts as your turn approaches
6. When "You're Next!" appears → proceed to the service desk
```

### Staff — Quick Steps

```
1. Open Staff Dashboard
2. Enter username & password → Tap "Login"
3. Monitor queue (auto-refreshes every 10 seconds)
4. When ready → tap "Serve / Remove" on the next user's card
5. Call out the Queue ID and serve the student
```

### Default Test Credentials (Development / Testing Only)

| Username | Password | Department |
|----------|----------|------------|
| `finance_staff` | `Finance@2026` | Finance Office |
| `registrar_staff` | `Registrar@2026` | Registrar's Office |
| `student_affairs` | `StudentAffairs@2026` | Student Affairs |
| `it_staff` | `ITServices@2026` | IT Services |
| `library_staff` | `Library@2026` | Library Services |

### Sample Queue IDs for Testing

| Queue ID | Department | Service | Queue Position |
|----------|------------|---------|---------------|
| `23451` | Finance Office | Fee Payment | 1 |
| `89034` | Finance Office | Fee Payment | 2 |
| `67823` | Registrar's Office | Transcript Request | 1 |
| `45612` | Student Affairs | Student Card Renewal | 1 |
| `12567` | IT Services | Email Account Setup | 1 |
| `96201` | Library Services | Library Card Registration | 1 |
