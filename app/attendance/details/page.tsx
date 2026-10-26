'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AttendanceDetailsContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');
  
  const [courseName, setCourseName] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!courseId) return;
    setLoading(true);
    
    const drop = await fetch('/api/dropdowns');
    const dropData = await drop.json();
    if (dropData.success) {
      const course = dropData.courses.find((c: any) => c.course_id.toString() === courseId);
      setCourseName(course ? course.course_name : 'Course Details');
    }

    const enrollRes = await fetch(`/api/course-students?course_id=${courseId}`);
    const enrollData = await enrollRes.json();
    if (enrollData.success) {
      setEnrolledStudents(enrollData.data);
    }

    const attRes = await fetch('/api/attendance');
    const attData = await attRes.json();
    if (attData.success) {
      const filtered = attData.data.filter((r: any) => r.course_id.toString() === courseId);
      setAttendanceRecords(filtered);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [courseId]);

  const getStudentStatus = (studentId: number) => {
    const record = attendanceRecords.find(
      r => r.student_id === studentId && r.attendance_date?.split(' ')[0] === selectedDate
    );
    return record ? record.status : 'Not Marked';
  };

  const handleMarkStudent = async (studentId: number, status: string) => {
    const existingRecord = attendanceRecords.find(
      r => r.student_id === studentId && r.attendance_date?.split(' ')[0] === selectedDate
    );

    if (existingRecord) {
      await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance_id: existingRecord.attendance_id, status: status })
      });
    } else {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: Number(courseId), attendance_date: selectedDate, status: status })
      });
    }
    
    const attRes = await fetch('/api/attendance');
    const attData = await attRes.json();
    if (attData.success) {
      const filtered = attData.data.filter((r: any) => r.course_id.toString() === courseId);
      setAttendanceRecords(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* FULL SIDEBAR */}
      <aside className="w-56 bg-slate-900 text-slate-300 flex-col hidden md:flex fixed h-full z-40 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">CampusAdmin</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Dashboard Overview</Link>
          <Link href="/students" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Students</Link>
          <Link href="/teachers" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Teachers</Link>
          <Link href="/departments" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Departments</Link>
          <Link href="/courses" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Courses</Link>
          <Link href="/enrollments" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Enrollments</Link>
          <Link href="/course-teacher" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Course-Teacher</Link>
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mark Attendance</h2>
            <p className="text-sm text-slate-500">{courseName}</p>
          </div>
          
          <div className="flex gap-3">
            <Link href={`/attendance/history?course_id=${courseId}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200 shadow-sm transition">
              View Full History
            </Link>
            <Link href="/attendance" className="text-sm font-medium text-slate-600 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition">
              &larr; Back to Courses
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
          <label className="font-medium text-slate-700">Select Date:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-lg text-slate-800"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading students...</div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b">
                  <th className="p-4 font-medium">Sr.#</th>
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Current Status</th>
                  <th className="p-4 font-medium text-center">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map((student, i) => {
                  const currentStatus = getStudentStatus(student.student_id);
                  
                  return (
                    <tr key={student.student_id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-500">{i + 1}</td>
                      <td className="p-4 text-slate-800 font-medium">{student.student_name}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentStatus === 'Present' ? 'bg-green-100 text-green-700' : 
                          currentStatus === 'Absent' ? 'bg-red-100 text-red-700' : 
                          currentStatus === 'Late' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button 
                          onClick={() => handleMarkStudent(student.student_id, 'Present')}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${currentStatus === 'Present' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => handleMarkStudent(student.student_id, 'Absent')}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${currentStatus === 'Absent' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                          Absent
                        </button>
                        <button 
                          onClick={() => handleMarkStudent(student.student_id, 'Late')}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${currentStatus === 'Late' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                        >
                          Late
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {enrolledStudents.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No students are enrolled in this course yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AttendanceDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AttendanceDetailsContent />
    </Suspense>
  );
}