'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function MarksEntryContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');
  
  const [courseName, setCourseName] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [marksData, setMarksData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!courseId) return;
    setLoading(true);
    
    // Fetch course name
    const drop = await fetch('/api/dropdowns');
    const dropData = await drop.json();
    if (dropData.success) {
      const course = dropData.courses.find((c: any) => c.course_id.toString() === courseId);
      setCourseName(course ? course.course_name : 'Course Details');
    }

    // Fetch enrolled students
    const enrollRes = await fetch(`/api/course-students?course_id=${courseId}`);
    const enrollData = await enrollRes.json();
    if (enrollData.success) {
      setStudents(enrollData.data);
    }

    // Fetch existing marks
    const examRes = await fetch('/api/exams');
    const examData = await examRes.json();
    if (examData.success) {
      const filteredExams = examData.data.filter((e: any) => e.course_id.toString() === courseId);
      const marksMap: any = {};
      filteredExams.forEach((e: any) => {
        marksMap[e.student_id] = e;
      });
      setMarksData(marksMap);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [courseId]);

  const handleMarkChange = (studentId: number, field: string, value: string) => {
    setMarksData((prev: any) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async (studentId: number) => {
    const data = marksData[studentId] || {};
    const examId = data.exam_id;

    const payload = {
      exam_id: examId,
      student_id: studentId,
      course_id: Number(courseId),
      mid_marks: Number(data.mid_marks || 0),
      sessional_marks: Number(data.sessional_marks || 0),
      practical_marks: Number(data.practical_marks || 0),
      final_marks: Number(data.final_marks || 0),
      exam_date: new Date().toISOString().split('T')[0]
    };

    const method = examId ? 'PUT' : 'POST';
    
    await fetch('/api/exams', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert('Marks saved successfully!');
    fetchData(); 
  };

  const calculateGrade = (total: number) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* FULL SIDEBAR */}
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
          <Link href="/exams" className="block px-4 py-2.5 rounded-lg transition text-sm bg-indigo-600 text-white font-medium">Exams</Link>
          <Link href="/fees" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Fees</Link>
          <Link href="/timetable" className="block px-4 py-2.5 rounded-lg transition text-sm hover:bg-slate-800 hover:text-white">Timetable</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-56 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Enter Student Marks</h2>
            <p className="text-sm text-slate-500">{courseName}</p>
          </div>
          <Link href="/exams" className="text-sm font-medium text-slate-600 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition">
            &larr; Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading students...</div>
          ) : (
            <table className="w-full text-left border-collapse text-sm min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b">
                  <th className="p-4 font-medium">Sr.#</th>
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Mid (20)</th>
                  <th className="p-4 font-medium">Sessional (10)</th>
                  <th className="p-4 font-medium">Practical (10)</th>
                  <th className="p-4 font-medium">Final (60)</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Grade</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, i) => {
                  const marks = marksData[student.student_id] || {};
                  const mid = Number(marks.mid_marks || 0);
                  const sess = Number(marks.sessional_marks || 0);
                  const prac = Number(marks.practical_marks || 0);
                  const final = Number(marks.final_marks || 0);
                  const total = mid + sess + prac + final;
                  
                  return (
                    <tr key={student.student_id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-500">{i + 1}</td>
                      <td className="p-4 text-slate-800 font-medium">{student.student_name}</td>
                      <td className="p-2"><input type="number" className="w-16 border p-2 rounded" value={marks.mid_marks || ''} onChange={(e) => handleMarkChange(student.student_id, 'mid_marks', e.target.value)} /></td>
                      <td className="p-2"><input type="number" className="w-16 border p-2 rounded" value={marks.sessional_marks || ''} onChange={(e) => handleMarkChange(student.student_id, 'sessional_marks', e.target.value)} /></td>
                      <td className="p-2"><input type="number" className="w-16 border p-2 rounded" value={marks.practical_marks || ''} onChange={(e) => handleMarkChange(student.student_id, 'practical_marks', e.target.value)} /></td>
                      <td className="p-2"><input type="number" className="w-16 border p-2 rounded" value={marks.final_marks || ''} onChange={(e) => handleMarkChange(student.student_id, 'final_marks', e.target.value)} /></td>
                      <td className="p-4 font-bold text-slate-800">{total}</td>
                      <td className="p-4 font-bold text-indigo-600">{calculateGrade(total)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleSave(student.student_id)} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition">
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr><td colSpan={9} className="p-8 text-center text-slate-500">No students enrolled in this course.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default function MarksEntryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <MarksEntryContent />
    </Suspense>
  );
}