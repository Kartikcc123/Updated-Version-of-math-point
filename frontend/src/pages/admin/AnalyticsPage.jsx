import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import { fetchAdminDashboard } from '../../store/slices/analyticsSlice'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler)

export default function AnalyticsPage() {
  const dispatch = useDispatch()
  const { adminStats: data, loading } = useSelector(s => s.analytics)
  useEffect(() => { dispatch(fetchAdminDashboard()) }, [dispatch])

  const s = data?.stats

  const chartOpts = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 12 } } } }, scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } } } }

  const barData = {
    labels: data?.monthlyFees?.map(m => `${m._id.month}/${m._id.year}`) || [],
    datasets: [{ label: 'Fee Collected (₹)', data: data?.monthlyFees?.map(m => m.collected) || [], backgroundColor: 'rgba(249,115,22,0.75)', borderRadius: 8, hoverBackgroundColor: '#f97316' }],
  }
  const doughnutData = {
    labels: ['JEE Students', 'NEET Students'],
    datasets: [{ data: [s?.jeeStudents || 0, s?.neetStudents || 0], backgroundColor: ['#f97316', '#3b82f6'], borderColor: ['#1e293b', '#1e293b'], borderWidth: 3 }],
  }
  const lineData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      { label: 'Students Enrolled', data: [12, 19, 15, 27, 35, 30, 40, 42, 38, 50, 55, s?.totalStudents || 60], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4, pointRadius: 4 },
    ],
  }

  const kpiCards = s ? [
    { label: 'Total Students', value: s.totalStudents, sub: `${s.jeeStudents} JEE + ${s.neetStudents} NEET`, color: 'from-blue-500 to-blue-700', icon: Users },
    { label: 'Total Revenue', value: `₹${(s.totalCollected / 100000).toFixed(2)}L`, sub: `₹${(s.totalPending / 100000).toFixed(2)}L pending`, color: 'from-emerald-500 to-emerald-700', icon: DollarSign },
    { label: 'Avg Test Score', value: `${s.avgTestScore}%`, sub: 'Across all tests', color: 'from-primary-500 to-red-600', icon: TrendingUp },
    { label: 'Avg Attendance', value: `${s.avgAttendance}%`, sub: 'All batches combined', color: 'from-purple-500 to-purple-700', icon: BarChart3 },
  ] : []

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div><h1 className="section-title">Analytics & Reports</h1><p className="text-slate-400 text-sm font-body mt-0.5">Comprehensive overview of Math Point's performance</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center mb-3`}><c.icon className="w-5 h-5 text-white" /></div>
            <p className="text-2xl font-bold font-display text-white">{c.value}</p>
            <p className="text-xs font-semibold text-slate-300 font-body mt-0.5">{c.label}</p>
            <p className="text-xs text-slate-500 font-body">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h3 className="font-display font-bold text-white mb-4">Student Enrollment Trend</h3>
          <Line data={lineData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} height={120} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <h3 className="font-display font-bold text-white mb-4">Students by Target Exam</h3>
          <div className="flex items-center justify-center"><div style={{ maxWidth: '260px', width: '100%' }}><Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 12 }, padding: 16 } } } }} /></div></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
        <h3 className="font-display font-bold text-white mb-4">Monthly Fee Collection</h3>
        <Bar data={barData} options={chartOpts} height={80} />
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Courses Available', value: s?.totalCourses || 0, icon: '📚', color: 'text-blue-400' },
          { label: 'Active Batches', value: s?.totalBatches || 0, icon: '🏫', color: 'text-emerald-400' },
          { label: 'Open Doubts', value: s?.openDoubts || 0, icon: '❓', color: 'text-red-400' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
            className="card p-5 text-center">
            <p className="text-3xl mb-2">{item.icon}</p>
            <p className={`text-3xl font-bold font-display ${item.color}`}>{item.value}</p>
            <p className="text-slate-400 font-body text-sm mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
