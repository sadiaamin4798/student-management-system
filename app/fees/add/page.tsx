'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddFeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '1', amount: '0', payment_date: new Date().toISOString().split('T')[0], status: 'Pending', semester: ''
  });

  useEffect(() => {
    fetch('/api/dropdowns').then(res => res.json()).then(data => {
      if (data.success) { setStudentList(data.students || []); setDropdownsLoaded(true); }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/fees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if ((await res.json()).success) router.push('/fees');
    else { alert('Error saving record'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-slate-900 text-slate-300 flex-col hidden md:flex fixed h-full z-40 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-slate-800"><h1 className="text-xl font-bold text-white">CampusAdmin</h1></div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/" className="block px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm">Dashboard Overview</Link>
          <Link href="/fees" className="block px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm">Fees</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Add Fee Record</h2>
          <Link href="/fees" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to Fees</Link>
        </header>

        <div className="p-8 max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Student *</label>
                <select className="border p-3 rounded-lg" value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                  {studentList.map((s) => <option key={s.student_id} value={s.student_id}>{s.student_name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Amount *</label>
                <input type="number" required className="border p-3 rounded-lg" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Semester</label>
                <input type="text" className="border p-3 rounded-lg" placeholder="e.g. Fall 2026" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Payment Date</label>
                <input type="date" className="border p-3 rounded-lg" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Status</label>
                <select className="border p-3 rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 border-t pt-6">
                <Link href="/fees" className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</Link>
                <button type="submit" disabled={loading || !dropdownsLoaded} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Saving...' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}