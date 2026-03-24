import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Download, Search, FileText, BookOpen, Upload } from 'lucide-react'
import { fetchMyMaterials } from '../../store/slices/materialSlice'
import api from '../../services/api'
import toast from 'react-hot-toast'

const typeIcon = { pdf: '📄', video: '🎥', notes: '📝', assignment: '📋', solution: '✅', dpp: '📃' }
const typeColor = { pdf: 'badge-red', video: 'badge-blue', notes: 'badge-yellow', assignment: 'badge-orange', solution: 'badge-green', dpp: 'badge-blue' }

export default function StudentMaterials() {
  const dispatch = useDispatch()
  const { list: materials, loading } = useSelector(s => s.materials)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => { dispatch(fetchMyMaterials()) }, [dispatch])

  const handleDownload = async (id, fileName) => {
    try {
      toast.loading('Downloading...')
      const response = await api.get(`/materials/${id}/download`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url; a.download = fileName; a.click()
      toast.dismiss(); toast.success('Downloaded!')
    } catch { toast.dismiss(); toast.error('Download failed') }
  }

  const subjects = [...new Set(materials.map(m => m.subject).filter(Boolean))]
  const filtered = materials.filter(m =>
    (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subject?.toLowerCase().includes(search.toLowerCase())) &&
    (!subjectFilter || m.subject === subjectFilter) &&
    (!typeFilter || m.type === typeFilter)
  )

  return (
    <div className="space-y-5">
      <h1 className="section-title">Study Materials</h1>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-40" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input sm:w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {['pdf', 'notes', 'assignment', 'solution', 'dpp'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card p-16 text-center"><div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center"><Upload className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body">No study materials found</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-5 hover:border-primary-500/30 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{typeIcon[m.type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-white text-sm leading-tight truncate">{m.title}</h4>
                  <p className="text-slate-400 text-xs font-body mt-0.5">{m.topic || m.subject}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                <span className="badge badge-yellow">{m.subject}</span>
                <span className={`badge ${typeColor[m.type] || 'badge-blue'} capitalize`}>{m.type}</span>
                {m.isPublic && <span className="badge badge-green">Public</span>}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-body mb-3">
                <span>By: {m.uploadedBy?.name}</span>
                <span>{m.downloads} downloads</span>
              </div>
              <button onClick={() => handleDownload(m._id, m.fileName)}
                className="btn-primary text-sm py-2 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
