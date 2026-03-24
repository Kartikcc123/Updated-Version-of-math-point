import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Plus, MessageCircle, X, Send } from 'lucide-react'
import { fetchMyDoubts, createDoubt, replyToDoubt } from '../../store/slices/doubtSlice'
import toast from 'react-hot-toast'

const statusColors = { open: 'badge-red', 'in-progress': 'badge-yellow', resolved: 'badge-green', closed: 'badge-blue' }

export default function StudentDoubts() {
  const dispatch = useDispatch()
  const { list: doubts, loading } = useSelector(s => s.doubts)
  const { user } = useSelector(s => s.auth)
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [form, setForm] = useState({ title: '', subject: '', topic: '', description: '' })

  useEffect(() => { dispatch(fetchMyDoubts()) }, [dispatch])

  const handleCreate = async (e) => {
    e.preventDefault()
    const res = await dispatch(createDoubt(form))
    if (!res.error) { toast.success('Doubt submitted!'); setModal(false); setForm({ title: '', subject: '', topic: '', description: '' }) }
    else toast.error(res.payload || 'Error')
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    const res = await dispatch(replyToDoubt({ id: selected._id, message: reply }))
    if (!res.error) { setReply(''); toast.success('Reply sent!'); setSelected(res.payload.doubt) }
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="section-title">Doubt Support</h1>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Ask Doubt</button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Doubts list */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? <div className="card p-10 text-center"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
            : doubts.length === 0 ? (
            <div className="card p-12 text-center"><HelpCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body text-sm">No doubts asked yet</p><p className="text-slate-600 text-xs font-body mt-1">Click "Ask Doubt" to get help</p></div>
          ) : doubts.map(d => (
            <motion.div key={d._id} onClick={() => setSelected(d)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`card p-4 cursor-pointer hover:border-primary-500/30 transition-all ${selected?._id === d._id ? 'border-primary-500/40 bg-primary-500/5' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-display font-bold text-white text-sm">{d.title}</p>
                <span className={`badge ${statusColors[d.status]} shrink-0 ml-2`}>{d.status}</span>
              </div>
              <p className="text-slate-400 text-xs font-body mb-2">{d.subject} {d.topic && `· ${d.topic}`}</p>
              <p className="text-slate-400 text-xs font-body line-clamp-2">{d.description}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 font-body">
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{d.replies?.length || 0}</span>
                <span>{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Thread view */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
              <div className="p-4 border-b border-dark-700/60">
                <div className="flex items-start justify-between">
                  <div><h4 className="font-display font-bold text-white">{selected.title}</h4>
                    <p className="text-xs text-slate-400 font-body mt-0.5">{selected.subject} {selected.topic && `· ${selected.topic}`}</p>
                  </div>
                  <span className={`badge ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>
                <div className="mt-3 p-3 bg-dark-900/60 rounded-xl">
                  <p className="text-slate-300 text-sm font-body">{selected.description}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {selected.replies?.length === 0 && (
                  <div className="text-center py-6"><MessageCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" /><p className="text-slate-500 text-sm font-body">No replies yet. Our team will respond soon!</p></div>
                )}
                {selected.replies?.map((r, i) => {
                  const isMe = r.user?._id === user?._id || r.user === user?._id
                  return (
                    <div key={i} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display shrink-0 bg-dark-700 text-white">{r.user?.name?.charAt(0) || '?'}</div>
                      <div className={`max-w-xs ${isMe ? 'ml-auto' : ''}`}>
                        <p className="text-xs text-slate-500 font-body mb-1 px-1">{r.user?.name} {r.user?.role && r.user.role !== 'student' && <span className="text-primary-400">(Teacher)</span>}</p>
                        <div className={`p-3 rounded-xl text-sm font-body ${isMe ? 'bg-primary-500/20 text-white' : 'bg-dark-800 text-slate-300'}`}>{r.message}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selected.status !== 'closed' && (
                <form onSubmit={handleReply} className="p-4 border-t border-dark-700/60 flex gap-2">
                  <input className="input flex-1 text-sm" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your message..." />
                  <button type="submit" className="btn-primary px-4 py-2.5"><Send className="w-4 h-4" /></button>
                </form>
              )}
            </div>
          ) : (
            <div className="card p-16 text-center">
              <MessageCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 font-body">Select a doubt to view conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Create doubt modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">Ask a Doubt</h3>
                <button onClick={() => setModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-5 space-y-4">
                <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Short description of your doubt" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Subject *</label>
                    <select className="input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required>
                      <option value="">Select subject</option>
                      {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Topic</label><input className="input" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. Kinematics" /></div>
                </div>
                <div><label className="label">Describe your doubt *</label><textarea className="input" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Explain your doubt in detail..." /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Submit Doubt</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
