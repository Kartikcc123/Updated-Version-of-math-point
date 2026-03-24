// StudentNotifications.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'
import { fetchMyNotifications, markNotificationRead } from '../../store/slices/notificationSlice'

const typeColors = { announcement: 'badge-blue', fee: 'badge-orange', exam: 'badge-yellow', result: 'badge-green', general: 'badge-blue', alert: 'badge-red' }

export function StudentNotifications() {
  const dispatch = useDispatch()
  const { list: notifications } = useSelector(s => s.notifications)
  const { user } = useSelector(s => s.auth)

  useEffect(() => { dispatch(fetchMyNotifications()) }, [dispatch])

  const handleRead = (id) => dispatch(markNotificationRead(id))

  return (
    <div className="space-y-5">
      <h1 className="section-title">Notifications</h1>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card p-16 text-center"><Bell className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body">No notifications yet</p></div>
        ) : notifications.map((n, i) => {
          const isRead = n.readBy?.includes(user?._id)
          return (
            <motion.div key={n._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => !isRead && handleRead(n._id)}
              className={`card p-5 flex gap-4 cursor-pointer hover:border-primary-500/20 transition-all ${!isRead ? 'border-primary-500/20 bg-primary-500/3' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!isRead ? 'bg-primary-500/20 border border-primary-500/30' : 'bg-dark-800'}`}>
                <Bell className={`w-5 h-5 ${!isRead ? 'text-primary-400' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className={`font-display font-bold text-sm ${!isRead ? 'text-white' : 'text-slate-300'}`}>{n.title}</h4>
                  <span className={`badge ${typeColors[n.type] || 'badge-blue'}`}>{n.type}</span>
                  {!isRead && <span className="w-2 h-2 bg-primary-500 rounded-full ml-auto shrink-0" />}
                </div>
                <p className="text-slate-400 text-sm font-body">{n.message}</p>
                <p className="text-slate-500 text-xs font-body mt-2">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default StudentNotifications
