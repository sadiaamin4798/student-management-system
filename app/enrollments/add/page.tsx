'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddEnrollmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [studentList, setStudentList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '1', course_id: '1', semester: '', enrollment_date: ''
  });

  useEffect(() => {
    fetch('/api/dropdowns')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudentList(data.students);
          setCourseList(data.courses);
          setFormData({
            student_id: data.students.length > 0 ? data.students[0].student_id.toString() : '1',
            course_id: data.courses.length > 0 ? data.courses[0].course_id.toString() : '1',
            semester: '',
            enrollment_date: ''
          });
          setDropdownsLoaded(true);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if ((await res.json()).success) {
      router.push('/enrollments');
    } else {
      alert('Error saving enrollment');
      setLoading(false);
    }
  };

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
          <Link href="/enrollments" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Enrollments</Link>
          <Link href="/course-teacher" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Course-Teacher</Link>
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Add New Enrollment</h2>
          <Link href="/enrollments" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to Enrollments</Link>
        </header>

        <div className="p-8 max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Student *</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                  {studentList.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.student_id} - {s.student_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Course *</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                  {courseList.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_id} - {c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Semester</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Enrollment Date</label>
                <input type="date" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.enrollment_date} onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 border-t border-slate-200 pt-6">
                <Link href="/enrollments" className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</Link>
                <button type="submit" disabled={loading || !dropdownsLoaded} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}