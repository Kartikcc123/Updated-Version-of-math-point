import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Award, BookOpen, Clock, TrendingUp, CheckCircle, Play, Trophy, Target, Zap } from 'lucide-react'
import Navbar from '../../components/public/Navbar'
import Footer from '../../components/public/Footer'

const stats = [
  { icon: Users, value: '50,000+', label: 'Students Guided', color: 'from-blue-500 to-cyan-500' },
  { icon: Trophy, value: '98%', label: 'Success Rate', color: 'from-amber-500 to-orange-500' },
  { icon: Award, value: '10+', label: 'Years Experience', color: 'from-primary-500 to-red-500' },
  { icon: Star, value: '4.9/5', label: 'Student Rating', color: 'from-purple-500 to-pink-500' },
]

const features = [
  { icon: Target, title: 'Expert Faculty', desc: 'Learn from IITians and top educators with proven track records in JEE & NEET.' },
  { icon: BookOpen, title: 'Comprehensive Study Material', desc: 'Specially curated notes, DPPs and assignments aligned with latest exam patterns.' },
  { icon: Zap, title: 'Regular Tests & Analysis', desc: 'Weekly chapter tests, monthly mocks and detailed performance analytics.' },
  { icon: TrendingUp, title: 'Personalised Mentorship', desc: 'One-on-one doubt sessions and progress tracking for every student.' },
  { icon: Clock, title: 'Flexible Batches', desc: 'Morning, afternoon and evening batches to suit every student\'s schedule.' },
  { icon: CheckCircle, title: 'Proven Results', desc: 'Our students have secured AIR under 100 in both JEE Advanced & NEET.' },
]

const toppers = [
  { name: 'Aarav Sharma', exam: 'JEE Advanced', rank: 'AIR 47', year: '2024', img: '👨‍🎓' },
  { name: 'Priya Nair', exam: 'NEET UG', rank: 'AIR 23', year: '2024', img: '👩‍🎓' },
  { name: 'Rohit Meena', exam: 'JEE Advanced', rank: 'AIR 112', year: '2023', img: '👨‍🎓' },
  { name: 'Ananya Singh', exam: 'NEET UG', rank: 'AIR 78', year: '2023', img: '👩‍🎓' },
]

const courses = [
  { name: 'JEE Main & Advanced', duration: '2 Years', fee: '₹85,000/year', tag: 'Most Popular', tagColor: 'badge-orange', desc: 'Complete preparation for IIT-JEE with Physics, Chemistry & Mathematics.', subjects: ['Physics', 'Chemistry', 'Maths'], exam: 'JEE' },
  { name: 'NEET UG Complete', duration: '2 Years', fee: '₹75,000/year', tag: 'Top Rated', tagColor: 'badge-green', desc: 'Comprehensive NEET prep with NCERT focus and Biology special classes.', subjects: ['Physics', 'Chemistry', 'Biology'], exam: 'NEET' },
  { name: 'JEE Crash Course', duration: '6 Months', fee: '₹35,000', tag: 'Dropper Batch', tagColor: 'badge-blue', desc: 'Intensive revision for JEE droppers with topic-wise strategy.', subjects: ['Physics', 'Chemistry', 'Maths'], exam: 'JEE' },
]

