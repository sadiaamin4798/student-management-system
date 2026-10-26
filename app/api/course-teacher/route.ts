import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM course_teacher');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute('INSERT INTO course_teacher (course_id, teacher_id) VALUES (?, ?)', [Number(b.course_id), Number(b.teacher_id)]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    
    // If nothing changed, just return success
    if (Number(b.old_course_id) === Number(b.course_id) && Number(b.old_teacher_id) === Number(b.teacher_id)) {
      await db.end();
      return NextResponse.json({ success: true });
    }

    await db.execute('DELETE FROM course_teacher WHERE course_id = ? AND teacher_id = ?', [Number(b.old_course_id), Number(b.old_teacher_id)]);
    await db.execute('INSERT INTO course_teacher (course_id, teacher_id) VALUES (?, ?)', [Number(b.course_id), Number(b.teacher_id)]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM course_teacher WHERE course_id = ? AND teacher_id = ?', [searchParams.get('course_id'), searchParams.get('teacher_id')]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}