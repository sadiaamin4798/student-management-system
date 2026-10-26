import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = { host: '127.0.0.1', port: 3306, user: 'test', password: '1234', database: 'student_management', dateStrings: true };

export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM fees ORDER BY fee_id DESC');
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      'INSERT INTO fees (student_id, amount, payment_date, status, semester) VALUES (?, ?, ?, ?, ?)',
      [Number(b.student_id), Number(b.amount), b.payment_date || null, b.status, b.semester || null]
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
      'UPDATE fees SET student_id=?, amount=?, payment_date=?, status=?, semester=? WHERE fee_id=?',
      [Number(b.student_id), Number(b.amount), b.payment_date || null, b.status, b.semester || null, Number(b.fee_id)]
    );
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM fees WHERE fee_id = ?', [searchParams.get('id')]);
    await db.end();
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}