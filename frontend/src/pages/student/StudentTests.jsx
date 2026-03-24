import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Clock, Play, CheckCircle, Lock, Calendar } from 'lucide-react'
import { fetchMyTests } from '../../store/slices/testSlice'

const typeBadge = { chapter: 'badge-blue', unit: 'badge-yellow', 'full-length': 'badge-orange', mock: 'badge-green', revision: 'badge-blue' }

export default function StudentTests() {
  const dispatch = useDispatch()
  const { myTests: tests, loading } = useSelector(s => s.tests)

  useEffect(() => { dispatch(fetchMyTests()) }, [dispatch])

  const upcoming = tests.filter(t => !t.myResult && t.isPublished)
  const attempted = tests.filter(t => t.myResult)

  return (
    <div className="space-y-6">
      <h1 className="section-title">Tests & Exams</h1>

      {/* Available Tests */}
      <div>
        <h3 className="font-display font-semibold text-white mb-3">Available Tests ({upcoming.length})</h3>
        {loading ? (
          <div className="card p-16 text-center"><div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        ) : upcoming.length === 0 ? (
          <div className="card p-12 text-center"><FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-400 font-body">No tests available right now</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((t, i) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card p-5 hover:border-primary-500/30 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${typeBadge[t.type] || 'badge-blue'}`}>{t.type}</span>
                  {t.subject && <span className="badge badge-yellow">{t.subject}</span>}
                </div>
                <h4 className="font-display font-bold text-white mb-1">{t.title}</h4>
                {t.description && <p className="text-slate-400 text-xs font-body mb-3 line-clamp-2">{t.description}</p>}
                <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                  <div className="bg-dark-900/60 rounded-lg p-2 text-center"><p className="text-xs text-slate-500 font-body">Questions</p><p className="font-bold text-white text-sm font-display">{t.questions?.length || 0}</p></div>
                  <div className="bg-dark-900/60 rounded-lg p-2 text-center"><p className="text-xs text-slate-500 font-body">Marks</p><p className="font-bold text-white text-sm font-display">{t.totalMarks}</p></div>
                  <div className="bg-dark-900/60 rounded-lg p-2 text-center"><p className="text-xs text-slate-500 font-body">Time</p><p className="font-bold text-white text-sm font-display">{t.duration}m</p></div>
                </div>
                {t.scheduledDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-body mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(t.scheduledDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
                <Link to={`/student/tests/${t._id}/attempt`}
                  className="btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Start Test
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Attempted Tests */}
      {attempted.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-white mb-3">Attempted Tests ({attempted.length})</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attempted.map((t, i) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5 opacity-80">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${typeBadge[t.type] || 'badge-blue'}`}>{t.type}</span>
                  <span className="badge badge-green flex items-center gap-1"><CheckCircle className="w-3 h-3" />Attempted</span>
                </div>
                <h4 className="font-display font-bold text-white mb-3">{t.title}</h4>
                <div className="bg-dark-900/60 rounded-xl p-3 text-center mb-3">
                  <p className={`text-3xl font-bold font-display ${t.myResult?.percentage >= 70 ? 'text-emerald-400' : t.myResult?.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{t.myResult?.percentage}%</p>
                  <p className="text-xs text-slate-400 font-body mt-1">{t.myResult?.obtainedMarks}/{t.myResult?.totalMarks} marks · Rank #{t.myResult?.rank}</p>
                </div>
                <Link to={`/student/results`} className="btn-secondary text-sm py-2 text-center block">View Result</Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
