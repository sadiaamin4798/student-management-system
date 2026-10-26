import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management',
  dateStrings: true // Prevents timezone date shifting
};

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM enrollments ORDER BY enrollment_id DESC');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'INSERT INTO enrollments (student_id, course_id, semester, enrollment_date) VALUES (?, ?, ?, ?)',
      [Number(body.student_id), Number(body.course_id), body.semester || null, body.enrollment_date || null]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Enrollment added' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'UPDATE enrollments SET student_id = ?, course_id = ?, semester = ?, enrollment_date = ? WHERE enrollment_id = ?',
      [Number(body.student_id), Number(body.course_id), body.semester || null, body.enrollment_date || null, Number(body.enrollment_id)]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Enrollment updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM enrollments WHERE enrollment_id = ?', [id]);
    await db.end();
    return NextResponse.json({ success: true, message: 'Enrollment deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}