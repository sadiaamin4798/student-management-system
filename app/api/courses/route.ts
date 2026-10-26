import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management',
  dateStrings: true
};

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM courses ORDER BY course_id DESC');
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
      'INSERT INTO courses (course_name, credit_hours, department_id, course_code, description) VALUES (?, ?, ?, ?, ?)',
      [body.course_name, Number(body.credit_hours), Number(body.department_id), body.course_code || null, body.description || null]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Course added' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'UPDATE courses SET course_name = ?, credit_hours = ?, department_id = ?, course_code = ?, description = ? WHERE course_id = ?',
      [body.course_name, Number(body.credit_hours), Number(body.department_id), body.course_code || null, body.description || null, Number(body.course_id)]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Course updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM courses WHERE course_id = ?', [id]);
    await db.end();
    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}