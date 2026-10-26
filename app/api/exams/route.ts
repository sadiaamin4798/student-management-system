import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM exams ORDER BY exam_id DESC');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    
    // Calculate total
    const total = Number(b.mid_marks) + Number(b.sessional_marks) + Number(b.practical_marks) + Number(b.final_marks);
    const totalMax = 100; // Assuming 100 max

    await db.execute(
      `INSERT INTO exams (student_id, course_id, exam_type, total_marks, obtained_marks, exam_date, mid_marks, sessional_marks, practical_marks, final_marks) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Number(b.student_id), Number(b.course_id), b.exam_type || 'Final', totalMax, total, b.exam_date || null, Number(b.mid_marks), Number(b.sessional_marks), Number(b.practical_marks), Number(b.final_marks)]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    
    // Recalculate total
    const total = Number(b.mid_marks) + Number(b.sessional_marks) + Number(b.practical_marks) + Number(b.final_marks);
    const totalMax = 100;

    await db.execute(
      `UPDATE exams SET total_marks=?, obtained_marks=?, exam_date=?, mid_marks=?, sessional_marks=?, practical_marks=?, final_marks=? WHERE exam_id=?`,
      [totalMax, total, b.exam_date || null, Number(b.mid_marks), Number(b.sessional_marks), Number(b.practical_marks), Number(b.final_marks), Number(b.exam_id)]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM exams WHERE exam_id = ?', [searchParams.get('id')]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}