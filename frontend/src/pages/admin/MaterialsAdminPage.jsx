// MaterialsAdminPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Download, X, File, Plus } from 'lucide-react'
import { fetchMaterials, uploadMaterial, deleteMaterial } from '../../store/slices/materialSlice'
import { fetchCourses, fetchBatches } from '../../store/slices/courseSlice'
import toast from 'react-hot-toast'

export default function MaterialsAdminPage() {
  const dispatch = useDispatch()
  const { list: materials, loading } = useSelector(s => s.materials)
  const { courses, batches } = useSelector(s => s.courses)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', subject: '', type: 'pdf', course: '', isPublic: false })
  const [file, setFile] = useState(null)
  const [subjectFilter, setSubjectFilter] = useState('')

  useEffect(() => { dispatch(fetchMaterials()); dispatch(fetchCourses()); dispatch(fetchBatches()) }, [dispatch])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please select a file')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('file', file)
    const res = await dispatch(uploadMaterial(fd))
    if (!res.error) { toast.success('Material uploaded!'); setModal(false); setFile(null) }
    else toast.error(res.payload || 'Upload failed')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return
    await dispatch(deleteMaterial(id)); toast.success('Deleted')
  }

  const typeIcon = { pdf: '📄', video: '🎥', notes: '📝', assignment: '📋', solution: '✅', dpp: '📃' }
  const filtered = subjectFilter ? materials.filter(m => m.subject === subjectFilter) : materials
  const subjects = [...new Set(materials.map(m => m.subject))]

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Study Materials</h1><p className="text-slate-400 text-sm font-body">{materials.length} files uploaded</p></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Material</button>
      </div>

      <div className="card p-4 flex gap-2 flex-wrap">
        <button onClick={() => setSubjectFilter('')} className={`px-4 py-1.5 rounded-lg text-sm font-body font-medium transition-all ${!subjectFilter ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>All</button>
        {subjects.map(s => (
          <button key={s} onClick={() => setSubjectFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-body font-medium transition-all ${subjectFilter === s ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{s}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Subject</th><th>Type</th><th>Uploaded By</th><th>Downloads</th><th>Access</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></td></tr>
                : filtered.map(m => (
                <tr key={m._id} className="table-row">
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{typeIcon[m.type] || '📄'}</span>
                      <div><p className="font-medium text-white text-sm">{m.title}</p><p className="text-xs text-slate-400">{m.fileName}</p></div>
                    </div>
                  </td>
                  <td><span className="badge badge-yellow">{m.subject}</span></td>
                  <td><span className="badge badge-blue capitalize">{m.type}</span></td>
                  <td className="text-slate-300 text-sm">{m.uploadedBy?.name}</td>
                  <td className="text-slate-300 text-sm">{m.downloads}</td>
                  <td><span className={`badge ${m.isPublic ? 'badge-green' : 'badge-orange'}`}>{m.isPublic ? 'Public' : 'Enrolled'}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <a href={m.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"><Download className="w-4 h-4" /></a>
                      <button onClick={() => handleDelete(m._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan={7} className="text-center text-slate-500 py-10 font-body">No materials found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display font-bold text-white text-lg">Upload Study Material</h3><button onClick={() => setModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button></div>
              <form onSubmit={handleUpload} className="p-5 space-y-4">
                <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Subject *</label><input className="input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required placeholder="Physics" /></div>
                  <div><label className="label">Type</label>
                    <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {['pdf', 'notes', 'assignment', 'solution', 'dpp'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Course</label>
                    <select className="input" value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}>
                      <option value="">All courses</option>
                      {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <input type="checkbox" id="pub" checked={form.isPublic} onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                    <label htmlFor="pub" className="text-slate-300 font-body text-sm cursor-pointer">Public access</label>
                  </div>
                </div>
                <div>
                  <label className="label">File *</label>
                  <div className="border-2 border-dashed border-dark-600 hover:border-primary-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                    onClick={() => document.getElementById('fileInput').click()}>
                    {file ? (<div className="flex items-center justify-center gap-2 text-emerald-400"><File className="w-5 h-5" /><span className="text-sm font-body">{file.name}</span></div>)
                      : (<div><Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" /><p className="text-slate-400 text-sm font-body">Click to select file (PDF, DOC, etc.)</p></div>)}
                  </div>
                  <input id="fileInput" type="file" className="hidden" onChange={e => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Upload</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
