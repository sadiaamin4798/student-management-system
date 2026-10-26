'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeesPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ student_id: '1', amount: '0', payment_date: '', status: 'Pending', semester: '' });

  const fetchFees = async () => {
    setLoading(true);
    const res = await fetch('/api/fees');
    const data = await res.json();
    if (data.success) setRecords(data.data);
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const res = await fetch('/api/dropdowns');
    const data = await res.json();
    if (data.success) {
      setStudentList(data.students);
      setDropdownsLoaded(true);
    }
  };

  useEffect(() => { fetchFees(); fetchDropdowns(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this fee record?')) return;
    await fetch(`/api/fees?id=${id}`, { method: 'DELETE' });
    fetchFees();
  };

  const openEditModal = (record: any) => {
    setEditId(record.fee_id);
    setFormData({
      student_id: record.student_id.toString(),
      amount: record.amount.toString(),
      payment_date: record.payment_date ? record.payment_date.split(' ')[0] : '',
      status: record.status,
      semester: record.semester || ''
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/fees', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, fee_id: editId })
    });
    setIsModalOpen(false);
    fetchFees();
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
          <Link href="/enrollments" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Enrollments</Link>
          <Link href="/course-teacher" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Course-Teacher</Link>
          <Link href="/attendance" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Attendance</Link>
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Manage Fees</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500">Admin User</span>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">AD</div>
          </div>
        </header>

        <div className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">All Fee Records</h3>
            <Link href="/fees/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
              + Add Fee Record
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading records...</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-2 font-medium w-[8%]">ID</th>
                    <th className="p-2 font-medium w-[25%]">Student</th>
                    <th className="p-2 font-medium w-[15%]">Amount</th>
                    <th className="p-2 font-medium w-[15%]">Semester</th>
                    <th className="p-2 font-medium w-[15%]">Date</th>
                    <th className="p-2 font-medium w-[12%]">Status</th>
                    <th className="p-2 font-medium text-right w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r.fee_id} className="hover:bg-slate-50 transition">
                      <td className="p-2 text-slate-500">{r.fee_id}</td>
                      <td className="p-2 text-slate-800 truncate">
                        {studentList.find(s => s.student_id === r.student_id)?.student_name || `ID: ${r.student_id}`}
                      </td>
                      <td className="p-2 text-slate-800 font-medium">{r.amount}</td>
                      <td className="p-2 text-slate-600 truncate">{r.semester || '-'}</td>
                      <td className="p-2 text-slate-600">{r.payment_date ? r.payment_date.split(' ')[0] : '-'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${r.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-2 text-right space-x-2">
                        <button onClick={() => openEditModal(r)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(r.fee_id)} className="text-red-600 hover:text-red-800 font-medium">Del</button>
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
              <h2 className="text-2xl font-bold text-slate-800">Edit Fee Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Student</label>
                <select className="border p-3 rounded-lg" value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                  {studentList.map((s) => <option key={s.student_id} value={s.student_id}>{s.student_name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Amount</label>
                <input type="number" required className="border p-3 rounded-lg" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Semester</label>
                <input type="text" className="border p-3 rounded-lg" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Payment Date</label>
                <input type="date" className="border p-3 rounded-lg" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Status</label>
                <select className="border p-3 rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" disabled={!dropdownsLoaded} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}