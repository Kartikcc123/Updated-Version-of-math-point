// StudentBatches.jsx
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Clock, Users, MapPin } from 'lucide-react'

export function StudentBatches() {
  const { user } = useSelector(s => s.auth)
  const batches = user?.enrolledBatches || []
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

  return (
    <div className="space-y-5">
      <h1 className="section-title">My Batches</h1>
      {batches.length === 0 ? (
        <div className="card p-20 text-center"><BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" /><p className="text-slate-400 font-body">You are not enrolled in any batch yet. Contact admin.</p></div>
      ) : batches.map((b, i) => (
        <motion.div key={b._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div><h3 className="font-display text-xl font-bold text-white">{b.name || 'Batch'}</h3>
              {b.course && <p className="text-primary-400 text-sm font-body">{b.course?.name}</p>}
            </div>
            <span className="badge badge-green">Active</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {b.teacher && <div className="bg-dark-900/60 rounded-xl p-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary-400" /><div><p className="text-xs text-slate-500 font-body">Teacher</p><p className="text-sm text-white font-medium">{b.teacher?.name}</p></div></div>}
            {b.room && <div className="bg-dark-900/60 rounded-xl p-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /><div><p className="text-xs text-slate-500 font-body">Room</p><p className="text-sm text-white font-medium">{b.room}</p></div></div>}
            {b.maxStudents && <div className="bg-dark-900/60 rounded-xl p-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /><div><p className="text-xs text-slate-500 font-body">Strength</p><p className="text-sm text-white font-medium">{b.students?.length}/{b.maxStudents}</p></div></div>}
          </div>
          {b.schedule?.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 font-body mb-2 font-semibold uppercase tracking-wider">Weekly Schedule</p>
              <div className="space-y-2">
                {b.schedule.map((sc, j) => (
                  <div key={j} className="flex items-center gap-3 p-2.5 bg-dark-900/60 rounded-xl">
                    <span className="w-24 text-xs font-bold text-primary-400 font-display">{sc.day}</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 text-sm font-body">{sc.startTime} – {sc.endTime}</span>
                    {sc.subject && <span className="ml-auto badge badge-yellow">{sc.subject}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(b.startDate || b.endDate) && (
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-body">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Start: {b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—'}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />End: {b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN') : '—'}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
export default StudentBatches
