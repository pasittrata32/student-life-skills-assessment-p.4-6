
import React from 'react';
import { Student, SchoolInfo } from '../types';
import { SCHOOL_INFO } from '../constants';
import { Download, FileText, User, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface StudentListProps {
  teacherName: string;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onLogout: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ teacherName, students, onSelectStudent, onLogout }) => {
  
  const exportToExcel = () => {
    const exportData = students.map((s, index) => ({
      'ลำดับ': index + 1,
      'ชื่อ-นามสกุล': `${s.firstName} ${s.lastName}`,
      'ชั้น': s.classLevel,
      'เลขที่': s.number,
      'สถานะ': s.isAssessed ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน',
      'คะแนนรวม (เต็ม 60)': s.score || '-',
      'ร้อยละ': s.percentage ? `${s.percentage.toFixed(2)}%` : '-',
      'ผลการประเมิน': s.evaluationLevel || '-',
      'จุดเด่น': s.strengths || '-',
      'จุดควรพัฒนา': s.improvements || '-',
      'ครูผู้ประเมิน': s.teacherName || '-',
      'วันที่ประเมิน': s.assessmentDate || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Assessment");
    XLSX.writeFile(wb, `รายงานผลการประเมิน_${SCHOOL_INFO.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const assessedCount = students.filter(s => s.isAssessed).length;

  return (
    <div className="min-h-screen bg-navy-50 font-sans">
      {/* Header */}
      <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              ระบบประเมินความสามารถในการใช้ทักษะชีวิต
            </h1>
            <p className="text-navy-200 text-sm mt-1">{SCHOOL_INFO.name} {SCHOOL_INFO.district} {SCHOOL_INFO.province}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-navy-200">ครูผู้สอน</div>
              <div className="font-semibold">{teacherName}</div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 bg-navy-800 rounded-full hover:bg-navy-700 transition-colors text-navy-100"
              title="ออกจากระบบ"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-navy-900">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-navy-50 text-navy-900 mr-4">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">นักเรียนทั้งหมด</p>
                <p className="text-2xl font-bold text-navy-900">{students.length} คน</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ประเมินแล้ว</p>
                <p className="text-2xl font-bold text-gray-900">{assessedCount} คน</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-50 text-orange-600 mr-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">รอการประเมิน</p>
                <p className="text-2xl font-bold text-gray-900">{students.length - assessedCount} คน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-navy-900">รายชื่อนักเรียน</h2>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-navy-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-800 uppercase tracking-wider">เลขที่</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-800 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-800 uppercase tracking-wider">ชั้น</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-navy-800 uppercase tracking-wider">สถานะ</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-navy-800 uppercase tracking-wider">คะแนน (%)</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-navy-800 uppercase tracking-wider">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.classLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.isAssessed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.isAssessed ? 'ประเมินแล้ว' : 'รอการประเมิน'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {student.isAssessed ? (
                        <span className="font-semibold text-navy-700">
                          {student.score} ({student.percentage?.toFixed(2)}%)
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className={`inline-flex items-center px-3 py-1 rounded border ${
                          student.isAssessed
                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'border-transparent text-white bg-navy-600 hover:bg-navy-700'
                        } transition-colors`}
                      >
                        {student.isAssessed ? 'แก้ไขผล' : 'ประเมิน'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
