import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { 
  host: '127.0.0.1', 
  port: 3306, 
  user: 'test', 
  password: '1234', 
  database: 'student_management', 
  dateStrings: true 
};

// GET: Fetch all attendance
export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM attendance ORDER BY attendance_date DESC');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}

// POST: Create a new attendance record
export async function POST(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES (?, ?, ?, ?)',
      [Number(b.student_id), Number(b.course_id), b.attendance_date || null, b.status]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}

// PUT: Update existing attendance (Just the status for the quick register view)
export async function PUT(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'UPDATE attendance SET status = ? WHERE attendance_id = ?',
      [b.status, Number(b.attendance_id)]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}

// DELETE: Remove attendance
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM attendance WHERE attendance_id = ?', [searchParams.get('id')]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  }
}