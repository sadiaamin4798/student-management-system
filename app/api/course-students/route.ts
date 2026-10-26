import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID required' }, { status: 400 });
    }

    const db = await mysql.createConnection(dbConfig);
    
    // Get all students enrolled in this course
    const [rows] = await db.execute(`
      SELECT s.student_id, s.student_name 
      FROM students s
      JOIN enrollments e ON s.student_id = e.student_id
      WHERE e.course_id = ?
    `, [courseId]);
    
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}