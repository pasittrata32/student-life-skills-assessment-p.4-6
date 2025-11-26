
import React, { useState, useEffect } from 'react';
import { Student, ViewState, Teacher } from './types';
import { MOCK_STUDENTS, TEACHERS } from './constants';
import { Login } from './components/Login';
import { StudentList } from './components/StudentList';
import { AssessmentForm } from './components/AssessmentForm';
import { saveStudentToSheet } from './services/api';
import Swal from 'sweetalert2';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loginError, setLoginError] = useState<string>('');

  // Initialize data
  useEffect(() => {
    // In a real app, fetch from API or localStorage
    setStudents(MOCK_STUDENTS);
  }, []);

  const handleLogin = (username: string, pass: string) => {
    const teacher = TEACHERS.find(t => t.username === username && t.password === pass);
    
    if (teacher) {
      setCurrentTeacher(teacher);
      setLoginError('');
      setViewState(ViewState.DASHBOARD);
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setCurrentTeacher(null);
    setViewState(ViewState.LOGIN);
    setCurrentStudent(null);
    setLoginError('');
  };

  const handleSelectStudent = (student: Student) => {
    setCurrentStudent(student);
    setViewState(ViewState.ASSESSMENT);
  };

  const handleSaveAssessment = async (updatedStudent: Student) => {
    // Show loading
    Swal.fire({
      title: 'กำลังบันทึกข้อมูล...',
      text: 'กรุณารอสักครู่ ระบบกำลังเชื่อมต่อฐานข้อมูล',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Attempt to save to Google Sheets (async)
      const isSavedToSheet = await saveStudentToSheet(updatedStudent);
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
      );
      
      // Update View State
      setViewState(ViewState.DASHBOARD);
      setCurrentStudent(null);

      // Show success notification
      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: isSavedToSheet 
          ? 'บันทึกข้อมูลเรียบร้อยแล้ว' 
          : 'บันทึกข้อมูลในเครื่องเรียบร้อย (ยังไม่ได้เชื่อมต่อ Google Sheets)',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#102a43',
        timer: 3000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleCancelAssessment = () => {
    setViewState(ViewState.DASHBOARD);
    setCurrentStudent(null);
  };

  // Filter students based on logged-in teacher's class
  const visibleStudents = currentTeacher 
    ? students.filter(s => s.classLevel === currentTeacher.classLevel)
    : [];

  return (
    <div className="antialiased text-gray-900 bg-gray-100 min-h-screen">
      {viewState === ViewState.LOGIN && (
        <Login onLogin={handleLogin} error={loginError} />
      )}

      {viewState === ViewState.DASHBOARD && currentTeacher && (
        <StudentList 
          teacherName={currentTeacher.name} 
          students={visibleStudents} 
          onSelectStudent={handleSelectStudent}
          onLogout={handleLogout}
        />
      )}

      {viewState === ViewState.ASSESSMENT && currentStudent && currentTeacher && (
        <AssessmentForm 
          student={currentStudent}
          teacherName={currentTeacher.name}
          onSave={handleSaveAssessment}
          onCancel={handleCancelAssessment}
        />
      )}
    </div>
  );
}

export default App;
