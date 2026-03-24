import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import Navbar from '../../components/public/Navbar'
import Footer from '../../components/public/Footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', message: '' })

  const handle = (e) => {
    e.preventDefault()
    toast.success('Thank you! We will contact you within 24 hours.')
    setForm({ name: '', email: '', phone: '', course: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="text-5xl font-bold font-display text-white mb-3">Get In <span className="text-gradient">Touch</span></h1>
            <p className="text-slate-400 font-body max-w-xl mx-auto text-lg">
              Ready to start your JEE/NEET journey? Fill the form and our counsellor will call you back.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: MapPin, title: 'Visit Us', lines: ['123 Education Hub, Sector 5,', 'Noida, Uttar Pradesh – 201301'] },
                { icon: Phone, title: 'Call Us', lines: ['+91 98765 43210', '+91 87654 32109'] },
                { icon: Mail, title: 'Email Us', lines: ['info@mathpoint.in', 'admissions@mathpoint.in'] },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }} className="card p-5 flex gap-4">
                  <div className="w-11 h-11 orange-gradient rounded-xl flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">{c.title}</h4>
                    {c.lines.map(l => <p key={l} className="text-slate-400 text-sm font-body">{l}</p>)}
                  </div>
                </motion.div>
              ))}
              <div className="card p-5">
                <h4 className="font-display font-bold text-white mb-3">Timing</h4>
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-slate-300"><span>Mon – Sat</span><span className="text-primary-400">7:00 AM – 9:00 PM</span></div>
                  <div className="flex justify-between text-slate-300"><span>Sunday</span><span className="text-primary-400">9:00 AM – 5:00 PM</span></div>
                  <div className="flex justify-between text-slate-300"><span>Enquiry</span><span className="text-emerald-400">9:00 AM – 7:00 PM</span></div>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 card p-8">
              <h3 className="font-display text-2xl font-bold text-white mb-6">Book a Free Demo Class</h3>
              <form onSubmit={handle} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name</label><input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div><label className="label">Phone Number</label><input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
                </div>
                <div><label className="label">Email Address</label><input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div>
                  <label className="label">Interested Course</label>
                  <select className="input" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
                    <option value="">Select a course</option>
                    <option>JEE Main &amp; Advanced (2 Year)</option>
                    <option>NEET UG Complete (2 Year)</option>
                    <option>JEE Crash Course</option>
                    <option>NEET Crash Course</option>
                  </select>
                </div>
                <div><label className="label">Message (Optional)</label><textarea className="input" rows={3} placeholder="Any specific queries..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
                <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Enquiry
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
