import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, DollarSign, X, CreditCard, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { fetchFees, createFee, collectPayment, fetchFeeStats } from '../../store/slices/feeSlice'
import { fetchStudents } from '../../store/slices/studentSlice'
import { fetchBatches, fetchCourses } from '../../store/slices/courseSlice'
import toast from 'react-hot-toast'

const statusBadge = { paid: 'badge-green', partial: 'badge-yellow', pending: 'badge-orange', overdue: 'badge-red' }

export default function FeesPage() {
  const dispatch = useDispatch()
  const { list: fees, stats, loading } = useSelector(s => s.fees)
  const { list: students } = useSelector(s => s.students)
  const { batches, courses } = useSelector(s => s.courses)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [feeForm, setFeeForm] = useState({ student: '', batch: '', course: '', totalAmount: '', discount: '', feeType: 'monthly', month: '', year: new Date().getFullYear(), dueDate: '' })
  const [payForm, setPayForm] = useState({ amount: '', method: 'cash', transactionId: '', notes: '' })
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    dispatch(fetchFees({ status: statusFilter }))
    dispatch(fetchFeeStats())
    dispatch(fetchStudents({ limit: 200 }))
    dispatch(fetchBatches())
    dispatch(fetchCourses())
  }, [dispatch, statusFilter])

  const handleCreateFee = async (e) => {
    e.preventDefault()
    const res = await dispatch(createFee(feeForm))
    if (!res.error) { toast.success('Fee record created!'); setModal(null) }
    else toast.error(res.payload || 'Error')
  }

  const handleCollect = async (e) => {
    e.preventDefault()
    const res = await dispatch(collectPayment({ id: selected._id, payload: { ...payForm, amount: +payForm.amount } }))
    if (!res.error) { toast.success('Payment recorded!'); setModal(null); dispatch(fetchFeeStats()) }
    else toast.error(res.payload || 'Error')
  }

  const statCards = stats ? [
    { label: 'Total Collected', value: `₹${(stats.totalCollected / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'from-emerald-500 to-green-600' },
    { label: 'Total Pending', value: `₹${(stats.totalPending / 1000).toFixed(0)}K`, icon: AlertCircle, color: 'from-amber-500 to-orange-600' },
    { label: 'Overdue Students', value: stats.overdueCount, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
    { label: 'This Month', value: `₹${(stats.monthlyCollected / 1000).toFixed(0)}K`, icon: CheckCircle, color: 'from-blue-500 to-blue-600' },
  ] : []

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="section-title">Fees Management</h1><p className="text-slate-400 text-sm font-body">{fees.length} fee records</p></div>
        <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Fee Record</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center shrink-0`}><c.icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-xl font-bold font-display text-white">{c.value}</p><p className="text-xs text-slate-400 font-body">{c.label}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="card p-4 flex gap-2 flex-wrap">
        {['', 'paid', 'partial', 'pending', 'overdue'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-body font-medium transition-all ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Course/Batch</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Type</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></td></tr>
                : fees.map(f => (
                <tr key={f._id} className="table-row">
                  <td><div><p className="font-medium text-white text-sm">{f.student?.name}</p><p className="text-xs text-slate-400">{f.student?.studentId}</p></div></td>
                  <td className="text-xs text-slate-300">{f.course?.name || f.batch?.name || '—'}</td>
                  <td className="text-white font-mono text-sm">₹{f.totalAmount?.toLocaleString()}</td>
                  <td className="text-emerald-400 font-mono text-sm">₹{f.paidAmount?.toLocaleString()}</td>
                  <td className="text-red-400 font-mono text-sm">₹{(f.dueAmount || 0).toLocaleString()}</td>
                  <td><span className={`badge ${statusBadge[f.status]}`}>{f.status}</span></td>
                  <td className="text-slate-400 text-xs capitalize">{f.feeType}</td>
                  <td>
                    <button onClick={() => { setSelected(f); setPayForm({ amount: '', method: 'cash', transactionId: '', notes: '' }); setModal('pay') }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-body transition-all">
                      <CreditCard className="w-3 h-3" /> Collect
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !fees.length && <tr><td colSpan={8} className="text-center text-slate-500 py-10 font-body">No fee records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <AnimatePresence>
        {modal === 'add' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">Add Fee Record</h3>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <form onSubmit={handleCreateFee} className="p-5 space-y-4">
                <div>
                  <label className="label">Student *</label>
                  <select className="input" value={feeForm.student} onChange={e => setFeeForm(p => ({ ...p, student: e.target.value }))} required>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Course</label>
                    <select className="input" value={feeForm.course} onChange={e => setFeeForm(p => ({ ...p, course: e.target.value }))}>
                      <option value="">Select course</option>
                      {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Batch</label>
                    <select className="input" value={feeForm.batch} onChange={e => setFeeForm(p => ({ ...p, batch: e.target.value }))}>
                      <option value="">Select batch</option>
                      {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Total Amount (₹) *</label><input type="number" className="input" value={feeForm.totalAmount} onChange={e => setFeeForm(p => ({ ...p, totalAmount: e.target.value }))} required /></div>
                  <div><label className="label">Discount (₹)</label><input type="number" className="input" value={feeForm.discount} onChange={e => setFeeForm(p => ({ ...p, discount: e.target.value }))} /></div>
                  <div><label className="label">Fee Type</label>
                    <select className="input" value={feeForm.feeType} onChange={e => setFeeForm(p => ({ ...p, feeType: e.target.value }))}>
                      {['monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Due Date</label><input type="date" className="input" value={feeForm.dueDate} onChange={e => setFeeForm(p => ({ ...p, dueDate: e.target.value }))} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><DollarSign className="w-4 h-4" /> Create Fee</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {modal === 'pay' && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-dark-700">
                <h3 className="font-display font-bold text-white text-lg">Collect Payment</h3>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
              </div>
              <div className="px-5 pt-4 pb-2 bg-dark-900/40 mx-5 mt-5 rounded-xl">
                <p className="text-sm font-body text-slate-400">Student: <span className="text-white font-medium">{selected.student?.name}</span></p>
                <p className="text-sm font-body text-slate-400">Due Amount: <span className="text-red-400 font-bold font-mono">₹{(selected.dueAmount || 0).toLocaleString()}</span></p>
              </div>
              <form onSubmit={handleCollect} className="p-5 space-y-4">
                <div><label className="label">Amount (₹) *</label><input type="number" className="input" value={payForm.amount} onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} required max={selected.dueAmount} /></div>
                <div><label className="label">Payment Method *</label>
                  <select className="input" value={payForm.method} onChange={e => setPayForm(p => ({ ...p, method: e.target.value }))}>
                    {['cash', 'online', 'cheque', 'upi', 'card'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
                <div><label className="label">Transaction ID</label><input className="input" value={payForm.transactionId} onChange={e => setPayForm(p => ({ ...p, transactionId: e.target.value }))} placeholder="For online/UPI payments" /></div>
                <div><label className="label">Notes</label><input className="input" value={payForm.notes} onChange={e => setPayForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" /> Record Payment</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
