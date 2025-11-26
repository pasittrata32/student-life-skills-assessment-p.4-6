
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { ASSESSMENT_DATA, SCHOOL_INFO } from '../constants';
import { Save, ArrowLeft, Calculator } from 'lucide-react';
import Swal from 'sweetalert2';

interface AssessmentFormProps {
  student: Student;
  teacherName: string;
  onSave: (updatedStudent: Student) => void;
  onCancel: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ student, teacherName, onSave, onCancel }) => {
  const [scores, setScores] = useState<Record<number, number>>(student.rawScores || {});
  const [strengths, setStrengths] = useState(student.strengths || '');
  const [improvements, setImprovements] = useState(student.improvements || '');

  // Auto-fill 0 for unchecked items on initial load if clean slate, but let's keep it empty to force user input
  // or we can default to null/undefined
  
  const handleScoreChange = (questionId: number, score: number) => {
    setScores(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  // Calculations
  const totalQuestions = ASSESSMENT_DATA.reduce((acc, cat) => acc + cat.questions.length, 0);
  const maxScore = totalQuestions * 2; // 30 * 2 = 60
  const currentTotalScore = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);
  const percent = (currentTotalScore / maxScore) * 100;

  let evaluationLevel = "ปรับปรุง";
  if (percent >= 75) evaluationLevel = "ดีเยี่ยม";
  else if (percent >= 50) evaluationLevel = "ดี";
  else if (percent >= 25) evaluationLevel = "พอใช้";

  const isFormComplete = Object.keys(scores).length === totalQuestions;

  const handleSave = () => {
    if (!isFormComplete) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาประเมินให้ครบทุกข้อก่อนบันทึก',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#102a43'
      });
      return;
    }

    const updatedStudent: Student = {
      ...student,
      isAssessed: true,
      rawScores: scores,
      score: currentTotalScore,
      percentage: percent,
      evaluationLevel,
      strengths,
      improvements,
      teacherName,
      assessmentDate: new Date().toLocaleDateString('th-TH')
    };

    Swal.fire({
      title: 'ยืนยันการบันทึก',
      text: "ต้องการบันทึกผลการประเมินใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#102a43',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        onSave(updatedStudent);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-none print:shadow-none">
        
        {/* Paper Header */}
        <div className="p-8 border-b-2 border-navy-900 text-center bg-navy-50">
          <h1 className="text-2xl font-bold text-navy-900">แบบประเมินความสามารถในการใช้ทักษะชีวิต</h1>
          <h2 className="text-xl font-bold text-navy-800 mt-2">ชั้นประถมศึกษาปีที่ 4 – 6</h2>
          <p className="text-gray-600 mt-4">{SCHOOL_INFO.name} {SCHOOL_INFO.district} {SCHOOL_INFO.province}</p>
        </div>

        <div className="p-8">
          {/* Student Info Section */}
          <div className="mb-8 bg-white p-6 border border-gray-300 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-navy-900 mb-4 border-b pb-2">ตอนที่ 1 ข้อมูลทั่วไปของนักเรียน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <span className="font-semibold w-24 text-gray-700">ชื่อ-สกุล:</span>
                <span className="border-b border-dotted border-gray-400 flex-1 px-2">{student.firstName} {student.lastName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-20 text-gray-700">โรงเรียน:</span>
                <span className="border-b border-dotted border-gray-400 flex-1 px-2">{SCHOOL_INFO.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center flex-1">
                    <span className="font-semibold w-16 text-gray-700">ระดับชั้น:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1 px-2">{student.classLevel}</span>
                </div>
                <div className="flex items-center flex-1">
                    <span className="font-semibold w-12 text-gray-700">ห้อง:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1 px-2">{student.classLevel.split('/')[1] || '-'}</span>
                </div>
                <div className="flex items-center flex-1">
                    <span className="font-semibold w-12 text-gray-700">เลขที่:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1 px-2">{student.number}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 bg-blue-50 p-4 rounded border-l-4 border-navy-800 text-sm">
            <h4 className="font-bold text-navy-900 mb-2">คำชี้แจง</h4>
            <p>ให้ครูทำเครื่องหมาย ✓ ลงในช่องที่ตรงกับพฤติกรรมของนักเรียน ตามเกณฑ์พิจารณาดังนี้</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><span className="font-bold">ระดับ 2</span> หมายถึง นักเรียนปฏิบัติ/แสดงพฤติกรรมดังกล่าว <span className="text-green-700 font-bold">เป็นประจำ</span></li>
                <li><span className="font-bold">ระดับ 1</span> หมายถึง นักเรียนปฏิบัติ/แสดงพฤติกรรมดังกล่าว <span className="text-orange-600 font-bold">บางครั้ง</span></li>
                <li><span className="font-bold">ระดับ 0</span> หมายถึง นักเรียน <span className="text-red-600 font-bold">ไม่เคย</span>ปฏิบัติหรือไม่เคยแสดงพฤติกรรม</li>
            </ul>
          </div>

          {/* Assessment Table */}
          <h3 className="text-lg font-bold text-navy-900 mb-4">ตอนที่ 2 รายการประเมินความสามารถในการใช้ทักษะชีวิต</h3>
          
          <div className="overflow-hidden border border-gray-300 rounded-lg mb-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-navy-100">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 text-center text-sm font-bold text-navy-900 border-r border-gray-300 w-16">ข้อที่</th>
                  <th rowSpan={2} className="px-4 py-3 text-left text-sm font-bold text-navy-900 border-r border-gray-300">รายการประเมิน</th>
                  <th colSpan={3} className="px-4 py-2 text-center text-sm font-bold text-navy-900 border-b border-gray-300">การปฏิบัติ/การแสดงพฤติกรรม</th>
                </tr>
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-medium text-navy-900 border-r border-gray-300 bg-green-50 w-24">เป็นประจำ (2)</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-navy-900 border-r border-gray-300 bg-orange-50 w-24">เป็นบางครั้ง (1)</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-navy-900 bg-red-50 w-24">ไม่เคย (0)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ASSESSMENT_DATA.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr className="bg-gray-100">
                      <td colSpan={5} className="px-4 py-3 text-sm font-bold text-navy-900">
                        {category.title}
                      </td>
                    </tr>
                    {category.questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center text-sm text-gray-900 border-r border-gray-200">{q.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">{q.text}</td>
                        <td className="px-2 py-2 text-center border-r border-gray-200 bg-green-50/30">
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            checked={scores[q.id] === 2}
                            onChange={() => handleScoreChange(q.id, 2)}
                            className="h-5 w-5 text-navy-900 focus:ring-navy-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-2 py-2 text-center border-r border-gray-200 bg-orange-50/30">
                          <input 
                            type="radio" 
                            name={`q-${q.id}`}
                            checked={scores[q.id] === 1}
                            onChange={() => handleScoreChange(q.id, 1)}
                            className="h-5 w-5 text-navy-900 focus:ring-navy-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-2 py-2 text-center bg-red-50/30">
                          <input 
                            type="radio" 
                            name={`q-${q.id}`}
                            checked={scores[q.id] === 0}
                            onChange={() => handleScoreChange(q.id, 0)}
                            className="h-5 w-5 text-navy-900 focus:ring-navy-500 cursor-pointer" 
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                {/* Summary Row */}
                <tr className="bg-navy-50 border-t-2 border-navy-200">
                   <td colSpan={2} className="px-4 py-3 text-right font-bold text-navy-900">คะแนนรวม</td>
                   <td colSpan={3} className="px-4 py-3 text-center font-bold text-xl text-navy-900">{currentTotalScore}</td>
                </tr>
                <tr className="bg-navy-100 border-t border-navy-200">
                   <td colSpan={2} className="px-4 py-3 text-right font-bold text-navy-900">สรุปคะแนนร้อยละ</td>
                   <td colSpan={3} className="px-4 py-3 text-center font-bold text-navy-900">
                      <div className="flex flex-col items-center text-sm">
                        <span>คะแนนที่ได้ x 100</span>
                        <div className="w-24 h-px bg-navy-900 my-1"></div>
                        <span>60</span>
                      </div>
                      <div className="mt-2 text-lg text-blue-800">= {percent.toFixed(2)} %</div>
                   </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conclusion Section */}
          <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-bold text-navy-900 mb-4">สรุปผลการประเมินความสามารถในการใช้ทักษะชีวิต</h3>
            
            <div className="flex flex-wrap gap-6 mb-6">
                <span className="font-semibold">นักเรียนอยู่ในระดับ:</span>
                <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" checked={evaluationLevel === 'ดีเยี่ยม'} readOnly className="h-5 w-5 text-navy-900 rounded border-gray-300 bg-gray-100" />
                    <span>ดีเยี่ยม (75% ขึ้นไป)</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" checked={evaluationLevel === 'ดี'} readOnly className="h-5 w-5 text-navy-900 rounded border-gray-300 bg-gray-100" />
                    <span>ดี (50-74%)</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" checked={evaluationLevel === 'พอใช้'} readOnly className="h-5 w-5 text-navy-900 rounded border-gray-300 bg-gray-100" />
                    <span>พอใช้ (25-49%)</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" checked={evaluationLevel === 'ปรับปรุง'} readOnly className="h-5 w-5 text-navy-900 rounded border-gray-300 bg-gray-100" />
                    <span>ปรับปรุง (ต่ำกว่า 25%)</span>
                </label>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-gray-800">บันทึกเพิ่มเติม (สำหรับครูผู้สอน)</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จุดเด่นของนักเรียนคือ</label>
                    <textarea 
                        rows={3} 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-navy-500 focus:border-navy-500"
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="ระบุจุดเด่น..."
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จุดที่ควรพัฒนาของนักเรียนคือ</label>
                    <textarea 
                        rows={3} 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-navy-500 focus:border-navy-500"
                        value={improvements}
                        onChange={(e) => setImprovements(e.target.value)}
                        placeholder="ระบุสิ่งที่ควรพัฒนา..."
                    ></textarea>
                </div>
            </div>

            <div className="mt-8 flex justify-end items-center gap-2">
                <span className="font-semibold">ลงชื่อ:</span>
                <span className="border-b border-dotted border-gray-400 w-48 text-center px-2">{teacherName}</span>
                <span>ครูผู้สอน</span>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-up flex justify-between items-center z-20">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            ย้อนกลับ
          </button>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Calculator className="w-4 h-4" />
                <span>ความคืบหน้า: {Object.keys(scores).length} / {totalQuestions} ข้อ</span>
             </div>
             <button 
                onClick={handleSave}
                disabled={!isFormComplete}
                className={`flex items-center gap-2 px-8 py-2 rounded-lg text-white font-medium shadow-lg transition-all ${
                    isFormComplete 
                    ? 'bg-navy-900 hover:bg-navy-800 hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
             >
                <Save className="w-5 h-5" />
                บันทึกผลการประเมิน
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
