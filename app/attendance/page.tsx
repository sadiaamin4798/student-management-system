'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAttendanceSummaryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch all attendance records
    const attRes = await fetch('/api/attendance');
    const attData = await attRes.json();
    if (attData.success) setRecords(attData.data);

    // 2. Fetch all dropdown data (courses, teachers)
    const drop = await fetch('/api/dropdowns');
    const dropData = await drop.json();
    if (dropData.success) {
      setCourseList(dropData.courses || []);
      setTeacherList(dropData.teachers || []);
    }

    // 3. Fetch course-teacher assignments
    const assignRes = await fetch('/api/course-teacher');
    const assignData = await assignRes.json();
    if (assignData.success) setAssignments(assignData.data);
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Helper to find teacher for a specific course
  const getTeacherName = (courseId: number) => {
    const assignment = assignments.find(a => a.course_id === courseId);
    if (!assignment) return 'Unassigned';
    const teacher = teacherList.find(t => t.teacher_id === assignment.teacher_id);
    return teacher ? teacher.teacher_name : 'Unassigned';
  };

  // Calculate summary for ALL courses
  const courseSummary = courseList.map(course => {
    const courseRecords = records.filter(r => r.course_id === course.course_id);
    const totalLectures = courseRecords.length;
    const present = courseRecords.filter(r => r.status === 'Present').length;
    const absent = courseRecords.filter(r => r.status === 'Absent').length;
    const percentage = totalLectures > 0 ? Math.round((present / totalLectures) * 100) : 0;

    return { 
      ...course, 
      teacher_name: getTeacherName(course.course_id),
      totalLectures, 
      present, 
      absent, 
      percentage 
    };
  });

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
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">All Courses: Attendance</h2>
            <p className="text-sm text-slate-500">Complete overview of attendance for all courses.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b">
                <th className="p-4 font-medium">Sr. No.</th>
                <th className="p-4 font-medium">Course Code</th>
                <th className="p-4 font-medium">Course Title</th>
                <th className="p-4 font-medium">Teacher Name</th>
                <th className="p-4 font-medium text-center">Lectures</th>
                <th className="p-4 font-medium text-center">Present</th>
                <th className="p-4 font-medium text-center">Absent</th>
                <th className="p-4 font-medium text-center">Percentage</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseSummary.map((course, index) => (
                <tr key={course.course_id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-slate-500">{index + 1}</td>
                  <td className="p-4 text-slate-800 font-medium">{course.course_code || 'N/A'}</td>
                  <td className="p-4 text-slate-800 font-medium">{course.course_name}</td>
                  <td className="p-4 text-slate-600">{course.teacher_name}</td>
                  <td className="p-4 text-center text-slate-600">{course.totalLectures}</td>
                  <td className="p-4 text-center text-green-600 font-medium">{course.present}</td>
                  <td className="p-4 text-center text-red-600 font-medium">{course.absent}</td>
                  <td className="p-4 text-center text-slate-600 font-bold">{course.percentage}%</td>
                  <td className="p-4 text-center">
                    <Link href={`/attendance/details?course_id=${course.course_id}`} className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 transition inline-block">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {courseSummary.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">No courses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}