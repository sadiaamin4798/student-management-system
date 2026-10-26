import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM timetable ORDER BY schedule_id DESC');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'INSERT INTO timetable (course_id, day_of_week, start_time, end_time, room_number) VALUES (?, ?, ?, ?, ?)',
      [Number(b.course_id), b.day_of_week, b.start_time, b.end_time, b.room_number || null]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'UPDATE timetable SET course_id=?, day_of_week=?, start_time=?, end_time=?, room_number=? WHERE schedule_id=?',
      [Number(b.course_id), b.day_of_week, b.start_time, b.end_time, b.room_number || null, Number(b.schedule_id)]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM timetable WHERE schedule_id = ?', [searchParams.get('id')]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}