import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppContext } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'

const StudentManagement = () => {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    students,
    setStudents,
    newStudentName,
    setNewStudentName,
    selectedGradeForStudents,
    setSelectedGradeForStudents,
    showAddStudentModal,
    setShowAddStudentModal,
    grades,
  } = context

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Logic to close dropdown can be added here if needed
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedGradeForStudents) {
      const newStudent = {
        id: Date.now(),
        name: newStudentName.trim(),
      }

      setStudents((prev: any) => ({
        ...prev,
        [selectedGradeForStudents]: [...(prev[selectedGradeForStudents] || []), newStudent],
      }))

      setNewStudentName('')
      setShowAddStudentModal(false)
    }
  }

  const handleRemoveStudent = (gradeId: number, studentId: number) => {
    setStudents((prev: any) => ({
      ...prev,
      [gradeId]: prev[gradeId].filter(student => student.id !== studentId),
    }))
  }

  return (
    <div className="bg-neutral-98 min-h-screen pb-20">
      <Header title="Student Management" onBack={() => navigate('/plan')} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <label htmlFor="grade-select" className="mb-2 block text-sm font-medium text-neutral-700">
              Select Grade
            </label>
            <select
              id="grade-select"
              value={selectedGradeForStudents || ''}
              onChange={e => setSelectedGradeForStudents(Number(e.target.value))}
              className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full rounded-2xl border-2 bg-neutral-100 p-3 focus:ring-0 focus:outline-none"
            >
              <option value="" disabled>
                Select a grade
              </option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGradeForStudents && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-neutral-800">
                  Students in {grades.find(g => g.id === selectedGradeForStudents)?.name}
                </h2>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-primary-40 rounded-lg px-4 py-2 text-white"
                >
                  Add Student
                </button>
              </div>

              <div className="rounded-lg bg-white p-4 shadow">
                {students[selectedGradeForStudents]?.length > 0 ? (
                  <ul>
                    {students[selectedGradeForStudents].map((student: { id: number; name: string }) => (
                      <li key={student.id} className="flex items-center justify-between border-b py-2">
                        <span>{student.name}</span>
                        <button
                          onClick={() => handleRemoveStudent(selectedGradeForStudents, student.id)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-500">No students in this grade yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddStudentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-medium">Add New Student</h2>
            <input
              type="text"
              value={newStudentName}
              onChange={e => setNewStudentName(e.target.value)}
              placeholder="Enter student name"
              className="mb-4 w-full rounded border p-2"
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowAddStudentModal(false)} className="text-neutral-600">
                Cancel
              </button>
              <button onClick={handleAddStudent} className="bg-primary-40 rounded-lg px-4 py-2 text-white">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}

export default StudentManagement
