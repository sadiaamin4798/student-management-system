'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminExamsPage() {
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Fetch ALL courses from the dropdowns API
    const res = await fetch('/api/dropdowns');
    const data = await res.json();
    
    if (data.success) {
      setAssignedCourses(data.courses || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Exams</h2>
          <p className="text-sm text-slate-500">Select a course to enter student marks.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b">
                <th className="p-4 font-medium">Sr. No.</th>
                <th className="p-4 font-medium">Course Code</th>
                <th className="p-4 font-medium">Course Title</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading courses...</td></tr>
              ) : (
                assignedCourses.map((course, index) => (
                  <tr key={course.course_id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-500">{index + 1}</td>
                    <td className="p-4 text-slate-800 font-medium">{course.course_code || 'N/A'}</td>
                    <td className="p-4 text-slate-800 font-medium">{course.course_name}</td>
                    <td className="p-4 text-center">
                      <Link href={`/exams/enter-marks?course_id=${course.course_id}`} className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 transition inline-block">
                        Enter Marks
                      </Link>
                    </td>
                  </tr>
                ))
              )}
              {!loading && assignedCourses.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No courses found. Please add a course first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}