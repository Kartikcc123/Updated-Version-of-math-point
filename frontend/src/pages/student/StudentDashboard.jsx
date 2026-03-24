// StudentDashboard.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, DollarSign, FileText, TrendingUp, Bell, BookOpen } from 'lucide-react'
import { fetchStudentDashboard } from '../../store/slices/analyticsSlice'
import { fetchMyNotifications } from '../../store/slices/notificationSlice'

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const { studentStats: data } = useSelector(s => s.analytics)
  const { user } = useSelector(s => s.auth)
  const { list: notifications } = useSelector(s => s.notifications)

  useEffect(() => { dispatch(fetchStudentDashboard()); dispatch(fetchMyNotifications()) }, [dispatch])

  const s = data?.stats
  const statCards = s ? [
    { label: 'Attendance', value: `${s.attendancePercentage}%`, icon: ClipboardList, color: 'from-blue-500 to-blue-700', to: '/student/attendance', alert: s.attendancePercentage < 75 },
    { label: 'Fees Due', value: `₹${s.totalDueFees?.toLocaleString() || 0}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-700', to: '/student/fees', alert: s.totalDueFees > 0 },
    { label: 'Avg Score', value: `${s.avgTestScore}%`, icon: TrendingUp, color: 'from-primary-500 to-red-600', to: '/student/results', alert: false },
    { label: 'Batches', value: s.enrolledBatches, icon: BookOpen, color: 'from-purple-500 to-purple-700', to: '/student/batches', alert: false },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-slate-400 text-sm font-body mt-0.5 font-mono">{user?.studentId} · {user?.targetExam?.join(' & ')} Aspirant</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={c.to} className={`card p-5 flex flex-col gap-3 hover:border-primary-500/30 block ${c.alert ? 'border-red-500/30' : ''}`}>
              <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center`}><c.icon className="w-5 h-5 text-white" /></div>
              <div><p className="text-2xl font-bold font-display text-white">{c.value}</p><p className="text-xs text-slate-400 font-body">{c.label}</p></div>
              {c.alert && <p className="text-xs text-red-400 font-body">⚠ Action needed</p>}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/60">
            <h3 className="font-display font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-primary-400" /> Recent Notifications</h3>
            <Link to="/student/notifications" className="text-xs text-primary-400 hover:text-primary-300 font-body">View all →</Link>
          </div>
          <div className="divide-y divide-dark-700/40">
            {notifications.slice(0, 4).map(n => (
              <div key={n._id} className="px-5 py-3 hover:bg-dark-800/30">
                <p className="font-medium text-white text-sm">{n.title}</p>
                <p className="text-slate-400 text-xs font-body mt-0.5 line-clamp-1">{n.message}</p>
                <p className="text-slate-500 text-xs font-body mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))}
            {!notifications.length && <p className="text-center text-slate-500 py-8 text-sm font-body">No notifications</p>}
          </div>
        </motion.div>

        {/* Recent Results */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/60">
            <h3 className="font-display font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-primary-400" /> Recent Test Results</h3>
            <Link to="/student/results" className="text-xs text-primary-400 hover:text-primary-300 font-body">View all →</Link>
          </div>
          <div className="divide-y divide-dark-700/40">
            {data?.recentResults?.map(r => (
              <div key={r._id} className="px-5 py-3 flex items-center justify-between hover:bg-dark-800/30">
                <div><p className="font-medium text-white text-sm">{r.test?.title}</p><p className="text-slate-400 text-xs font-body">{r.test?.subject} · {r.test?.type}</p></div>
                <div className="text-right">
                  <p className={`text-lg font-bold font-display ${r.percentage >= 70 ? 'text-emerald-400' : r.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{r.percentage}%</p>
                  <p className="text-xs text-slate-400 font-body">Rank #{r.rank}</p>
                </div>
              </div>
            ))}
            {!data?.recentResults?.length && <p className="text-center text-slate-500 py-8 text-sm font-body">No test results yet</p>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
