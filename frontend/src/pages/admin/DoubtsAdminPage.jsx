// DoubtsAdminPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, CheckCircle } from 'lucide-react'
import { fetchAllDoubts, replyToDoubt, updateDoubtStatus } from '../../store/slices/doubtSlice'
import toast from 'react-hot-toast'

const statusColors = { open: 'badge-red', 'in-progress': 'badge-yellow', resolved: 'badge-green', closed: 'badge-blue' }

export default function DoubtsAdminPage() {
  const dispatch = useDispatch()
  const { list: doubts, loading } = useSelector(s => s.doubts)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { dispatch(fetchAllDoubts({ status: statusFilter })) }, [dispatch, statusFilter])

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    const res = await dispatch(replyToDoubt({ id: selected._id, message: reply }))
    if (!res.error) { setReply(''); toast.success('Reply sent!'); setSelected(res.payload.doubt) }
  }

  const handleStatus = async (id, status) => {
    await dispatch(updateDoubtStatus({ id, status })); toast.success('Status updated')
    dispatch(fetchAllDoubts({ status: statusFilter }))
  }

  const filtered = statusFilter ? doubts.filter(d => d.status === statusFilter) : doubts

  return (
    <div className="space-y-5">
      <div className="page-header"><h1 className="section-title">Doubts & Support</h1><p className="text-slate-400 text-sm font-body">{doubts.filter(d => d.status === 'open').length} open doubts</p></div>
      <div className="card p-4 flex gap-2 flex-wrap">
        {['', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-body font-medium transition-all capitalize ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{s || 'All'}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {loading ? <div className="card p-10 text-center"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
            : filtered.map(d => (
            <motion.div key={d._id} onClick={() => setSelected(d)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`card p-4 cursor-pointer hover:border-primary-500/30 transition-all ${selected?._id === d._id ? 'border-primary-500/40 bg-primary-500/5' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div><p className="font-medium text-white text-sm">{d.title}</p><p className="text-xs text-slate-400 font-body">{d.student?.name} · {d.subject}</p></div>
                <span className={`badge ${statusColors[d.status]}`}>{d.status}</span>
              </div>
              <p className="text-slate-400 text-xs font-body line-clamp-2">{d.description}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 font-body">
                <span>{d.replies?.length || 0} replies</span>
                <span>{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
          {!loading && !filtered.length && <div className="card p-12 text-center"><HelpCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" /><p className="text-slate-500 font-body text-sm">No doubts found</p></div>}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="card overflow-hidden flex flex-col h-full max-h-[600px]">
              <div className="p-4 border-b border-dark-700/60">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-white">{selected.title}</h4>
                    <p className="text-xs text-slate-400 font-body mt-0.5">{selected.student?.name} · {selected.subject} · {selected.topic}</p>
                  </div>
                  <div className="flex gap-2">
                    {['open', 'in-progress', 'resolved', 'closed'].map(s => (
                      <button key={s} onClick={() => handleStatus(selected._id, s)}
                        className={`px-2 py-1 rounded-lg text-xs font-body transition-all capitalize ${selected.status === s ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm font-body mt-3 bg-dark-900/60 rounded-xl p-3">{selected.description}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.replies?.map((r, i) => (
                  <div key={i} className={`flex gap-3 ${r.user?.role !== 'student' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center text-white text-xs font-bold font-display shrink-0">{r.user?.name?.charAt(0) || '?'}</div>
                    <div className={`max-w-xs p-3 rounded-xl text-sm font-body ${r.user?.role !== 'student' ? 'bg-primary-500/20 text-white ml-auto' : 'bg-dark-800 text-slate-300'}`}>
                      <p className="text-xs text-slate-400 mb-1">{r.user?.name}</p>
                      {r.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="p-4 border-t border-dark-700/60 flex gap-2">
                <input className="input flex-1" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." />
                <button type="submit" className="btn-primary px-4 py-2.5 flex items-center gap-1"><MessageCircle className="w-4 h-4" /></button>
              </form>
            </div>
          ) : (
            <div className="card p-16 text-center h-full flex items-center justify-center">
              <div><MessageCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body">Select a doubt to view and reply</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
