// StudentResults.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Award } from 'lucide-react'
import { fetchMyTests } from '../../store/slices/testSlice'

export function StudentResults() {
  const dispatch = useDispatch()
  const { myTests: tests } = useSelector(s => s.tests)
  useEffect(() => { dispatch(fetchMyTests()) }, [dispatch])

  const attempted = tests.filter(t => t.myResult)
  const avgScore = attempted.length ? Math.round(attempted.reduce((s, t) => s + (t.myResult?.percentage || 0), 0) / attempted.length) : 0
  const best = attempted.length ? Math.max(...attempted.map(t => t.myResult?.percentage || 0)) : 0

  return (
    <div className="space-y-5">
      <h1 className="section-title">Results & Performance</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tests Attempted', value: attempted.length, color: 'from-blue-500 to-blue-700' },
          { label: 'Average Score', value: `${avgScore}%`, color: avgScore >= 70 ? 'from-emerald-500 to-emerald-700' : 'from-amber-500 to-orange-700' },
          { label: 'Best Score', value: `${best}%`, color: 'from-primary-500 to-red-600' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4 text-center">
            <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center mx-auto mb-2`}><TrendingUp className="w-5 h-5 text-white" /></div>
            <p className="text-2xl font-bold font-display text-white">{c.value}</p>
            <p className="text-xs text-slate-400 font-body">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        {attempted.length === 0 ? (
          <div className="card p-16 text-center"><BarChart3 className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-400 font-body">No test results yet. Attempt a test to see your performance.</p></div>
        ) : attempted.map((t, i) => {
          const r = t.myResult
          const pct = r?.percentage || 0
          return (
            <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div><h4 className="font-display font-bold text-white">{t.title}</h4><p className="text-slate-400 text-sm font-body">{t.subject} · {t.type}</p></div>
                <div className="text-right">
                  <p className={`text-3xl font-bold font-display ${pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
                  <p className="text-xs text-slate-400 font-body">{r.obtainedMarks}/{r.totalMarks} marks</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[['Rank', `#${r.rank || '—'}`, 'text-primary-400'], ['Time Taken', `${r.timeTaken}m`, 'text-white'], ['Status', r.status, 'text-emerald-400'], ['Date', new Date(r.submittedAt).toLocaleDateString('en-IN'), 'text-white']].map(([k, v, c]) => (
                  <div key={k} className="bg-dark-900/60 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-slate-500 font-body">{k}</p>
                    <p className={`text-sm font-bold font-display ${c} capitalize`}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
              </div>
              {r.subjectWise?.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-3 gap-2">
                  {r.subjectWise.map(sw => (
                    <div key={sw.subject} className="bg-dark-900/60 rounded-xl p-2.5 text-xs font-body">
                      <p className="text-slate-400 mb-1">{sw.subject}</p>
                      <p className="text-white font-semibold">{sw.correct}/{sw.totalQ} correct · {sw.marks}m</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default StudentResults
