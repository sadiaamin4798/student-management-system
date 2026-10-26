import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management',
  dateStrings: true // Fixes timezone shifting
};

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM students ORDER BY student_id DESC');
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
      `INSERT INTO students 
      (student_name, father_name, email, phone, department_id, date_of_birth, gender, address, admission_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.student_name, body.father_name || null, body.email || null, body.phone || null, Number(body.department_id), 
        body.date_of_birth || null, body.gender || null, body.address || null, 
        body.admission_date || null, body.status || 'Active'
      ]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Student added' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);

    await db.execute(
      `UPDATE students 
       SET student_name = ?, father_name = ?, email = ?, phone = ?, department_id = ?, 
           date_of_birth = ?, gender = ?, address = ?, admission_date = ?, status = ? 
       WHERE student_id = ?`,
      [
        body.student_name, body.father_name || null, body.email || null, body.phone || null, Number(body.department_id), 
        body.date_of_birth || null, body.gender || null, body.address || null, 
        body.admission_date || null, body.status || 'Active', Number(body.student_id)
      ]
    );

    await db.end();
    return NextResponse.json({ success: true, message: 'Student updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM students WHERE student_id = ?', [id]);
    await db.end();
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}