import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!teacherId) {
      return NextResponse.json({ success: false, error: 'Teacher ID required' }, { status: 400 });
    }

    const db = await mysql.createConnection(dbConfig);
    
    const [rows] = await db.execute(`
      SELECT c.course_id, c.course_name, c.course_code 
      FROM courses c
      JOIN course_teacher ct ON c.course_id = ct.course_id
      WHERE ct.teacher_id = ?
    `, [teacherId]);
    
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}