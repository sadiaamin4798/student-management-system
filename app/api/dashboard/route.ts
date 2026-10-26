import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: '127.0.0.1', 
      port: 3306, 
      user: 'test', 
      password: '1234', 
      database: 'student_management'
    });

    // Counting rows in the original 6 tables
    const [students] = await db.execute('SELECT COUNT(*) as count FROM students');
    const [teachers] = await db.execute('SELECT COUNT(*) as count FROM teachers');
    const [departments] = await db.execute('SELECT COUNT(*) as count FROM departments');
    const [courses] = await db.execute('SELECT COUNT(*) as count FROM courses');
    const [enrollments] = await db.execute('SELECT COUNT(*) as count FROM enrollments');
    const [course_teacher] = await db.execute('SELECT COUNT(*) as count FROM course_teacher');
    
    // Counting rows in the 4 NEW tables
    const [attendance] = await db.execute('SELECT COUNT(*) as count FROM attendance');
    const [exams] = await db.execute('SELECT COUNT(*) as count FROM exams');
    const [fees] = await db.execute('SELECT COUNT(*) as count FROM fees');
    const [timetable] = await db.execute('SELECT COUNT(*) as count FROM timetable');

    await db.end();

    return NextResponse.json({ 
      success: true, 
      counts: {
        students: (students as any)[0].count,
        teachers: (teachers as any)[0].count,
        departments: (departments as any)[0].count,
        courses: (courses as any)[0].count,
        enrollments: (enrollments as any)[0].count,
        course_teacher: (course_teacher as any)[0].count,
        attendance: (attendance as any)[0].count,
        exams: (exams as any)[0].count,
        fees: (fees as any)[0].count,
        timetable: (timetable as any)[0].count
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}