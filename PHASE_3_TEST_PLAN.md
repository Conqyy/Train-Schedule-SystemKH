# Phase 3 – Formal Test Plan

**Project:** Train Schedule and Reservation Management System  
**Version:** 1.0 (75% Release)  
**Date:** 2026-05-16  
**Prepared by:** QA Team (Khalid, Turki, Ahmad)

---

## 1. Test Scope

This test plan covers automated and manual browser-based testing for:

- **Use Case #4** — Process Ticket Reservation
- **Use Case #9** — Manage Train Schedules (Admin CRUD)

---

## 2. Test Environment

| Item | Detail |
|------|--------|
| Application URL | `http://localhost:3000` |
| Browser | Chromium (Automated via Browser Subagent) |
| Data Store | Browser localStorage (mock) |
| Framework | Next.js 15 + React 19 |

---

## 3. Use Case #4 — Process Ticket Reservation

### Test Cases

| Test ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
|---------|-------------|----------------|------------|-----------------|--------|
| TC-4.1 | Book a ticket with valid data | At least one train has available seats | 1. Navigate to `/book` 2. Select a train from dropdown 3. Enter passenger name 4. Enter passenger email 5. Click "Confirm Reservation" | Booking confirmation screen appears with reservation ID, seat number, and success message. Available seats on the train are decremented by 1. | **Pending** |
| TC-4.2 | Verify seat count decreases after booking | A booking has just been made (TC-4.1 passed) | 1. Navigate to `/` (home) 2. Find the train that was booked 3. Check the available seats count | Available seats should be one less than before the booking. | **Pending** |
| TC-4.3 | Attempt booking with empty passenger name | Train is selected | 1. Navigate to `/book` 2. Select a train 3. Leave name field empty 4. Enter email 5. Click "Confirm Reservation" | Form validation prevents submission; booking is NOT created. | **Pending** |
| TC-4.4 | Verify reservation appears in Admin dashboard | A booking exists (TC-4.1 passed) | 1. Navigate to `/admin` 2. View the Reservations tab | The new reservation appears in the table with correct passenger name, train, seat number, and "confirmed" status. | **Pending** |
| TC-4.5 | Cancel a reservation and verify seat restoration | A confirmed reservation exists | 1. Navigate to `/admin` 2. Click "Cancel" on a confirmed reservation 3. Navigate to `/` and check available seats | Reservation status changes to "cancelled". Available seats on the train are incremented by 1. | **Pending** |

---

## 4. Use Case #9 — Manage Train Schedules (Admin)

### Test Cases

| Test ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
|---------|-------------|----------------|------------|-----------------|--------|
| TC-9.1 | Add a new train with valid data | Admin is on the Admin Dashboard | 1. Navigate to `/admin` 2. Click "Manage Trains" tab 3. Fill in: ID=TR-007, Name="Desert Express", Origin="Riyadh", Dest="Tabuk", Departure=15:00, Arrival=21:00, Seats=200, Price=180, Status=On Time 4. Click "Add Train" | Success message appears. Train list increases by 1. New train is visible in the Trains tab. | **Pending** |
| TC-9.2 | Prevent adding a duplicate train ID | Train TR-007 already exists (TC-9.1 passed) | 1. Go to Manage Trains tab 2. Enter ID=TR-007 with any other details 3. Click "Add Train" | Error message: 'Train ID "TR-007" already exists.' Train is NOT added. | **Pending** |
| TC-9.3 | Edit an existing train's departure time and capacity | At least one train exists | 1. Go to Trains tab 2. Click "Edit" on a train 3. Change departure time and total seats 4. Click "Save Changes" | Success message appears. The train's details are updated in the Trains tab. | **Pending** |
| TC-9.4 | Delete a cancelled train | A train with status "cancelled" exists | 1. Go to Trains tab 2. Locate a cancelled train 3. Click "Delete" 4. Confirm the deletion | Train is removed from the list. Total train count decreases by 1. | **Pending** |
| TC-9.5 | Prevent deleting a non-cancelled train | A train with status "on-time" exists | 1. Go to Trains tab 2. Verify that "Delete" button is NOT shown for on-time trains | Delete button should only appear for trains with "cancelled" status. Non-cancelled trains cannot be deleted. | **Pending** |

---

## 5. Use Case #1 / #2 / #8 — Authentication

### Test Cases

| Test ID | Description | Pre-conditions | Test Steps | Expected Result | Status |
|---------|-------------|----------------|------------|-----------------|--------|
| TC-1.1 | Register a new passenger account | No prior account exists | 1. Navigate to `/register` 2. Enter name, email, password, confirm password 3. Click "Create Account" | Success message appears. User is redirected to `/login`. | **Pending** |
| TC-2.1 | Login as admin | N/A | 1. Navigate to `/login` 2. Enter email=admin@trains.com, password=admin 3. Click "Sign In" | User is redirected to `/admin`. Navbar shows "Admin" with admin badge. | **Pending** |
| TC-8.1 | Login as registered passenger | Account was registered in TC-1.1 | 1. Navigate to `/login` 2. Enter registered email and password 3. Click "Sign In" | User is redirected to `/` (home). Navbar shows user name. | **Pending** |
| TC-8.2 | Login with invalid credentials | N/A | 1. Navigate to `/login` 2. Enter wrong email/password 3. Click "Sign In" | Error message: "Invalid email or password." User stays on login page. | **Pending** |

---

## 6. Test Execution Results

> **Execution Date:** 2026-05-16  
> **Executed by:** Antigravity Browser Subagent (Automated)

_Results will be updated after autonomous browser testing._

---

## 7. Summary

| Category | Total | Passed | Failed | Pending |
|----------|-------|--------|--------|---------|
| UC #4 — Reservation | 5 | 0 | 0 | 5 |
| UC #9 — Train Mgmt | 5 | 0 | 0 | 5 |
| UC #1/#2/#8 — Auth | 4 | 0 | 0 | 4 |
| **Total** | **14** | **0** | **0** | **14** |
