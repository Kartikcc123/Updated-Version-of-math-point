// CoursesPage.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, Users, BookOpen } from 'lucide-react'
import Navbar from '../../components/public/Navbar'
import Footer from '../../components/public/Footer'

const courses = [
  {
    name: 'JEE Main & Advanced (2 Year)',
    code: 'JEE-2Y', exam: 'JEE', duration: '2 Years', fee: '₹85,000/year',
    seats: 40, tag: 'Most Popular',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    features: ['Daily Practice Problems (DPPs)', 'Weekly Chapter Tests', 'Monthly Full Syllabus Mock Tests',
      'One-on-One Doubt Sessions', 'Complete Study Material', 'Performance Analytics', 'Parent-Teacher Meetings'],
    desc: 'Our flagship 2-year program designed to build strong conceptual foundations and exam temperament for IIT-JEE. Covers complete syllabus of both Main and Advanced with intensive practice.',
  },
  {
    name: 'NEET UG Complete (2 Year)',
    code: 'NEET-2Y', exam: 'NEET', duration: '2 Years', fee: '₹75,000/year',
    seats: 35, tag: 'Top Rated',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    features: ['NCERT-focused Teaching', 'Biology Special Classes', 'NEET Pattern Mock Tests',
      'Previous Year Question Analysis', 'Revision Classes', 'Topic-wise DPPs', 'Medical Counselling Guidance'],
    desc: 'Comprehensive NEET preparation with special emphasis on Biology and NCERT. Regularly updated with latest NMC guidelines and exam patterns.',
  },
  {
    name: 'JEE Crash Course',
    code: 'JEE-CC', exam: 'JEE', duration: '6 Months', fee: '₹35,000',
    seats: 30, tag: 'Dropper Batch',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    features: ['Rapid Revision Strategy', 'High-Yield Topic Focus', 'Daily Mini Tests',
      'Full-Length Mock Tests', 'Error Analysis Sessions', 'Time Management Workshops'],
    desc: 'Intensive 6-month crash course for JEE droppers and repeaters. Focus on high-weightage topics, problem-solving speed and exam strategy.',
  },
  {
    name: 'NEET Crash Course',
    code: 'NEET-CC', exam: 'NEET', duration: '6 Months', fee: '₹30,000',
    seats: 30, tag: 'New Batch',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    features: ['NCERT Line-by-Line Analysis', 'Assertion-Reason Practice', 'Full Syllabus Mock Tests',
      'Biology Diagrams Focus', 'Weak Area Identification', 'Last-Mile Revision'],
    desc: 'Targeted crash course for NEET aspirants focusing on rapid concept revision and maximum practice with NTA-pattern questions.',
  },
]

export function CoursesPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="text-5xl font-bold font-display text-white mb-3">Our <span className="text-gradient">Programs</span></h1>
            <p className="text-slate-400 font-body max-w-2xl mx-auto text-lg">
              Carefully crafted courses to help you achieve your dream rank in JEE and NEET.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-7">
            {courses.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} className="card p-7 hover:border-primary-500/30 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`badge ${c.exam === 'JEE' ? 'badge-orange' : 'badge-blue'} mb-2`}>{c.exam}</span>
                    <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
                  </div>
                  <span className="badge badge-green shrink-0">{c.tag}</span>
                </div>
                <p className="text-slate-400 text-sm font-body leading-relaxed mb-5">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {c.subjects.map(s => <span key={s} className="badge badge-yellow">{s}</span>)}
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  {c.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300 font-body">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 p-4 bg-dark-900/60 rounded-xl mb-5">
                  <div className="text-center"><Clock className="w-4 h-4 text-primary-400 mx-auto mb-1" /><p className="text-xs text-slate-400 font-body">Duration</p><p className="text-sm font-bold text-white font-display">{c.duration}</p></div>
                  <div className="text-center"><BookOpen className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-xs text-slate-400 font-body">Fee</p><p className="text-sm font-bold text-primary-400 font-display">{c.fee}</p></div>
                  <div className="text-center"><Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" /><p className="text-xs text-slate-400 font-body">Seats</p><p className="text-sm font-bold text-white font-display">{c.seats}</p></div>
                </div>
                <Link to="/contact" className="btn-primary text-center py-3">Enroll in This Course</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CoursesPage
