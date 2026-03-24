import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'
import { startTest, submitTest } from '../../store/slices/testSlice'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function TestAttempt() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { activeTest: test, activeResult: result } = useSelector(s => s.tests)

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const answersRef = useRef({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const submittedRef = useRef(false)
  const [submittedResult, setSubmittedResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const res = await dispatch(startTest(id))
      if (res.error) { toast.error('Failed to start test'); navigate('/student/tests'); return }
      setTimeLeft((res.payload.test?.duration || 180) * 60)
      setLoading(false)
    }
    init()
  }, [id, dispatch, navigate])

  // Keep answersRef in sync for timer closure
  useEffect(() => { answersRef.current = answers }, [answers])

  useEffect(() => {
    if (!timeLeft || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          if (!submittedRef.current) {
            submittedRef.current = true
            const answerArr = Object.entries(answersRef.current).map(([questionId, answer]) => ({ questionId, answer }))
            dispatch(submitTest({ id, answers: answerArr })).then(res => {
              if (!res.error) { setSubmittedResult(res.payload.result); setSubmitted(true); toast.success('Time up! Test submitted.') }
            })
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted, id, dispatch])

  const handleSubmit = useCallback(async (auto = false) => {
    if (!auto && !confirmSubmit) { setConfirmSubmit(true); return }
    if (submittedRef.current) return
    submittedRef.current = true
    setSubmitted(true)
    const answerArr = Object.entries(answersRef.current).map(([questionId, answer]) => ({ questionId, answer }))
    const res = await dispatch(submitTest({ id, answers: answerArr }))
    if (!res.error) { setSubmittedResult(res.payload.result); toast.success('Test submitted!') }
    else { submittedRef.current = false; setSubmitted(false); toast.error('Submission failed') }
  }, [confirmSubmit, id, dispatch])

  const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
  if (!test) return <div className="text-center text-slate-400 py-20 font-body">Test not found</div>

  const q = test.questions?.[currentQ]
  const totalQ = test.questions?.length || 0
  const attempted = Object.keys(answers).length

  // Result screen
  if (submitted && submittedResult) {
    const r = submittedResult
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-5">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 mx-auto orange-gradient rounded-full flex items-center justify-center text-4xl mb-4 shadow-glow">🎉</div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Test Submitted!</h2>
          <p className="text-slate-400 font-body mb-6">{test.title}</p>
          <div className={`text-6xl font-bold font-display mb-2 ${r.percentage >= 70 ? 'text-emerald-400' : r.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{r.percentage}%</div>
          <p className="text-slate-400 font-body mb-6">{r.obtainedMarks}/{r.totalMarks} marks</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-900/60 rounded-xl p-3"><p className="text-xs text-slate-500">Rank</p><p className="text-2xl font-bold text-white font-display">#{r.rank}</p></div>
            <div className="bg-dark-900/60 rounded-xl p-3"><p className="text-xs text-slate-500">Time</p><p className="text-xl font-bold text-white font-display">{r.timeTaken}m</p></div>
            <div className="bg-dark-900/60 rounded-xl p-3"><p className="text-xs text-slate-500">Attempted</p><p className="text-2xl font-bold text-white font-display">{attempted}/{totalQ}</p></div>
          </div>
          {r.subjectWise?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-display font-bold text-white mb-3">Subject-wise Breakdown</h4>
              <div className="space-y-2">
                {r.subjectWise.map(sw => (
                  <div key={sw.subject} className="flex items-center gap-3 bg-dark-900/60 rounded-xl p-3">
                    <span className="text-slate-300 font-body text-sm w-28 shrink-0">{sw.subject}</span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${sw.totalQ ? (sw.correct / sw.totalQ) * 100 : 0}%` }} />
                    </div>
                    <span className="text-white font-mono text-sm font-bold w-20 text-right">{sw.correct}/{sw.totalQ} · {sw.marks}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => navigate('/student/tests')} className="btn-secondary flex-1">Back to Tests</button>
            <button onClick={() => navigate('/student/results')} className="btn-primary flex-1">View All Results</button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div><h2 className="font-display font-bold text-white">{test.title}</h2><p className="text-xs text-slate-400 font-body">{attempted}/{totalQ} attempted</p></div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-dark-800 text-white'}`}>
          <Clock className="w-5 h-5" />{formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Question panel */}
        <div className="lg:col-span-3 space-y-4">
          {q && (
            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-orange font-display">Q{currentQ + 1}/{totalQ}</span>
                {q.subject && <span className="badge badge-yellow">{q.subject}</span>}
                <span className={`badge ${q.difficulty === 'easy' ? 'badge-green' : q.difficulty === 'medium' ? 'badge-yellow' : 'badge-red'}`}>{q.difficulty}</span>
                <span className="ml-auto text-xs text-slate-400 font-body">+{q.marks} / -{q.negativeMarks}</span>
              </div>
              <p className="text-white font-body text-base leading-relaxed mb-6">{q.question}</p>

              {q.type === 'mcq' && (
                <div className="space-y-3">
                  {q.options?.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(p => {
                  const n = { ...p, [q._id]: String(oi) }
                  answersRef.current = n
                  return n
                })}
                      className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all font-body text-sm ${answers[q._id] === String(oi) ? 'border-primary-500 bg-primary-500/15 text-white' : 'border-dark-700 hover:border-dark-500 text-slate-300 hover:bg-dark-800/50'}`}>
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-display text-sm shrink-0 transition-all ${answers[q._id] === String(oi) ? 'border-primary-500 bg-primary-500 text-white' : 'border-dark-600 text-slate-500'}`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'numerical' && (
                <div>
                  <label className="label">Enter Numerical Answer</label>
                  <input type="number" className="input max-w-xs font-mono" value={answers[q._id] || ''}
                    onChange={e => setAnswers(p => {
                      const n = { ...p, [q._id]: e.target.value }
                      answersRef.current = n
                      return n
                    })}
                    placeholder="Type your answer..." step="any" />
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /> Previous</button>
                <button onClick={() => { setAnswers(p => { const n = { ...p }; delete n[q._id]; answersRef.current = n; return n }) }}
                  className="text-xs text-slate-400 hover:text-white font-body">Clear Answer</button>
                {currentQ < totalQ - 1
                  ? <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>
                  : <button onClick={() => handleSubmit()} className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Submit Test</button>
                }
              </div>
            </motion.div>
          )}

          {test.instructions?.length > 0 && (
            <div className="card p-4">
              <h4 className="font-display font-semibold text-white mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary-400" /> Instructions</h4>
              <ul className="space-y-1">{test.instructions.map((ins, i) => <li key={i} className="text-slate-400 text-xs font-body flex items-start gap-2"><span className="text-primary-400 shrink-0">•</span>{ins}</li>)}</ul>
            </div>
          )}
        </div>

        {/* Question navigator */}
        <div className="card p-4">
          <h4 className="font-display font-semibold text-white text-sm mb-3">Questions</h4>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {test.questions?.map((qq, i) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold font-display transition-all ${i === currentQ ? 'bg-primary-500 text-white shadow-glow-sm' : answers[qq._id] !== undefined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-dark-800 text-slate-400 hover:bg-dark-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="space-y-1.5 text-xs font-body mb-4">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-emerald-500/20 border border-emerald-500/30 rounded" /><span className="text-slate-400">Answered ({attempted})</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-dark-800 rounded" /><span className="text-slate-400">Not answered ({totalQ - attempted})</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-primary-500 rounded" /><span className="text-slate-400">Current</span></div>
          </div>
          <button onClick={() => handleSubmit()} className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Submit Test
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card p-6 max-w-sm w-full text-center">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-white text-xl mb-2">Submit Test?</h3>
              <p className="text-slate-400 font-body text-sm mb-2">You have answered <strong className="text-white">{attempted}/{totalQ}</strong> questions.</p>
              <p className="text-slate-400 font-body text-sm mb-6">{totalQ - attempted > 0 && <span className="text-amber-400">{totalQ - attempted} unanswered questions.</span>} This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmSubmit(false)} className="btn-secondary flex-1">Review</button>
                <button onClick={() => handleSubmit(true)} className="btn-primary flex-1">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
