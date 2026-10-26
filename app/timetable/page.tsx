'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimetablePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ course_id: '1', day_of_week: 'Monday', start_time: '09:00', end_time: '10:30', room_number: '' });

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch timetable
    const res = await fetch('/api/timetable');
    const data = await res.json();
    if (data.success) setRecords(data.data);

    // Fetch dropdowns (courses & teachers)
    const drop = await fetch('/api/dropdowns');
    const dropData = await drop.json();
    if (dropData.success) {
      setCourseList(dropData.courses);
      setTeacherList(dropData.teachers || []);
      setDropdownsLoaded(true);
    }

    // Fetch course-teacher assignments
    const assignRes = await fetch('/api/course-teacher');
    const assignData = await assignRes.json();
    if (assignData.success) {
      setAssignments(assignData.data);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this timetable slot?')) return;
    await fetch(`/api/timetable?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const openEditModal = (record: any) => {
    setEditId(record.schedule_id);
    setFormData({
      course_id: record.course_id.toString(),
      day_of_week: record.day_of_week,
      start_time: record.start_time,
      end_time: record.end_time,
      room_number: record.room_number || ''
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/timetable', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, schedule_id: editId })
    });
    setIsModalOpen(false);
    fetchData();
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  // Helper to find teacher for a specific course
  const getTeacherName = (courseId: number) => {
    const assignment = assignments.find(a => a.course_id === courseId);
    if (!assignment) return 'Unassigned';
    const teacher = teacherList.find(t => t.teacher_id === assignment.teacher_id);
    return teacher ? teacher.teacher_name : 'Unassigned';
  };

  // Group records by Day
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const groupedRecords = daysOrder.map(day => ({
    day: day,
    classes: records.filter(r => r.day_of_week === day).sort((a, b) => a.start_time.localeCompare(b.start_time))
  })).filter(group => group.classes.length > 0);

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
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Class Schedule</h2>
          <Link href="/timetable/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + Add Timetable Slot
          </Link>
        </header>

        <div className="p-8 w-full max-w-7xl mx-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading schedule...</div>
          ) : (
            <div className="flex flex-col gap-6">
              {groupedRecords.map((group) => (
                <div key={group.day} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-900 px-6 py-3 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">{group.day}</h3>
                  </div>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b">
                        <th className="p-4 font-medium">Time</th>
                        <th className="p-4 font-medium">Course</th>
                        <th className="p-4 font-medium">Teacher</th>
                        <th className="p-4 font-medium">Room</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {group.classes.map((r) => (
                        <tr key={r.schedule_id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-medium text-slate-800">
                            {formatTime(r.start_time)} - {formatTime(r.end_time)}
                          </td>
                          <td className="p-4 text-slate-600">
                            {courseList.find(c => c.course_id === r.course_id)?.course_name || `ID: ${r.course_id}`}
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {getTeacherName(r.course_id)}
                          </td>
                          <td className="p-4 text-slate-600">{r.room_number || '-'}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => openEditModal(r)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            <button onClick={() => handleDelete(r.schedule_id)} className="text-red-600 hover:text-red-800 font-medium">Del</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              {groupedRecords.length === 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
                  No classes scheduled yet. Click "+ Add Timetable Slot" to create one.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Timetable Slot</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Course</label>
                <select className="border p-3 rounded-lg" value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                  {courseList.map((c) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Day of Week</label>
                <select className="border p-3 rounded-lg" value={formData.day_of_week} onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Start Time</label>
                  <input type="time" required className="border p-3 rounded-lg" value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-600 mb-1 ml-1">End Time</label>
                  <input type="time" required className="border p-3 rounded-lg" value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1 ml-1">Room Number</label>
                <input type="text" className="border p-3 rounded-lg" value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" disabled={!dropdownsLoaded} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-50">Update Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}