import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import Navbar from '../../components/public/Navbar'
import Footer from '../../components/public/Footer'
import toast from 'react-hot-toast'

function AboutPage() {
  const milestones = [
    { year: '2014', event: 'Math Point founded by Ashish Upadhyay in Noida' },
    { year: '2016', event: 'First batch produces 3 students with JEE AIR under 500' },
    { year: '2018', event: 'NEET coaching launched; 100+ selections in first year' },
    { year: '2020', event: 'Online learning platform launched during pandemic' },
    { year: '2022', event: '10,000+ students milestone crossed' },
    { year: '2024', event: '50,000+ students; AIR 23 in NEET, AIR 47 in JEE Advanced' },
  ]
  const team = [
    { name: 'Ashish Upadhyay', role: 'Founder & Mathematics HOD', exp: '10+ Years', subjects: 'Mathematics', emoji: '👨‍🏫' },
    { name: 'Rahul Sharma', role: 'Physics Faculty', exp: '8 Years', subjects: 'Physics', emoji: '⚛️' },
    { name: 'Priya Singh', role: 'Chemistry & Biology HOD', exp: '6 Years', subjects: 'Chemistry, Biology', emoji: '🧪' },
    { name: 'Vikram Rao', role: 'Mathematics Faculty', exp: '7 Years', subjects: 'Mathematics', emoji: '📐' },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl font-bold font-display text-white mb-4">About <span className="text-gradient">Math Point</span></h1>
            <p className="text-slate-400 font-body max-w-3xl mx-auto text-lg leading-relaxed">
              Founded in 2014 by <strong className="text-white">Ashish Upadhyay</strong>, Math Point has grown from a small tutoring center
              to one of India's most trusted JEE &amp; NEET coaching institutes.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="card p-8 mb-16 grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto orange-gradient rounded-3xl flex items-center justify-center text-6xl mb-4 animate-float">👨‍🏫</div>
              <h3 className="font-display text-2xl font-bold text-white">Ashish Upadhyay</h3>
              <p className="text-primary-400 font-body">Founder &amp; Head Faculty</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-display text-xl font-bold text-white mb-3">A Passion for Teaching Mathematics</h4>
              <p className="text-slate-400 font-body leading-relaxed mb-4">
                With over 10 years of teaching experience, Ashish Upadhyay has mentored lakhs of students towards
                their dream IITs and AIIMS. His unique teaching methodology breaks down complex mathematical concepts
                into simple, intuitive steps that students can apply under exam pressure.
              </p>
              <p className="text-slate-400 font-body leading-relaxed mb-5">
                A gold medallist in Mathematics from Delhi University, Mr. Upadhyay has also authored study materials
                used by coaching centers across India.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[['10+', 'Years Teaching'], ['50K+', 'Students Guided'], ['98%', 'Success Rate']].map(([v, l]) => (
                  <div key={l} className="text-center p-3 bg-dark-900/60 rounded-xl">
                    <p className="text-2xl font-bold font-display text-primary-400">{v}</p>
                    <p className="text-xs text-slate-400 font-body">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display text-white text-center mb-10">Our <span className="text-gradient">Journey</span></h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-transparent" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className={`relative flex gap-6 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-10' : 'md:pl-10'}`}>
                      <div className="card p-4 inline-block w-full">
                        <span className="badge badge-orange mb-2">{m.year}</span>
                        <p className="text-slate-300 font-body text-sm">{m.event}</p>
                      </div>
                    </div>
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 orange-gradient rounded-full flex items-center justify-center text-white text-xs font-bold font-display shadow-glow-sm">{i + 1}</div>
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold font-display text-white text-center mb-10">Meet Our <span className="text-gradient">Faculty</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center hover:border-primary-500/30">
                  <div className="w-16 h-16 mx-auto bg-dark-700 rounded-2xl flex items-center justify-center text-4xl mb-4">{t.emoji}</div>
                  <h4 className="font-display font-bold text-white">{t.name}</h4>
                  <p className="text-primary-400 text-xs font-body mb-2">{t.role}</p>
                  <p className="text-slate-400 text-xs font-body">{t.subjects}</p>
                  <span className="badge badge-orange mt-3">{t.exp} exp</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage
