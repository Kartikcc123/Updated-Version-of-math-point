import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Eye, X, UserCheck } from 'lucide-react'
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../../store/slices/studentSlice'
import { fetchBatches } from '../../store/slices/courseSlice'
import toast from 'react-hot-toast'

const EMPTY = { name: '', email: '', phone: '', password: '', targetExam: [], gender: '', dateOfBirth: '', parentName: '', parentPhone: '', address: '', board: '', school: '' }

export default function StudentsPage() {
  const dispatch = useDispatch()
  const { list: students, total, loading } = useSelector(s => s.students)
  const { batches } = useSelector(s => s.courses)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [page, setPage] = useState(1)

  useEffect(() => { dispatch(fetchStudents({ search, page })) }, [dispatch, search, page])
  useEffect(() => { dispatch(fetchBatches()) }, [dispatch])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (s) => { setSelected(s); setForm({ ...s, password: '' }); setModal('edit') }
  const openView = (s) => { setSelected(s); setModal('view') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res
    if (modal === 'add') res = await dispatch(createStudent(form))
    else res = await dispatch(updateStudent({ id: selected._id, payload: form }))
    if (!res.error) { toast.success(modal === 'add' ? 'Student added!' : 'Student updated!'); setModal(null) }
    else toast.error(res.payload || 'Error')
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate student "${name}"?`)) return
    await dispatch(deleteStudent(id))
    toast.success('Student deactivated')
  }

  const f = form
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Students</h1><p className="text-slate-400 text-sm font-body">{total} total students enrolled</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Student</button>
      </div>

      {/* Search */}
      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="Search by name, email or ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>ID</th><th>Phone</th><th>Target</th><th>Batch</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-slate-500 py-10 font-body">No students found</td></tr>
              ) : students.map(s => (
                <tr key={s._id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 orange-gradient rounded-full flex items-center justify-center text-white font-bold text-xs font-display shrink-0">{s.name?.charAt(0)}</div>
                      <div><p className="font-medium text-white text-sm">{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
                    </div>
                  </td>
                  <td><span className="badge badge-orange font-mono text-xs">{s.studentId}</span></td>
                  <td className="text-slate-300 text-sm">{s.phone}</td>
                  <td>{s.targetExam?.map(e => <span key={e} className={`badge ${e === 'JEE' ? 'badge-orange' : 'badge-blue'} mr-1`}>{e}</span>)}</td>
                  <td className="text-xs text-slate-400">{s.enrolledBatches?.length || 0} batch(es)</td>
                  <td><span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openView(s)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s._id, s.name)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Add/Edit */}
      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
                <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name *</label><input className="input" value={f.name} onChange={e => setF('name', e.target.value)} required placeholder="Student name" /></div>
                  <div><label className="label">Email *</label><input type="email" className="input" value={f.email} onChange={e => setF('email', e.target.value)} required placeholder="email@example.com" /></div>
                  <div><label className="label">Phone *</label><input className="input" value={f.phone} onChange={e => setF('phone', e.target.value)} required placeholder="10-digit number" /></div>
                  <div><label className="label">{modal === 'add' ? 'Password *' : 'New Password (leave blank)'}</label><input type="password" className="input" value={f.password} onChange={e => setF('password', e.target.value)} required={modal === 'add'} placeholder="Min 6 chars" /></div>
                  <div><label className="label">Date of Birth</label><input type="date" className="input" value={f.dateOfBirth?.split('T')[0] || ''} onChange={e => setF('dateOfBirth', e.target.value)} /></div>
                  <div>
                    <label className="label">Gender</label>
                    <select className="input" value={f.gender} onChange={e => setF('gender', e.target.value)}>
                      <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div><label className="label">Parent Name</label><input className="input" value={f.parentName || ''} onChange={e => setF('parentName', e.target.value)} placeholder="Parent/Guardian name" /></div>
                  <div><label className="label">Parent Phone</label><input className="input" value={f.parentPhone || ''} onChange={e => setF('parentPhone', e.target.value)} placeholder="Parent phone number" /></div>
                  <div><label className="label">School/College</label><input className="input" value={f.school || ''} onChange={e => setF('school', e.target.value)} placeholder="School name" /></div>
                  <div><label className="label">Board</label><input className="input" value={f.board || ''} onChange={e => setF('board', e.target.value)} placeholder="CBSE / ICSE / State" /></div>
                </div>
                <div>
                  <label className="label">Target Exam</label>
                  <div className="flex gap-4">
                    {['JEE', 'NEET'].map(exam => (
                      <label key={exam} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={f.targetExam?.includes(exam) || false}
                          onChange={e => setF('targetExam', e.target.checked ? [...(f.targetExam || []), exam] : (f.targetExam || []).filter(x => x !== exam))}
                          className="w-4 h-4 accent-orange-500" />
                        <span className="text-slate-300 font-body text-sm">{exam}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className="label">Address</label><textarea className="input" rows={2} value={f.address || ''} onChange={e => setF('address', e.target.value)} placeholder="Full address" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <UserCheck className="w-4 h-4" /> {modal === 'add' ? 'Add Student' : 'Update Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {modal === 'view' && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="card w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">Student Details</h3>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 orange-gradient rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display">{selected.name?.charAt(0)}</div>
                  <div>
                    <h4 className="font-display font-bold text-white text-xl">{selected.name}</h4>
                    <span className="badge badge-orange font-mono">{selected.studentId}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm font-body">
                  {[['Email', selected.email], ['Phone', selected.phone], ['Parent', selected.parentName], ['Parent Phone', selected.parentPhone], ['School', selected.school], ['Board', selected.board], ['Gender', selected.gender], ['DOB', selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString('en-IN') : '-']].map(([k, v]) => (
                    <div key={k} className="bg-dark-900/60 rounded-xl p-3">
                      <p className="text-slate-500 text-xs mb-0.5">{k}</p>
                      <p className="text-white font-medium">{v || '—'}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {selected.targetExam?.map(e => <span key={e} className={`badge ${e === 'JEE' ? 'badge-orange' : 'badge-blue'}`}>{e}</span>)}
                  <span className={`badge ${selected.isActive ? 'badge-green' : 'badge-red'}`}>{selected.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
