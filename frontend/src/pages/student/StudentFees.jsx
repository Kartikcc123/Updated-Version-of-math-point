import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { DollarSign, CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react'
import { fetchMyFees } from '../../store/slices/feeSlice'

const statusBadge = { paid: 'badge-green', partial: 'badge-yellow', pending: 'badge-orange', overdue: 'badge-red' }
const statusIcon = { paid: CheckCircle, partial: Clock, pending: Clock, overdue: AlertCircle }

export default function StudentFees() {
  const dispatch = useDispatch()
  const { list: fees, loading } = useSelector(s => s.fees)

  useEffect(() => { dispatch(fetchMyFees()) }, [dispatch])

  const totalDue = fees.reduce((s, f) => s + (f.dueAmount || 0), 0)
  const totalPaid = fees.reduce((s, f) => s + (f.paidAmount || 0), 0)

  return (
    <div className="space-y-5">
      <h1 className="section-title">Fees & Payment</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'from-emerald-500 to-green-700', icon: CheckCircle },
          { label: 'Total Due', value: `₹${totalDue.toLocaleString()}`, color: 'from-red-500 to-rose-700', icon: AlertCircle },
          { label: 'Records', value: fees.length, color: 'from-blue-500 to-blue-700', icon: DollarSign },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center shrink-0`}><c.icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-xl font-bold font-display text-white">{c.value}</p><p className="text-xs text-slate-400 font-body">{c.label}</p></div>
          </motion.div>
        ))}
      </div>

      {totalDue > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-display font-bold text-white">Payment Due: ₹{totalDue.toLocaleString()}</p>
            <p className="text-slate-400 text-xs font-body">Please pay your pending fees to avoid late charges. Contact admin for payment.</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="card p-16 text-center"><div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        ) : fees.length === 0 ? (
          <div className="card p-16 text-center"><DollarSign className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 font-body">No fee records found</p></div>
        ) : fees.map(f => {
          const Icon = statusIcon[f.status] || Clock
          return (
            <motion.div key={f._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-display font-bold text-white">{f.course?.name || f.batch?.name || 'Fee Record'}</h4>
                  <p className="text-slate-400 text-sm font-body capitalize">{f.feeType} · {f.month && `${f.month} ${f.year}`}</p>
                </div>
                <span className={`badge ${statusBadge[f.status]}`}>{f.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-dark-900/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-body mb-0.5">Total Amount</p>
                  <p className="font-bold text-white font-mono">₹{f.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-body mb-0.5">Paid</p>
                  <p className="font-bold text-emerald-400 font-mono">₹{f.paidAmount?.toLocaleString()}</p>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-body mb-0.5">Remaining</p>
                  <p className={`font-bold font-mono ${f.dueAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>₹{(f.dueAmount || 0).toLocaleString()}</p>
                </div>
              </div>
              {f.discount > 0 && <p className="text-emerald-400 text-xs font-body mb-3">🎉 Discount applied: ₹{f.discount} ({f.discountReason})</p>}
              {f.dueDate && <p className="text-slate-400 text-xs font-body mb-3">Due date: {new Date(f.dueDate).toLocaleDateString('en-IN')}</p>}

              {/* Payment history */}
              {f.payments?.length > 0 && (
                <div className="border-t border-dark-700/60 pt-3">
                  <p className="text-xs text-slate-400 font-body mb-2 font-semibold">Payment History</p>
                  <div className="space-y-1.5">
                    {f.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-body">
                        <span className="text-slate-300 flex items-center gap-1.5"><CreditCard className="w-3 h-3 text-primary-400" />{new Date(p.date).toLocaleDateString('en-IN')} · {p.method?.toUpperCase()}</span>
                        <span className="text-emerald-400 font-mono font-semibold">+₹{p.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
