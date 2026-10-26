import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// This line is CRITICAL. It forces Next.js to never cache this route.
// Every time a page asks for data, it will run a fresh SQL query.
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const db = await mysql.createConnection({ 
      host: '127.0.0.1', 
      port: 3306, 
      user: 'test', 
      password: '1234', 
      database: 'student_management' 
    });
    
    // Fetch ALL departments
    const [departments] = await db.execute('SELECT department_id, department_name FROM departments');
    
    // Fetch ALL students
    const [students] = await db.execute('SELECT student_id, student_name FROM students');
    
    // Fetch ALL courses
    const [courses] = await db.execute('SELECT course_id, course_name, course_code FROM courses'); 
    
    // Fetch ALL teachers
    const [teachers] = await db.execute('SELECT teacher_id, teacher_name FROM teachers');
    
    await db.end();
    
    return NextResponse.json({ 
      success: true, 
      students: students || [], 
      courses: courses || [], 
      teachers: teachers || [], 
      departments: departments || [] 
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}