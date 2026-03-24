import { Link } from 'react-router-dom'
import { BookOpen, Phone, Mail, MapPin, Youtube, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 orange-gradient rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none">Math Point</span>
                <p className="text-[10px] text-primary-400 font-body leading-none">JEE & NEET Coaching</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-body leading-relaxed mb-5">
              Guiding lakhs of students towards their dream of IIT & AIIMS. Founded by Ashish Upadhyay with 10+ years of excellence.
            </p>
            <div className="flex gap-3">
              {[Youtube, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-dark-800 hover:bg-primary-500/20 hover:border-primary-500/40
                  border border-dark-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-400 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 text-sm font-body transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Programs</h4>
            <ul className="space-y-2.5">
              {['JEE Main & Advanced', 'NEET UG', 'JEE Crash Course', 'Foundation Course', 'Doubt Sessions'].map(p => (
                <li key={p}><span className="text-slate-400 text-sm font-body">{p}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-slate-400 text-sm font-body">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                123 Education Hub, Sector 5, Noida, UP – 201301
              </li>
              <li className="flex items-center gap-2.5 text-slate-400 text-sm font-body">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5 text-slate-400 text-sm font-body">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                info@mathpoint.in
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-dark-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs font-body">© {new Date().getFullYear()} Math Point. All rights reserved. Owned by Ashish Upadhyay.</p>
          <p className="text-slate-600 text-xs font-body">Designed with ❤️ for IIT & AIIMS aspirants</p>
        </div>
      </div>
    </footer>
  )
}
