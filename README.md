# 🎓 Student Management System

A complete full-stack Student Management System built for my 5th-semester Advanced Database course.

## 🛠️ Tech Stack
*   **Frontend:** Next.js (React), Tailwind CSS, TypeScript
*   **Backend:** Next.js API Routes
*   **Database:** MySQL (10 relational tables)

## ✨ Features
*   **Admin Dashboard:** Manage Students, Teachers, Courses, Departments, Fees, and Timetable.
*   **Teacher Portal:** View assigned courses, mark daily attendance, and enter exam marks (Mid, Sessional, Practical, Final).
*   **Dynamic Dropdowns:** All forms automatically pull the latest data from the database.
*   **Automated Calculations:** Attendance percentages and exam grades (A+, A, B, etc.) are calculated in real-time.

## 🗄️ Database Schema
The system uses 10 interconnected tables:
`students`, `teachers`, `departments`, `courses`, `enrollments`, `course_teacher`, `attendance`, `exams`, `fees`, `timetable`.

## 🚀 How to Run Locally
1. Clone this repo: `git clone https://github.com/sadiaamin4798/student-management-system.git`
2. Install dependencies: `npm install`
3. Import your MySQL database using the provided `backup.sql` file.
4. Update database credentials in the API routes (`app/api/*/route.ts`).
5. Run the dev server: `npm run dev`
6. Open `http://localhost:3000`
