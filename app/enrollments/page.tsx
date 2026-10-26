'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [studentList, setStudentList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    student_id: '1', course_id: '1', semester: '', enrollment_date: ''
  });

  const fetchEnrollments = async () => {
    setLoading(true);
    const res = await fetch('/api/enrollments');
    const data = await res.json();
    if (data.success) setEnrollments(data.data);
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const res = await fetch('/api/dropdowns');
    const data = await res.json();
    if (data.success) {
      setStudentList(data.students);
      setCourseList(data.courses);
    }
  };

  useEffect(() => { 
    fetchEnrollments(); 
    fetchDropdowns();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this enrollment?')) return;
    const res = await fetch(`/api/enrollments?id=${id}`, { method: 'DELETE' });
    if ((await res.json()).success) fetchEnrollments();
  };

  const openEditModal = (enrollment: any) => {
    setEditId(enrollment.enrollment_id);
    setFormData({
      student_id: enrollment.student_id ? enrollment.student_id.toString() : '1',
      course_id: enrollment.course_id ? enrollment.course_id.toString() : '1',
      semester: enrollment.semester || '',
      enrollment_date: enrollment.enrollment_date ? enrollment.enrollment_date.split(' ')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/enrollments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, enrollment_id: editId })
    });
    
    if ((await res.json()).success) {
      setIsModalOpen(false);
      fetchEnrollments();
    } else {
      alert('Error updating enrollment');
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
          <h2 className="text-xl font-semibold text-slate-800">Manage Enrollments</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500">Admin User</span>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">AD</div>
          </div>
        </header>

        <div className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">All Enrollments</h3>
            <Link href="/enrollments/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
              + Add New Enrollment
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading enrollments...</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-2 font-medium w-[10%]">ID</th>
                    <th className="p-2 font-medium w-[25%]">Student</th>
                    <th className="p-2 font-medium w-[25%]">Course</th>
                    <th className="p-2 font-medium w-[15%]">Semester</th>
                    <th className="p-2 font-medium w-[15%]">Date</th>
                    <th className="p-2 font-medium text-right w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.enrollment_id} className="hover:bg-slate-50 transition">
                      <td className="p-2 text-slate-500">{enrollment.enrollment_id}</td>
                      <td className="p-2 text-slate-800 truncate">
                        {studentList.find(s => s.student_id === enrollment.student_id)?.student_name || `ID: ${enrollment.student_id}`}
                      </td>
                      <td className="p-2 text-slate-800 truncate">
                        {courseList.find(c => c.course_id === enrollment.course_id)?.course_name || `ID: ${enrollment.course_id}`}
                      </td>
                      <td className="p-2 text-slate-600 truncate">{enrollment.semester || '-'}</td>
                      <td className="p-2 text-slate-600">{enrollment.enrollment_date ? enrollment.enrollment_date.split(' ')[0] : '-'}</td>
                      <td className="p-2 text-right space-x-2">
                        <button onClick={() => openEditModal(enrollment)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(enrollment.enrollment_id)} className="text-red-600 hover:text-red-800 font-medium">Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Enrollment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Student</label>
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
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Course</label>
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
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Semester</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Enrollment Date</label>
                <input type="date" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.enrollment_date} onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm">
                  Update Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}