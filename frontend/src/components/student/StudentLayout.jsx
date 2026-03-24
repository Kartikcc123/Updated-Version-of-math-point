import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, User, DollarSign, ClipboardList, BookOpen, Upload, FileText, BarChart3, Bell, HelpCircle, LogOut, Menu, X, BookOpenCheck, ChevronRight } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

const navItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/student/fees', icon: DollarSign, label: 'Fees & Payment' },
  { to: '/student/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/student/batches', icon: BookOpen, label: 'My Batches' },
  { to: '/student/materials', icon: Upload, label: 'Study Material' },
  { to: '/student/tests', icon: FileText, label: 'Tests & Exams' },
  { to: '/student/results', icon: BarChart3, label: 'Results' },
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  { to: '/student/doubts', icon: HelpCircle, label: 'Doubt Support' },
]

export default function StudentLayout() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize from sessionStorage, default to true on desktop
    const saved = sessionStorage.getItem('studentSidebarOpen')
    if (saved !== null) return saved === 'true'
    return window.innerWidth >= 1024
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { unreadCount } = useSelector(s => s.notifications)

  // Persist sidebar state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('studentSidebarOpen', String(sidebarOpen))
  }, [sidebarOpen])

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      // On desktop, ensure sidebar is open by default
      if (desktop && !sessionStorage.getItem('studentSidebarOpen')) {
        setSidebarOpen(true)
      }
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const Sidebar = () => (
    <>
      <AnimatePresence>
        {(isDesktop || sidebarOpen) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" />}
      </AnimatePresence>
      <motion.aside animate={{ x: (isDesktop || sidebarOpen) ? 0 : '-100%' }} className="fixed top-0 left-0 h-full w-64 bg-dark-900 border-r border-dark-800 z-40 flex flex-col lg:translate-x-0 lg:static lg:z-auto transition-transform duration-300">
        <div className="flex items-center justify-between p-5 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 orange-gradient rounded-xl flex items-center justify-center shadow-glow-sm"><BookOpenCheck className="w-5 h-5 text-white" /></div>
            <div><p className="font-display font-bold text-white text-base leading-none">Math Point</p><p className="text-[10px] text-primary-400 font-body">Student Portal</p></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon style={{ width: '18px', height: '18px' }} className="shrink-0" />
              {item.label}
              {item.to === '/student/notifications' && unreadCount > 0 && (
                <span className="ml-auto text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-display">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-800">
          <div className="flex items-center gap-3 p-3 bg-dark-800/60 rounded-xl mb-2">
            <div className="w-9 h-9 orange-gradient rounded-full flex items-center justify-center text-white font-bold font-display text-sm shrink-0">{user?.name?.charAt(0)}</div>
            <div className="min-w-0"><p className="text-sm font-semibold text-white font-display truncate">{user?.name}</p><p className="text-xs text-slate-400 font-body font-mono">{user?.studentId}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-body font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>
    </>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur border-b border-dark-800/60 h-14 flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-body lg:ml-0 ml-2"><ChevronRight className="w-4 h-4" /><span>Student Portal</span></div>
          <NavLink to="/student/notifications" className="relative p-2 text-slate-400 hover:text-white">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
          </NavLink>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  )
}
