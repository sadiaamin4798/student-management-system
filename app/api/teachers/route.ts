import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management',
  dateStrings: true // <--- THIS FIXES THE TIMEZONE BUG
};

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM teachers ORDER BY teacher_id DESC');
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
      'INSERT INTO teachers (teacher_name, email, department_id, phone, hire_date) VALUES (?, ?, ?, ?, ?)',
      [body.teacher_name, body.email || null, Number(body.department_id), body.phone || null, body.hire_date || null]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Teacher added' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);
    
    const hireDate = body.hire_date === '' ? null : body.hire_date;

    await db.execute(
      'UPDATE teachers SET teacher_name = ?, email = ?, department_id = ?, phone = ?, hire_date = ? WHERE teacher_id = ?',
      [
        body.teacher_name, 
        body.email || null, 
        Number(body.department_id), 
        body.phone || null, 
        hireDate, 
        Number(body.teacher_id)
      ]
    );
    
    await db.end();
    return NextResponse.json({ success: true, message: 'Teacher updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM teachers WHERE teacher_id = ?', [id]);
    await db.end();
    return NextResponse.json({ success: true, message: 'Teacher deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}