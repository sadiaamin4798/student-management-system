'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function HistoryContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');
  
  const [records, setRecords] = useState<any[]>([]);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success) {
        const filtered = data.data
          .filter((r: any) => r.course_id.toString() === courseId)
          .sort((a: any, b: any) => new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime());
        setRecords(filtered);
      }

      const drop = await fetch('/api/dropdowns');
      const dropData = await drop.json();
      if (dropData.success) {
        setStudentList(dropData.students);
        const course = dropData.courses.find((c: any) => c.course_id.toString() === courseId);
        setCourseName(course ? course.course_name : 'Course Details');
      }
      
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

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
            <h2 className="text-2xl font-bold text-slate-800">Complete Attendance History</h2>
            <p className="text-sm text-slate-500">{courseName}</p>
          </div>
          <Link href={`/attendance/details?course_id=${courseId}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition">
            &larr; Back to Register
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading history...</div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b">
                  <th className="p-4 font-medium">Sr.#</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, i) => (
                  <tr key={r.attendance_id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-500">{i + 1}</td>
                    <td className="p-4 text-slate-800 font-medium">{r.attendance_date?.split(' ')[0]}</td>
                    <td className="p-4 text-slate-600">
                      {studentList.find(s => s.student_id === r.student_id)?.student_name || r.student_id}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                        r.status === 'Present' ? 'bg-green-100 text-green-700' : 
                        r.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No attendance history found for this course.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AttendanceHistoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}