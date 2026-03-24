// AttendancePage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react'
import { fetchBatches } from '../../store/slices/courseSlice'
import { markAttendance, fetchBatchAttendance, fetchAttendanceReport } from '../../store/slices/attendanceSlice'
import toast from 'react-hot-toast'

export default function AttendancePage() {
  const dispatch = useDispatch()
  const { batches } = useSelector(s => s.courses)
  const { list: attendance, report } = useSelector(s => s.attendance)
  const [tab, setTab] = useState('mark')
  const [selBatch, setSelBatch] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [subject, setSubject] = useState('')

  useEffect(() => { dispatch(fetchBatches()) }, [dispatch])

  useEffect(() => {
    if (selBatch) {
      const batch = batches.find(b => b._id === selBatch)
      setRecords((batch?.students || []).map(s => ({ student: s._id || s, status: 'present', remark: '' })))
      dispatch(fetchBatchAttendance({ batch: selBatch }))
      dispatch(fetchAttendanceReport(selBatch))
    }
  }, [selBatch, batches, dispatch])

  const toggleStatus = (idx, status) => {
    setRecords(prev => prev.map((r, i) => i === idx ? { ...r, status } : r))
  }

  const handleMark = async () => {
    if (!selBatch || !date) return toast.error('Select batch and date')
    const res = await dispatch(markAttendance({ batch: selBatch, date, records, subject }))
    if (!res.error) toast.success('Attendance marked!')
    else toast.error(res.payload || 'Error')
  }

  const batch = batches.find(b => b._id === selBatch)
  const studentMap = {}
  if (batch?.students) batch.students.forEach(s => { studentMap[s._id || s] = s })

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Attendance Tracking</h1></div>
      </div>

      <div className="flex gap-2">
        {['mark', 'report'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-body font-medium transition-all capitalize ${tab === t ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{t === 'mark' ? 'Mark Attendance' : 'Attendance Report'}</button>
        ))}
      </div>

      <div className="card p-5 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48"><label className="label">Select Batch</label>
          <select className="input" value={selBatch} onChange={e => setSelBatch(e.target.value)}>
            <option value="">Choose batch</option>
            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-36"><label className="label">Date</label><input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="flex-1 min-w-36"><label className="label">Subject</label><input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics" /></div>
      </div>

      {tab === 'mark' && selBatch && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/60">
            <h3 className="font-display font-bold text-white">Mark Attendance — {batch?.name}</h3>
            <div className="flex items-center gap-3 text-xs font-body text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" />Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" />Absent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />Late</span>
            </div>
          </div>
          <div className="divide-y divide-dark-700/40">
            {records.map((r, i) => {
              const s = studentMap[r.student]
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-dark-800/30">
                  <div className="w-8 h-8 orange-gradient rounded-full flex items-center justify-center text-white text-xs font-bold font-display shrink-0">
                    {s?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{s?.name || r.student}</p>
                    <p className="text-xs text-slate-400">{s?.studentId}</p>
                  </div>
                  <div className="flex gap-2">
                    {[['present', CheckCircle, 'text-emerald-400', 'bg-emerald-500/20 border-emerald-500/40'],
                      ['absent', XCircle, 'text-red-400', 'bg-red-500/20 border-red-500/40'],
                      ['late', Clock, 'text-amber-400', 'bg-amber-500/20 border-amber-500/40']].map(([status, Icon, tc, ac]) => (
                      <button key={status} onClick={() => toggleStatus(i, status)}
                        className={`p-1.5 rounded-lg border transition-all ${r.status === status ? `${ac} border` : 'border-transparent hover:bg-dark-700'}`}>
                        <Icon className={`w-5 h-5 ${r.status === status ? tc : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
            {!records.length && <p className="text-center text-slate-500 py-10 font-body">No students in this batch</p>}
          </div>
          {records.length > 0 && (
            <div className="px-5 py-4 border-t border-dark-700/60">
              <button onClick={handleMark} className="btn-primary flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Save Attendance ({records.filter(r => r.status === 'present').length}/{records.length} present)
              </button>
            </div>
          )}
        </motion.div>
      )}

      {tab === 'report' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-700/60"><h3 className="font-display font-bold text-white">Attendance Report</h3></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Student</th><th>Total Classes</th><th>Present</th><th>Absent</th><th>Late</th><th>%</th></tr></thead>
              <tbody>
                {report.map(r => (
                  <tr key={r.student?._id} className="table-row">
                    <td><div><p className="font-medium text-white text-sm">{r.student?.name}</p><p className="text-xs text-slate-400">{r.student?.studentId}</p></div></td>
                    <td className="text-slate-300">{r.total}</td>
                    <td className="text-emerald-400">{r.present}</td>
                    <td className="text-red-400">{r.absent}</td>
                    <td className="text-amber-400">{r.late}</td>
                    <td><span className={`badge ${r.percentage >= 75 ? 'badge-green' : r.percentage >= 60 ? 'badge-yellow' : 'badge-red'}`}>{r.percentage}%</span></td>
                  </tr>
                ))}
                {!report.length && <tr><td colSpan={6} className="text-center text-slate-500 py-10 font-body">Select a batch to view report</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
