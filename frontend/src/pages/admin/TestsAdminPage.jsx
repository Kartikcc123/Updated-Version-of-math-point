// TestsAdminPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Eye, Trash2, X, CheckCircle } from 'lucide-react'
import { fetchTests, createTest } from '../../store/slices/testSlice'
import { fetchCourses, fetchBatches } from '../../store/slices/courseSlice'
import toast from 'react-hot-toast'

const blankQ = { question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 4, negativeMarks: 1, subject: '', difficulty: 'medium' }

export default function TestsAdminPage() {
  const dispatch = useDispatch()
  const { list: tests } = useSelector(s => s.tests)
  const { courses, batches } = useSelector(s => s.courses)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', type: 'chapter', subject: '', duration: 180, scheduledDate: '', isPublished: false, course: '', batch: [], instructions: [] })
  const [questions, setQuestions] = useState([{ ...blankQ }])
  const [instrInput, setInstrInput] = useState('')

  useEffect(() => { dispatch(fetchTests()); dispatch(fetchCourses()); dispatch(fetchBatches()) }, [dispatch])

  const addQ = () => setQuestions(p => [...p, { ...blankQ }])
  const removeQ = (i) => setQuestions(p => p.filter((_, idx) => idx !== i))
  const updateQ = (i, field, val) => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: val } : q))
  const updateOpt = (qi, oi, val) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const totalMarks = questions.reduce((s, q) => s + +q.marks, 0)
    const instrs = instrInput.split('\n').filter(Boolean)
    const res = await dispatch(createTest({ ...form, questions, totalMarks, instructions: instrs }))
    if (!res.error) { toast.success('Test created!'); setModal(false) }
    else toast.error(res.payload || 'Error')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return
    await dispatch(deleteTest(id)); toast.success('Test deleted')
  }

  const typeBadge = { chapter: 'badge-blue', unit: 'badge-yellow', 'full-length': 'badge-orange', mock: 'badge-green', revision: 'badge-blue' }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Tests & Exams</h1><p className="text-slate-400 text-sm font-body">{tests.length} tests created</p></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Test</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map(t => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-5 hover:border-primary-500/30">
            <div className="flex items-start justify-between mb-3">
              <div><h4 className="font-display font-bold text-white">{t.title}</h4><span className={`badge ${typeBadge[t.type] || 'badge-blue'} mt-1`}>{t.type}</span></div>
              <div className="flex gap-1">
                <button onClick={() => handleDelete(t._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-dark-900/60 rounded-lg p-2"><p className="text-xs text-slate-500">Questions</p><p className="font-bold text-white font-display">{t.questions?.length || 0}</p></div>
              <div className="bg-dark-900/60 rounded-lg p-2"><p className="text-xs text-slate-500">Marks</p><p className="font-bold text-white font-display">{t.totalMarks}</p></div>
              <div className="bg-dark-900/60 rounded-lg p-2"><p className="text-xs text-slate-500">Time</p><p className="font-bold text-white font-display">{t.duration}m</p></div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`badge ${t.isPublished ? 'badge-green' : 'badge-yellow'}`}>{t.isPublished ? '✓ Published' : 'Draft'}</span>
              {t.scheduledDate && <span className="text-xs text-slate-400 font-body">{new Date(t.scheduledDate).toLocaleDateString('en-IN')}</span>}
            </div>
          </motion.div>
        ))}
        {!tests.length && <div className="col-span-3 text-center text-slate-500 py-16 font-body"><FileText className="w-10 h-10 mx-auto mb-3 text-slate-700" />No tests created yet</div>}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card w-full max-w-3xl my-6">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-xl">Create Test</h3>
                <button onClick={() => setModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-display font-semibold text-white mb-3">Test Details</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><label className="label">Test Title *</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Chapter 3 - Kinematics Test" /></div>
                    <div><label className="label">Type</label>
                      <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                        {['chapter', 'unit', 'full-length', 'mock', 'revision'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div><label className="label">Subject</label><input className="input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Physics / Chemistry / Maths" /></div>
                    <div><label className="label">Duration (minutes)</label><input type="number" className="input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} /></div>
                    <div><label className="label">Scheduled Date</label><input type="datetime-local" className="input" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} /></div>
                    <div><label className="label">Course</label>
                      <select className="input" value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}>
                        <option value="">All courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <input type="checkbox" id="publish" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                      <label htmlFor="publish" className="text-slate-300 font-body text-sm cursor-pointer">Publish immediately</label>
                    </div>
                  </div>
                  <div className="mt-4"><label className="label">Instructions (one per line)</label><textarea className="input" rows={3} value={instrInput} onChange={e => setInstrInput(e.target.value)} placeholder="Each question carries 4 marks&#10;-1 for wrong answer&#10;Don't use calculator" /></div>
                </div>

                {/* Questions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-semibold text-white">Questions ({questions.length})</h4>
                    <button type="button" onClick={addQ} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Question</button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {questions.map((q, i) => (
                      <div key={i} className="bg-dark-900/60 rounded-xl p-4 border border-dark-700/40">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-primary-400 font-display">Q{i + 1}</span>
                          <button type="button" onClick={() => removeQ(i)} className="text-slate-500 hover:text-red-400"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                          <input className="input text-sm" value={q.question} onChange={e => updateQ(i, 'question', e.target.value)} placeholder="Enter question text..." required />
                          <div className="grid grid-cols-3 gap-2">
                            <div><select className="input text-sm" value={q.type} onChange={e => updateQ(i, 'type', e.target.value)}><option value="mcq">MCQ</option><option value="numerical">Numerical</option></select></div>
                            <div><input type="number" className="input text-sm" value={q.marks} onChange={e => updateQ(i, 'marks', e.target.value)} placeholder="+Marks" /></div>
                            <div><input type="number" className="input text-sm" value={q.negativeMarks} onChange={e => updateQ(i, 'negativeMarks', e.target.value)} placeholder="-Marks" /></div>
                          </div>
                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((o, j) => (
                                <div key={j} className="flex items-center gap-2">
                                  <span className="text-xs text-primary-400 font-bold w-5">{String.fromCharCode(65 + j)}</span>
                                  <input className="input text-sm" value={o} onChange={e => updateOpt(i, j, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + j)}`} />
                                </div>
                              ))}
                            </div>
                          )}
                          <div><label className="text-xs text-slate-400 mb-1 block">Correct Answer</label>
                            <input className="input text-sm" value={q.correctAnswer} onChange={e => updateQ(i, 'correctAnswer', e.target.value)} placeholder={q.type === 'mcq' ? '0 for A, 1 for B, etc.' : 'Numerical answer'} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Create Test</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