const testimonials = [
  { name: 'Kavya Reddy', text: 'The faculty at Math Point is extraordinary. Mr. Upadhyay\'s maths classes transformed my problem-solving approach.', rank: 'NEET AIR 156', avatar: '👩' },
  { name: 'Devraj Patel', text: 'From scoring 60% in school to cracking JEE Advanced — Math Point made this journey possible.', rank: 'JEE AIR 289', avatar: '👦' },
  { name: 'Simran Kaur', text: 'The study material and daily practice problems here are simply the best I\'ve seen anywhere.', rank: 'NEET AIR 341', avatar: '👧' },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-primary-400 text-sm font-semibold font-body mb-6">
                <Star className="w-4 h-4" fill="currentColor" />
                India's #1 JEE & NEET Coaching
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold font-display text-white leading-tight mb-6">
                Crack <span className="text-gradient">JEE & NEET</span><br />with Confidence
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-slate-400 font-body leading-relaxed mb-8 max-w-lg">
                Join <strong className="text-white">Math Point</strong> — guided by <strong className="text-primary-400">Ashish Upadhyay</strong> with 10+ years of experience. We have mentored lakhs of students to their dream IITs and AIIMS.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="btn-primary flex items-center gap-2 text-base py-3 px-7">
                  Enroll Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/courses" className="btn-secondary flex items-center gap-2 text-base py-3 px-7">
                  <Play className="w-4 h-4" /> View Courses
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                {['Free Demo Class', 'Study Material Included', 'Online + Offline'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-slate-400 font-body">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl border border-dark-700/60 p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto orange-gradient rounded-2xl flex items-center justify-center text-5xl mb-4 animate-float">🎓</div>
                  <h3 className="font-display text-xl font-bold text-white">Ashish Upadhyay</h3>
                  <p className="text-primary-400 text-sm font-body">Founder & Head Faculty</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stats.slice(0, 4).map((s, i) => (
                    <div key={i} className="bg-dark-950/60 rounded-xl p-3 text-center border border-dark-700/40">
                      <p className="text-2xl font-bold font-display text-white">{s.value}</p>
                      <p className="text-xs text-slate-400 font-body">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold font-display px-3 py-1.5 rounded-full shadow-lg">
                  ✓ Trusted by 50K+
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-dark-900/50 border-y border-dark-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl font-bold font-display text-white">{s.value}</p>
                <p className="text-slate-400 text-sm font-body mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-white mb-3">Our <span className="text-gradient">Programs</span></h2>
            <p className="text-slate-400 font-body max-w-xl mx-auto">Choose the right course tailored for your exam goal and learning pace.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`badge ${c.exam === 'JEE' ? 'badge-orange' : 'badge-blue'}`}>{c.exam}</span>
                  <span className={c.tagColor + ' badge'}>{c.tag}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{c.name}</h3>
                <p className="text-slate-400 text-sm font-body mb-4 flex-1">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {c.subjects.map(s => <span key={s} className="badge badge-yellow text-xs">{s}</span>)}
                </div>
                <div className="flex items-center justify-between mb-5 p-3 bg-dark-900/60 rounded-xl">
                  <div><p className="text-xs text-slate-500 font-body">Duration</p><p className="text-sm font-semibold text-white font-display">{c.duration}</p></div>
                  <div className="text-right"><p className="text-xs text-slate-500 font-body">Fee</p><p className="text-sm font-semibold text-primary-400 font-display">{c.fee}</p></div>
                </div>
                <Link to="/contact" className="btn-primary text-center text-sm py-2.5">Enroll Now</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-white mb-3">Why Choose <span className="text-gradient">Math Point?</span></h2>
            <p className="text-slate-400 font-body max-w-xl mx-auto">Everything you need to crack JEE & NEET — under one roof.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-6 hover:border-primary-500/30">
                <div className="w-12 h-12 orange-gradient rounded-xl flex items-center justify-center mb-4 shadow-glow-sm">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Toppers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-white mb-3">Our <span className="text-gradient">Star Toppers</span></h2>
            <p className="text-slate-400 font-body">Students who made us proud with their extraordinary results.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {toppers.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-5 text-center hover:border-primary-500/30">
                <div className="w-14 h-14 mx-auto bg-dark-700 rounded-full flex items-center justify-center text-3xl mb-3">{t.img}</div>
                <h4 className="font-display font-bold text-white text-sm">{t.name}</h4>
                <p className="text-primary-400 font-bold font-display text-lg mt-1">{t.rank}</p>
                <p className="text-slate-400 text-xs font-body">{t.exam} · {t.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-white mb-3">Student <span className="text-gradient">Testimonials</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6">
                <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <p className="text-slate-300 text-sm font-body leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div><p className="font-display font-bold text-white text-sm">{t.name}</p><p className="text-primary-400 text-xs font-body">{t.rank}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card p-10 bg-gradient-to-br from-primary-500/10 to-amber-500/5 border-primary-500/20">
            <h2 className="text-4xl font-bold font-display text-white mb-4">Start Your <span className="text-gradient">Success Journey</span> Today</h2>
            <p className="text-slate-400 font-body mb-8 text-lg">Limited seats available. Book your FREE demo class now and experience the Math Point difference.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary text-base py-3.5 px-10 flex items-center justify-center gap-2">
                Book Free Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+919876543210" className="btn-secondary text-base py-3.5 px-10 flex items-center justify-center gap-2">
                📞 Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
