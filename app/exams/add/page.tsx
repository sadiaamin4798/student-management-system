'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '1', course_id: '1', exam_type: 'Midterm', total_marks: '100', obtained_marks: '0', exam_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetch('/api/dropdowns').then(res => res.json()).then(data => {
      if (data.success) {
        setStudentList(data.students || []);
        setCourseList(data.courses || []);
        setDropdownsLoaded(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/exams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if ((await res.json()).success) router.push('/exams');
    else { alert('Error saving record'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-slate-900 text-slate-300 flex-col hidden md:flex fixed h-full z-40 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-slate-800"><h1 className="text-xl font-bold text-white">CampusAdmin</h1></div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/" className="block px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm">Dashboard Overview</Link>
          <Link href="/exams" className="block px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm">Exams</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Add Exam Mark</h2>
          <Link href="/exams" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to Exams</Link>
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
                <label className="text-sm font-medium mb-2">Course *</label>
                <select className="border p-3 rounded-lg" value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                  {courseList.map((c) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Exam Type *</label>
                <input type="text" required className="border p-3 rounded-lg" value={formData.exam_type} onChange={(e) => setFormData({...formData, exam_type: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">Total Marks *</label>
                  <input type="number" required className="border p-3 rounded-lg" value={formData.total_marks} onChange={(e) => setFormData({...formData, total_marks: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">Obtained Marks *</label>
                  <input type="number" required className="border p-3 rounded-lg" value={formData.obtained_marks} onChange={(e) => setFormData({...formData, obtained_marks: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Exam Date *</label>
                <input type="date" required className="border p-3 rounded-lg" value={formData.exam_date} onChange={(e) => setFormData({...formData, exam_date: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 border-t pt-6">
                <Link href="/exams" className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</Link>
                <button type="submit" disabled={loading || !dropdownsLoaded} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Saving...' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}