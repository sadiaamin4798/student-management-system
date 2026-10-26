'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    department_name: '', building: '', head_of_department: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/departments');
    const data = await res.json();
    if (data.success) setDepartments(data.data);
    
    const dropRes = await fetch('/api/dropdowns');
    const dropData = await dropRes.json();
    if (dropData.success) {
      setTeachers(dropData.teachers || []);
      setDropdownsLoaded(true);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return;
    const res = await fetch(`/api/departments?id=${id}`, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  const openEditModal = (dept: any) => {
    setEditId(dept.department_id);
    setFormData({
      department_name: dept.department_name || '',
      building: dept.building || '',
      head_of_department: dept.head_of_department ? dept.head_of_department.toString() : ''
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/departments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, department_id: editId })
    });
    
    if ((await res.json()).success) {
      setIsModalOpen(false);
      fetchData();
    } else {
      alert('Error updating department');
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
          <Link href="/departments" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Departments</Link>
          <Link href="/courses" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Courses</Link>
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
          <h2 className="text-xl font-semibold text-slate-800">Manage Departments</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500">Admin User</span>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">AD</div>
          </div>
        </header>

        <div className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">All Departments</h3>
            <Link href="/departments/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
              + Add New Department
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading departments...</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-2 font-medium w-[10%]">ID</th>
                    <th className="p-2 font-medium w-[30%]">Department Name</th>
                    <th className="p-2 font-medium w-[20%]">Building</th>
                    <th className="p-2 font-medium w-[25%]">Head of Dept</th>
                    <th className="p-2 font-medium text-right w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((dept) => (
                    <tr key={dept.department_id} className="hover:bg-slate-50 transition">
                      <td className="p-2 text-slate-500">{dept.department_id}</td>
                      <td className="p-2 font-medium text-slate-800 truncate">{dept.department_name}</td>
                      <td className="p-2 text-slate-600 truncate">{dept.building || '-'}</td>
                      <td className="p-2 text-slate-600 truncate">
                        {teachers.find(t => t.teacher_id === dept.head_of_department)?.teacher_name || 'Unassigned'}
                      </td>
                      <td className="p-2 text-right space-x-2">
                        <button onClick={() => openEditModal(dept)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(dept.department_id)} className="text-red-600 hover:text-red-800 font-medium">Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Department</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Department Name</label>
                <input type="text" required className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.department_name} onChange={(e) => setFormData({...formData, department_name: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Building</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.building} onChange={(e) => setFormData({...formData, building: e.target.value})} />
              </div>
              
              {/* DYNAMIC TEACHER DROPDOWN */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Head of Department</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.head_of_department} onChange={(e) => setFormData({...formData, head_of_department: e.target.value})}>
                  <option value="">Select a Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id}>{t.teacher_name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" disabled={!dropdownsLoaded} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">
                  Update Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}