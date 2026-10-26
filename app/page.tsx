'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    students: 0, teachers: 0, departments: 0, courses: 0, enrollments: 0, course_teacher: 0,
    attendance: 0, exams: 0, fees: 0, timetable: 0
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => { if (data.success) setCounts(data.counts); });
  }, []);

  const statCards = [
    { title: 'Total Students', count: counts.students, link: '/students', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Total Teachers', count: counts.teachers, link: '/teachers', color: 'text-purple-600', bg: 'bg-purple-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Departments', count: counts.departments, link: '/departments', color: 'text-orange-600', bg: 'bg-orange-50', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: 'Active Courses', count: counts.courses, link: '/courses', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const managementLinks = [
    { title: 'Enrollments', count: counts.enrollments, link: '/enrollments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Course-Teacher', count: counts.course_teacher, link: '/course-teacher', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { title: 'Attendance', count: counts.attendance, link: '/attendance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Exams', count: counts.exams, link: '/exams', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Fees', count: counts.fees, link: '/fees', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Timetable', count: counts.timetable, link: '/timetable', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const sidebarLinks = [
    { title: 'Dashboard', link: '/' },
    { title: 'Students', link: '/students' },
    { title: 'Teachers', link: '/teachers' },
    { title: 'Departments', link: '/departments' },
    { title: 'Courses', link: '/courses' },
    { title: 'Enrollments', link: '/enrollments' },
    { title: 'Course-Teacher', link: '/course-teacher' },
    { title: 'Attendance', link: '/attendance' },
    { title: 'Exams', link: '/exams' },
    { title: 'Fees', link: '/fees' },
    { title: 'Timetable', link: '/timetable' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* FIXED LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-40">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">CampusAdmin</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => (
            <Link 
              key={item.title} 
              href={item.link} 
              className={`block px-4 py-2.5 rounded-lg transition text-sm ${item.link === '/' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA (Pushed right by sidebar width) */}
      <div className="flex-1 md:ml-64 flex flex-col">
        
        {/* TOP HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-slate-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">AD</div>
            <span className="text-sm font-medium text-slate-700">Admin</span>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h2>
            <p className="text-slate-500 mt-1 text-sm">Here is the current status of your university management system.</p>
          </div>

          {/* TOP STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => (
              <div key={card.title} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                <div className={`p-3 ${card.bg} ${card.color} rounded-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path>
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{card.title}</p>
                  <h4 className="text-2xl font-bold text-slate-900">{card.count}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: MANAGEMENT GRID */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Management Modules</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {managementLinks.map((module) => (
                  <Link href={module.link} key={module.title} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={module.icon}></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{module.title}</h4>
                        <p className="text-xs text-slate-500">{module.count} Records</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK ACTIONS & INFO */}
            <div>
              <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <Link href="/students" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between">
                    <span>Add New Student</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </Link>
                  <Link href="/attendance" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between">
                    <span>Mark Attendance</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">System Status</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm text-slate-600 font-medium">Database Connected</span>
                </div>
                <p className="text-xs text-slate-500">Connected to MySQL on Windows Host. All services operational.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}