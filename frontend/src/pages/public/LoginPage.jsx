import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Eye, EyeOff, BookOpen, LogIn } from 'lucide-react'
import { login } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    const res = await dispatch(login(form))
    if (login.fulfilled.match(res)) {
      toast.success(`Welcome back, ${res.payload.user.name}!`)
      navigate(res.payload.user.role === 'student' ? '/student/dashboard' : '/admin/dashboard')
    } else {
      toast.error(res.payload || 'Login failed')
    }
  }

  const demoLogins = [
    { role: 'SuperAdmin', email: 'admin@mathpoint.in', password: 'Admin@1234', color: 'from-primary-500 to-amber-500' },
    { role: 'Teacher', email: 'rahul@mathpoint.in', password: 'Teacher@1234', color: 'from-blue-500 to-cyan-500' },
    { role: 'Student', email: 'arjun@student.com', password: 'Student@1234', color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-1 orange-gradient" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 orange-gradient rounded-2xl flex items-center justify-center shadow-glow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-white text-2xl leading-none">Math Point</p>
              <p className="text-primary-400 text-xs font-body">JEE & NEET Coaching</p>
            </div>
          </Link>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-slate-400 font-body text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input pr-12" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-xs text-slate-500 font-body mb-3">— Demo Accounts —</p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map(d => (
                <button key={d.role} onClick={() => setForm({ email: d.email, password: d.password })}
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${d.color} bg-opacity-10 border border-white/10
                    text-white text-xs font-semibold font-display hover:opacity-90 transition-opacity`}>
                  {d.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs font-body mt-5">
          <Link to="/" className="hover:text-primary-400 transition-colors">← Back to Website</Link>
        </p>
      </motion.div>
    </div>
  )
}
