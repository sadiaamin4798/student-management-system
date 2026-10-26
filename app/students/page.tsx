'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    student_name: '', father_name: '', email: '', phone: '', department_id: '1',
    date_of_birth: '', gender: 'Male', address: '', admission_date: '', status: 'Active'
  });

  const fetchStudents = async () => {
    setLoading(true);
    const res = await fetch('/api/students');
    const data = await res.json();
    if (data.success) setStudents(data.data);
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const res = await fetch('/api/dropdowns');
    const data = await res.json();
    if (data.success) {
      setDepartments(data.departments || []);
      setDropdownsLoaded(true);
    }
  };

  useEffect(() => { 
    fetchStudents(); 
    fetchDropdowns();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
    if ((await res.json()).success) fetchStudents();
  };

  const openEditModal = (student: any) => {
    setEditId(student.student_id);
    setFormData({
      student_name: student.student_name || '',
      father_name: student.father_name || '',
      email: student.email || '',
      phone: student.phone || '',
      department_id: student.department_id ? student.department_id.toString() : '1',
      date_of_birth: student.date_of_birth ? student.date_of_birth.split(' ')[0] : '',
      gender: student.gender || 'Male',
      address: student.address || '',
      admission_date: student.admission_date ? student.admission_date.split(' ')[0] : '',
      status: student.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, student_id: editId })
    });
    
    if ((await res.json()).success) {
      setIsModalOpen(false);
      fetchStudents();
    } else {
      alert('Error updating student');
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
          <Link href="/students" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Students</Link>
          <Link href="/teachers" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Teachers</Link>
          <Link href="/departments" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Departments</Link>
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
          <h2 className="text-xl font-semibold text-slate-800">Manage Students</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500">Admin User</span>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">AD</div>
          </div>
        </header>

        <div className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">All Students</h3>
            <Link href="/students/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
              + Add New Student
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading students...</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-2 font-medium w-[4%]">ID</th>
                    <th className="p-2 font-medium w-[12%]">Name</th>
                    <th className="p-2 font-medium w-[10%]">Father</th>
                    <th className="p-2 font-medium w-[14%]">Email</th>
                    <th className="p-2 font-medium w-[10%]">Phone</th>
                    <th className="p-2 font-medium w-[5%]">Dept</th>
                    <th className="p-2 font-medium w-[9%]">DOB</th>
                    <th className="p-2 font-medium w-[7%]">Gender</th>
                    <th className="p-2 font-medium w-[10%]">Address</th>
                    <th className="p-2 font-medium w-[9%]">Admission</th>
                    <th className="p-2 font-medium w-[6%]">Status</th>
                    <th className="p-2 font-medium text-right w-[8%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-slate-50 transition">
                      <td className="p-2 text-slate-500">{student.student_id}</td>
                      <td className="p-2 font-medium text-slate-800">{student.student_name}</td>
                      <td className="p-2 text-slate-600 truncate">{student.father_name}</td>
                      <td className="p-2 text-slate-600 truncate">{student.email}</td>
                      <td className="p-2 text-slate-600 truncate">{student.phone}</td>
                      <td className="p-2 text-slate-600">{student.department_id}</td>
                      <td className="p-2 text-slate-600">{student.date_of_birth ? student.date_of_birth.split(' ')[0] : '-'}</td>
                      <td className="p-2 text-slate-600">{student.gender}</td>
                      <td className="p-2 text-slate-600 truncate">{student.address}</td>
                      <td className="p-2 text-slate-600">{student.admission_date ? student.admission_date.split(' ')[0] : '-'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-2 text-right space-x-1">
                        <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(student.student_id)} className="text-red-600 hover:text-red-800 font-medium">Del</button>
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
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Student Name</label>
                <input type="text" required className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Father Name</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.father_name} onChange={(e) => setFormData({...formData, father_name: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Email</label>
                <input type="email" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Phone</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Date of Birth</label>
                <input type="date" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Admission Date</label>
                <input type="date" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.admission_date} onChange={(e) => setFormData({...formData, admission_date: e.target.value})} />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Gender</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Department</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Address</label>
                <input type="text" className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Status</label>
                <select className="border p-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 col-span-2 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" disabled={!dropdownsLoaded} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}