'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    course_name: '', credit_hours: '3', department_id: '', course_code: '', description: ''
  });

  useEffect(() => {
    fetch('/api/dropdowns')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDepartments(data.departments || []);
          // Automatically select the first department
          if (data.departments && data.departments.length > 0) {
            setFormData(prev => ({ ...prev, department_id: data.departments[0].department_id.toString() }));
          }
          setDropdownsLoaded(true);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if ((await res.json()).success) {
      router.push('/courses');
    } else {
      alert('Error saving course');
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
          <Link href="/courses" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Courses</Link>
          <Link href="/enrollments" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Enrollments</Link>
          <Link href="/course-teacher" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Course-Teacher</Link>
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Add New Course</h2>
          <Link href="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to Courses</Link>
        </header>

        <div className="p-8 max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Course Name *</label>
                <input type="text" required className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.course_name} onChange={(e) => setFormData({...formData, course_name: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Course Code</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.course_code} onChange={(e) => setFormData({...formData, course_code: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Credit Hours</label>
                <input type="number" required className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.credit_hours} onChange={(e) => setFormData({...formData, credit_hours: e.target.value})} />
              </div>
              
              {/* DYNAMIC DEPARTMENT DROPDOWN */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Department</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-2">Description</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 col-span-2 border-t border-slate-200 pt-6">
                <Link href="/courses" className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</Link>
                <button type="submit" disabled={loading || !dropdownsLoaded} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}