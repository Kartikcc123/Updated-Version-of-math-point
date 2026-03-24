// CoursesAdminPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BookOpen, Users, X, Edit2 } from 'lucide-react'
import { fetchCourses, createCourse, fetchBatches, createBatch } from '../../store/slices/courseSlice'
import { fetchTeachers } from '../../store/slices/teacherSlice'
import toast from 'react-hot-toast'

export default function CoursesAdminPage() {
  const dispatch = useDispatch()
  const { courses, batches, loading } = useSelector(s => s.courses)
  const { list: teachers } = useSelector(s => s.teachers)
  const [tab, setTab] = useState('courses')
  const [modal, setModal] = useState(null)
  const [courseForm, setCourseForm] = useState({ name: '', code: '', description: '', targetExam: [], fee: '', duration: '', subjects: '' })
  const [batchForm, setBatchForm] = useState({ name: '', course: '', teacher: '', maxStudents: 40, room: '', startDate: '', endDate: '' })

  useEffect(() => { dispatch(fetchCourses()); dispatch(fetchBatches()); dispatch(fetchTeachers()) }, [dispatch])

  const handleCourse = async (e) => {
    e.preventDefault()
    const payload = { ...courseForm, subjects: courseForm.subjects.split(',').map(s => s.trim()), fee: +courseForm.fee }
    const res = await dispatch(createCourse(payload))
    if (!res.error) { toast.success('Course created!'); setModal(null) }
    else toast.error(res.payload || 'Error')
  }

  const handleBatch = async (e) => {
    e.preventDefault()
    const res = await dispatch(createBatch(batchForm))
    if (!res.error) { toast.success('Batch created!'); setModal(null) }
    else toast.error(res.payload || 'Error')
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Courses & Batches</h1></div>
        <div className="flex gap-2">
          <button onClick={() => setModal('batch')} className="btn-secondary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Batch</button>
          <button onClick={() => setModal('course')} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Course</button>
        </div>
      </div>

      <div className="flex gap-2">
        {['courses', 'batches'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-body font-medium transition-all capitalize ${tab === t ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6 hover:border-primary-500/30">
              <div className="flex items-start justify-between mb-3">
                <div><h4 className="font-display font-bold text-white text-lg">{c.name}</h4><span className="badge badge-orange font-mono">{c.code}</span></div>
                <div className="flex gap-1">{c.targetExam?.map(e => <span key={e} className={`badge ${e === 'JEE' ? 'badge-orange' : 'badge-blue'}`}>{e}</span>)}</div>
              </div>
              <p className="text-slate-400 text-sm font-body mb-4">{c.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">{c.subjects?.map(s => <span key={s} className="badge badge-yellow">{s}</span>)}</div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-dark-900/60 rounded-xl text-sm">
                <div><p className="text-slate-500 text-xs">Duration</p><p className="text-white font-medium">{c.duration}</p></div>
                <div><p className="text-slate-500 text-xs">Fee</p><p className="text-primary-400 font-bold font-mono">₹{c.fee?.toLocaleString()}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'batches' && (
        <div className="card overflow-hidden">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Batch Name</th><th>Course</th><th>Teacher</th><th>Students</th><th>Room</th><th>Status</th></tr></thead>
              <tbody>
                {batches.map(b => (
                  <tr key={b._id} className="table-row">
                    <td className="font-medium text-white">{b.name}</td>
                    <td className="text-slate-300 text-sm">{b.course?.name}</td>
                    <td className="text-slate-300 text-sm">{b.teacher?.name || '—'}</td>
                    <td><span className="badge badge-blue">{b.students?.length || 0}/{b.maxStudents}</span></td>
                    <td className="text-slate-400 text-sm">{b.room || '—'}</td>
                    <td><span className={`badge ${b.isActive ? 'badge-green' : 'badge-red'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
                {!batches.length && <tr><td colSpan={6} className="text-center text-slate-500 py-10 font-body">No batches found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal === 'course' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display font-bold text-white text-lg">Add Course</h3><button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button></div>
              <form onSubmit={handleCourse} className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Course Name *</label><input className="input" value={courseForm.name} onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))} required /></div>
                  <div><label className="label">Code *</label><input className="input" value={courseForm.code} onChange={e => setCourseForm(p => ({ ...p, code: e.target.value }))} required placeholder="e.g. JEE-2Y" /></div>
                  <div><label className="label">Duration</label><input className="input" value={courseForm.duration} onChange={e => setCourseForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 2 Years" /></div>
                  <div><label className="label">Fee (₹) *</label><input type="number" className="input" value={courseForm.fee} onChange={e => setCourseForm(p => ({ ...p, fee: e.target.value }))} required /></div>
                </div>
                <div><label className="label">Description</label><textarea className="input" rows={2} value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div><label className="label">Subjects (comma separated)</label><input className="input" value={courseForm.subjects} onChange={e => setCourseForm(p => ({ ...p, subjects: e.target.value }))} placeholder="Physics, Chemistry, Maths" /></div>
                <div><label className="label">Target Exam</label>
                  <div className="flex gap-4">{['JEE', 'NEET'].map(exam => (<label key={exam} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={courseForm.targetExam.includes(exam)} onChange={e => setCourseForm(p => ({ ...p, targetExam: e.target.checked ? [...p.targetExam, exam] : p.targetExam.filter(x => x !== exam) }))} className="w-4 h-4 accent-orange-500" /><span className="text-slate-300 font-body text-sm">{exam}</span></label>))}</div>
                </div>
                <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button><button type="submit" className="btn-primary flex-1">Create Course</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {modal === 'batch' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display font-bold text-white text-lg">Add Batch</h3><button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button></div>
              <form onSubmit={handleBatch} className="p-5 space-y-4">
                <div><label className="label">Batch Name *</label><input className="input" value={batchForm.name} onChange={e => setBatchForm(p => ({ ...p, name: e.target.value }))} required /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Course *</label><select className="input" value={batchForm.course} onChange={e => setBatchForm(p => ({ ...p, course: e.target.value }))} required><option value="">Select course</option>{courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                  <div><label className="label">Teacher</label><select className="input" value={batchForm.teacher} onChange={e => setBatchForm(p => ({ ...p, teacher: e.target.value }))}><option value="">Assign later</option>{teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</select></div>
                  <div><label className="label">Max Students</label><input type="number" className="input" value={batchForm.maxStudents} onChange={e => setBatchForm(p => ({ ...p, maxStudents: e.target.value }))} /></div>
                  <div><label className="label">Room</label><input className="input" value={batchForm.room} onChange={e => setBatchForm(p => ({ ...p, room: e.target.value }))} placeholder="e.g. Room 101" /></div>
                  <div><label className="label">Start Date</label><input type="date" className="input" value={batchForm.startDate} onChange={e => setBatchForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                  <div><label className="label">End Date</label><input type="date" className="input" value={batchForm.endDate} onChange={e => setBatchForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                </div>
                <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button><button type="submit" className="btn-primary flex-1">Create Batch</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
