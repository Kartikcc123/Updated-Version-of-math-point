// NotificationsAdminPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, X, Send, Trash2 } from 'lucide-react'
import { fetchNotifications, createNotification } from '../../store/slices/notificationSlice'
import toast from 'react-hot-toast'

export default function NotificationsAdminPage() {
  const dispatch = useDispatch()
  const { list: notifications } = useSelector(s => s.notifications)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'announcement', priority: 'medium', recipients: { all: true, roles: [] }, channels: { inApp: true, email: false, sms: false, whatsapp: false } })

  useEffect(() => { dispatch(fetchNotifications()) }, [dispatch])

  const handleSend = async (e) => {
    e.preventDefault()
    const res = await dispatch(createNotification(form))
    if (!res.error) { toast.success('Notification sent!'); setModal(false) }
    else toast.error(res.payload || 'Error')
  }

  const handleDelete = async (id) => {
    await dispatch(deleteNotification(id)); toast.success('Deleted')
  }

  const typeBadge = { announcement: 'badge-blue', fee: 'badge-orange', exam: 'badge-yellow', result: 'badge-green', general: 'badge-blue', alert: 'badge-red' }
  const priBadge = { low: 'badge-blue', medium: 'badge-yellow', high: 'badge-orange', urgent: 'badge-red' }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Notifications</h1><p className="text-slate-400 text-sm font-body">{notifications.length} sent</p></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Send Notification</button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <motion.div key={n._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-500/15 border border-primary-500/20 rounded-xl flex items-center justify-center shrink-0"><Bell className="w-5 h-5 text-primary-400" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-bold text-white">{n.title}</h4>
                <span className={`badge ${typeBadge[n.type] || 'badge-blue'}`}>{n.type}</span>
                <span className={`badge ${priBadge[n.priority] || 'badge-yellow'}`}>{n.priority}</span>
              </div>
              <p className="text-slate-400 text-sm font-body">{n.message}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-body">
                <span>By: {n.sentBy?.name}</span>
                <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                {n.channels?.email && <span className="badge badge-blue">Email</span>}
                {n.channels?.sms && <span className="badge badge-green">SMS</span>}
                {n.channels?.whatsapp && <span className="badge badge-green">WhatsApp</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(n._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
          </motion.div>
        ))}
        {!notifications.length && <div className="card p-16 text-center"><Bell className="w-10 h-10 mx-auto mb-3 text-slate-700" /><p className="text-slate-500 font-body">No notifications sent yet</p></div>}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700"><h3 className="font-display font-bold text-white text-lg">Send Notification</h3><button onClick={() => setModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button></div>
              <form onSubmit={handleSend} className="p-5 space-y-4">
                <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Notification title" /></div>
                <div><label className="label">Message *</label><textarea className="input" rows={3} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required placeholder="Enter notification message..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Type</label>
                    <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {['announcement', 'fee', 'attendance', 'exam', 'result', 'general', 'alert'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Priority</label>
                    <select className="input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                      {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Send to</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.recipients.all} onChange={e => setForm(p => ({ ...p, recipients: { ...p.recipients, all: e.target.checked } }))} className="w-4 h-4 accent-orange-500" />
                      <span className="text-slate-300 font-body text-sm">All users</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label">Channels</label>
                  <div className="flex flex-wrap gap-4">
                    {[['inApp', 'In-App'], ['email', 'Email'], ['sms', 'SMS'], ['whatsapp', 'WhatsApp']].map(([k, l]) => (
                      <label key={k} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.channels[k]} onChange={e => setForm(p => ({ ...p, channels: { ...p.channels, [k]: e.target.checked } }))} className="w-4 h-4 accent-orange-500" />
                        <span className="text-slate-300 font-body text-sm">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Now</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
