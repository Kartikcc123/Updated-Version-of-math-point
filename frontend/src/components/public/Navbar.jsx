import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 orange-gradient rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-none">Math Point</span>
              <p className="text-[10px] text-primary-400 font-body leading-none">JEE & NEET Coaching</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-body transition-colors
                  ${pathname === l.to ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-white hover:bg-dark-800'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-5">Login</Link>
            <Link to="/contact" className="btn-primary text-sm py-2 px-5">Enroll Now</Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-400 hover:text-white">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900 border-t border-dark-800 px-4 py-4 space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium font-body transition-colors
                  ${pathname === l.to ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300 hover:text-white hover:bg-dark-800'}`}>
                {l.label}
              </Link>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm text-center py-2.5">Login</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary text-sm text-center py-2.5">Enroll Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
