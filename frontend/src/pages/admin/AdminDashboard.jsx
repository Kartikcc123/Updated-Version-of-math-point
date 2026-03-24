import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Users, GraduationCap, DollarSign, TrendingUp, BookOpen, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { fetchAdminDashboard } from '../../store/slices/analyticsSlice'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const fmt = (n) => n >= 10000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n?.toLocaleString() || 0}`

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { adminStats: data, loading } = useSelector(s => s.analytics)

  useEffect(() => { dispatch(fetchAdminDashboard()) }, [dispatch])

  const stats = data?.stats
  const cards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'from-blue-500 to-blue-600', sub: `${stats.jeeStudents} JEE · ${stats.neetStudents} NEET` },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: Users, color: 'from-purple-500 to-purple-600', sub: `${stats.totalBatches} active batches` },
    { label: 'Fee Collected', value: fmt(stats.totalCollected), icon: DollarSign, color: 'from-emerald-500 to-emerald-600', sub: `₹${(stats.totalPending/1000).toFixed(0)}K pending` },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: CheckCircle, color: 'from-amber-500 to-amber-600', sub: `${stats.totalBatches} batches` },
    { label: 'Avg Test Score', value: `${stats.avgTestScore}%`, icon: TrendingUp, color: 'from-primary-500 to-red-500', sub: 'Across all tests' },
    { label: 'Open Doubts', value: stats.openDoubts, icon: AlertCircle, color: 'from-red-500 to-rose-600', sub: 'Need resolution' },
  ] : []

  const barData = {
    labels: data?.monthlyFees?.map(m => `${m._id.month}/${m._id.year}`) || [],
    datasets: [{ label: 'Fee Collected (₹)', data: data?.monthlyFees?.map(m => m.collected) || [], backgroundColor: 'rgba(249,115,22,0.7)', borderRadius: 8 }],
  }
  const doughnutData = {
    labels: ['JEE Students', 'NEET Students'],
    datasets: [{ data: [stats?.jeeStudents || 0, stats?.neetStudents || 0], backgroundColor: ['#f97316', '#3b82f6'], borderWidth: 0 }],
  }
  const chartOpts = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans' } } } }, scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } } } }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-slate-400 text-sm font-body mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-body bg-dark-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold font-display text-white">{c.value}</p>
              <p className="text-xs font-semibold text-slate-300 font-body">{c.label}</p>
              <p className="text-xs text-slate-500 font-body truncate">{c.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card p-5 lg:col-span-2">
          <h3 className="font-display font-bold text-white mb-4">Monthly Fee Collection</h3>
          <Bar data={barData} options={chartOpts} height={100} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="card p-5">
          <h3 className="font-display font-bold text-white mb-4">Students by Exam</h3>
          <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'DM Sans' } } } } }} />
        </motion.div>
      </div>

      {/* Recent Students */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/60">
          <h3 className="font-display font-bold text-white">Recent Enrollments</h3>
          <a href="/admin/students" className="text-xs text-primary-400 hover:text-primary-300 font-body">View all →</a>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Student ID</th><th>Target Exam</th><th>Joined</th></tr></thead>
            <tbody>
              {(data?.recentStudents || []).map(s => (
                <tr key={s._id} className="table-row">
                  <td className="font-medium text-white">{s.name}</td>
                  <td><span className="badge badge-orange font-mono">{s.studentId}</span></td>
                  <td>{s.targetExam?.map(e => <span key={e} className={`badge ${e === 'JEE' ? 'badge-orange' : 'badge-blue'} mr-1`}>{e}</span>)}</td>
                  <td className="text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {(!data?.recentStudents?.length) && (
                <tr><td colSpan={4} className="text-center text-slate-500 py-8 font-body">No students yet. Add students to see them here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
