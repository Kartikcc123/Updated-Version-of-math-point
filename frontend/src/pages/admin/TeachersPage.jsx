// TeachersPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, UserCheck } from 'lucide-react'
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../store/slices/teacherSlice'
import toast from 'react-hot-toast'

const EMPTY = { name: '', email: '', phone: '', password: '', qualification: '', subjects: [], experience: '', salary: '' }

export default function TeachersPage() {
  const dispatch = useDispatch()
  const { list: teachers, loading } = useSelector(s => s.teachers)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [subjInput, setSubjInput] = useState('')

  useEffect(() => { dispatch(fetchTeachers({ search })) }, [dispatch, search])

  const openAdd = () => { setForm(EMPTY); setSubjInput(''); setModal('add') }
  const openEdit = (t) => { setSelected(t); setForm({ ...t, password: '' }); setSubjInput((t.subjects || []).join(', ')); setModal('edit') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, subjects: subjInput.split(',').map(s => s.trim()).filter(Boolean) }
    let res
    if (modal === 'add') res = await dispatch(createTeacher(payload))
    else res = await dispatch(updateTeacher({ id: selected._id, payload }))
    if (!res.error) { toast.success(modal === 'add' ? 'Teacher added!' : 'Teacher updated!'); setModal(null) }
    else toast.error(res.payload || 'Error')
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate teacher "${name}"?`)) return
    await dispatch(deleteTeacher(id)); toast.success('Teacher deactivated')
  }

  const f = form; const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Teachers</h1><p className="text-slate-400 text-sm font-body">{teachers.length} faculty members</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Teacher</button>
      </div>
      <div className="card p-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input className="input pl-10" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? <div className="col-span-3 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          : teachers.map(t => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 hover:border-primary-500/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold font-display">{t.name?.charAt(0)}</div>
                <div>
                  <h4 className="font-display font-bold text-white">{t.name}</h4>
                  <span className="badge badge-blue font-mono text-xs">{t.teacherId}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t._id, t.name)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm font-body">
              <p className="text-slate-400">{t.email}</p>
              <p className="text-slate-400">{t.phone}</p>
              <p className="text-slate-300">{t.qualification}</p>
              {t.experience && <p className="text-slate-400">{t.experience} years experience</p>}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">{t.subjects?.map(s => <span key={s} className="badge badge-yellow">{s}</span>)}</div>
          </motion.div>
        ))}
        {!loading && !teachers.length && <p className="col-span-3 text-center text-slate-500 py-10 font-body">No teachers found</p>}
      </div>

      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">{modal === 'add' ? 'Add Teacher' : 'Edit Teacher'}</h3>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name *</label><input className="input" value={f.name} onChange={e => setF('name', e.target.value)} required /></div>
                  <div><label className="label">Email *</label><input type="email" className="input" value={f.email} onChange={e => setF('email', e.target.value)} required /></div>
                  <div><label className="label">Phone *</label><input className="input" value={f.phone} onChange={e => setF('phone', e.target.value)} required /></div>
                  <div><label className="label">{modal === 'add' ? 'Password *' : 'New Password'}</label><input type="password" className="input" value={f.password} onChange={e => setF('password', e.target.value)} required={modal === 'add'} /></div>
                  <div><label className="label">Qualification</label><input className="input" value={f.qualification || ''} onChange={e => setF('qualification', e.target.value)} placeholder="e.g. M.Sc Physics" /></div>
                  <div><label className="label">Experience (Years)</label><input type="number" className="input" value={f.experience || ''} onChange={e => setF('experience', e.target.value)} /></div>
                  <div><label className="label">Monthly Salary (₹)</label><input type="number" className="input" value={f.salary || ''} onChange={e => setF('salary', e.target.value)} /></div>
                </div>
                <div><label className="label">Subjects (comma separated)</label><input className="input" value={subjInput} onChange={e => setSubjInput(e.target.value)} placeholder="Physics, Chemistry, Maths" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><UserCheck className="w-4 h-4" />{modal === 'add' ? 'Add Teacher' : 'Update'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
