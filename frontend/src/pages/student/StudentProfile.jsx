// StudentProfile.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Save, Lock } from 'lucide-react'
import { updateProfile, changePassword } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export function StudentProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', parentName: user?.parentName || '', parentPhone: user?.parentPhone || '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [tab, setTab] = useState('profile')

  const saveProfile = async (e) => {
    e.preventDefault()
    const res = await dispatch(updateProfile(form))
    if (!res.error) toast.success('Profile updated!')
    else toast.error(res.payload || 'Error')
  }

  const savePass = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirm) return toast.error('Passwords do not match')
    const res = await dispatch(changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }))
    if (!res.error) { toast.success('Password changed!'); setPassForm({ currentPassword: '', newPassword: '', confirm: '' }) }
    else toast.error(res.payload || 'Error')
  }

  return (
    <div className="space-y-5">
      <h1 className="section-title">My Profile</h1>
      <div className="flex gap-2 mb-4">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-body font-medium transition-all capitalize ${tab === t ? 'bg-primary-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-dark-700/60">
            <div className="w-20 h-20 orange-gradient rounded-2xl flex items-center justify-center text-white text-4xl font-bold font-display">{user?.name?.charAt(0)}</div>
            <div>
              <h3 className="font-display text-2xl font-bold text-white">{user?.name}</h3>
              <p className="text-primary-400 font-mono text-sm">{user?.studentId}</p>
              <div className="flex gap-2 mt-1">{user?.targetExam?.map(e => <span key={e} className={`badge ${e === 'JEE' ? 'badge-orange' : 'badge-blue'}`}>{e}</span>)}</div>
            </div>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div><label className="label">Parent Name</label><input className="input" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} /></div>
              <div><label className="label">Parent Phone</label><input className="input" value={form.parentPhone} onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} /></div>
            </div>
            <div><label className="label">Address</label><textarea className="input" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-dark-900/60 rounded-xl">
              {[['Email', user?.email], ['Gender', user?.gender], ['School', user?.school], ['Board', user?.board], ['DOB', user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : '—'], ['Joined', new Date(user?.joiningDate || user?.createdAt).toLocaleDateString('en-IN')]].map(([k, v]) => (
                <div key={k}><p className="text-xs text-slate-500 font-body">{k}</p><p className="text-sm text-white font-medium">{v || '—'}</p></div>
              ))}
            </div>

            <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
          </form>
        </motion.div>
      )}

      {tab === 'password' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 max-w-md">
          <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-primary-400" /> Change Password</h3>
          <form onSubmit={savePass} className="space-y-4">
            <div><label className="label">Current Password</label><input type="password" className="input" value={passForm.currentPassword} onChange={e => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} required /></div>
            <div><label className="label">New Password</label><input type="password" className="input" value={passForm.newPassword} onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))} required /></div>
            <div><label className="label">Confirm New Password</label><input type="password" className="input" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))} required /></div>
            <button type="submit" className="btn-primary flex items-center gap-2"><Lock className="w-4 h-4" /> Update Password</button>
          </form>
        </motion.div>
      )}
    </div>
  )
}
export default StudentProfile
