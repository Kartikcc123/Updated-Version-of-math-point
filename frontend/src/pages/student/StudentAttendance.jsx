import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ClipboardList, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { fetchMyAttendance } from '../../store/slices/attendanceSlice'

export default function StudentAttendance() {
  const dispatch = useDispatch()
  const { myRecords: records, myStats: stats } = useSelector(s => s.attendance)

  useEffect(() => { dispatch(fetchMyAttendance()) }, [dispatch])

  const statusIcon = { present: CheckCircle, absent: XCircle, late: Clock, leave: Clock }
  const statusColor = { present: 'text-emerald-400', absent: 'text-red-400', late: 'text-amber-400', leave: 'text-blue-400' }
  const statusBg = { present: 'bg-emerald-500/10 border-emerald-500/20', absent: 'bg-red-500/10 border-red-500/20', late: 'bg-amber-500/10 border-amber-500/20', leave: 'bg-blue-500/10 border-blue-500/20' }

  const percentage = stats?.percentage || 0
  const circumference = 2 * Math.PI * 40
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <div className="space-y-5">
      <h1 className="section-title">Attendance</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && [
          { label: 'Percentage', value: `${stats.percentage}%`, color: stats.percentage >= 75 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Total Classes', value: stats.total, color: 'text-white' },
          { label: 'Present', value: stats.present, color: 'text-emerald-400' },
          { label: 'Absent', value: stats.absent, color: 'text-red-400' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4 text-center">
            <p className={`text-3xl font-bold font-display ${c.color}`}>{c.value}</p>
            <p className="text-xs text-slate-400 font-body mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Ring */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={percentage >= 75 ? '#10b981' : '#ef4444'} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className={`text-lg font-bold font-display ${percentage >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{percentage}%</p>
          </div>
        </div>
        <div>
          <h3 className="font-display font-bold text-white text-xl mb-1">Attendance: {percentage >= 75 ? 'Good' : 'Low'}</h3>
          <p className={`font-body text-sm ${percentage >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
            {percentage >= 75 ? '✓ You are meeting the minimum 75% attendance requirement.'
              : `⚠ Your attendance is below 75%. You need ${Math.ceil(((0.75 * (stats?.total || 0)) - (stats?.present || 0)) / 0.25)} more classes to meet the minimum.`}
          </p>
        </div>
      </motion.div>

      {/* Records */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-700/60 flex items-center justify-between">
          <h3 className="font-display font-bold text-white">Attendance Log</h3>
          <span className="text-xs text-slate-400 font-body">{records.length} records</span>
        </div>
        <div className="divide-y divide-dark-700/40 max-h-[500px] overflow-y-auto">
          {records.length === 0 ? (
            <div className="p-16 text-center"><ClipboardList className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body">No attendance records yet</p></div>
          ) : records.map((r, i) => {
            const Icon = statusIcon[r.status] || CheckCircle
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="flex items-center justify-between px-5 py-3 hover:bg-dark-800/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${statusBg[r.status]}`}>
                    <Icon className={`w-4 h-4 ${statusColor[r.status]}`} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    {r.subject && <p className="text-slate-400 text-xs font-body">{r.subject}</p>}
                  </div>
                </div>
                <span className={`text-sm font-semibold font-display capitalize ${statusColor[r.status]}`}>{r.status}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
