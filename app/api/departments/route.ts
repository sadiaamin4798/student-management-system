import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management',
  dateStrings: true
};

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM departments ORDER BY department_id DESC');
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
      'INSERT INTO departments (department_name, building, head_of_department) VALUES (?, ?, ?)',
      [body.department_name, body.building || null, body.head_of_department || null]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Department added' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'UPDATE departments SET department_name = ?, building = ?, head_of_department = ? WHERE department_id = ?',
      [body.department_name, body.building || null, body.head_of_department || null, Number(body.department_id)]
    );
    await db.end();
    return NextResponse.json({ success: true, message: 'Department updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM departments WHERE department_id = ?', [id]);
    await db.end();
    return NextResponse.json({ success: true, message: 'Department deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}