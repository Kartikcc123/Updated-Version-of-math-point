// RolesPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Shield, Check } from 'lucide-react'
import { fetchTeachers } from '../../store/slices/teacherSlice'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ALL_PERMISSIONS = [
  { key: 'manage_students', label: 'Manage Students', desc: 'Add, edit, delete student records' },
  { key: 'manage_teachers', label: 'Manage Teachers', desc: 'Add, edit, delete teacher records' },
  { key: 'manage_courses', label: 'Manage Courses', desc: 'Create and manage courses & batches' },
  { key: 'manage_fees', label: 'Manage Fees', desc: 'View and collect fee payments' },
  { key: 'manage_attendance', label: 'Mark Attendance', desc: 'Mark and view attendance' },
  { key: 'manage_tests', label: 'Manage Tests', desc: 'Create and publish tests & exams' },
  { key: 'manage_study_material', label: 'Study Material', desc: 'Upload and manage study material' },
  { key: 'view_analytics', label: 'View Analytics', desc: 'Access dashboard analytics' },
  { key: 'send_notifications', label: 'Send Notifications', desc: 'Send notifications to students' },
  { key: 'manage_roles', label: 'Manage Roles', desc: 'Assign roles and permissions' },
]

export default function RolesPage() {
  const dispatch = useDispatch()
  const { list: teachers } = useSelector(s => s.teachers)
  const [admins, setAdmins] = useState([])
  const [selected, setSelected] = useState(null)
  const [permissions, setPermissions] = useState([])

  useEffect(() => { dispatch(fetchTeachers()); loadAdmins() }, [dispatch])
  const loadAdmins = async () => {
    try { const { data } = await api.get('/students?role=admin'); setAdmins(data.students || []) } catch {}
  }

  const selectUser = (user) => { setSelected(user); setPermissions(user.permissions || []) }
  const toggle = (perm) => setPermissions(p => p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm])
  const save = async () => {
    if (!selected) return
    try {
      await api.put(`/teachers/${selected._id}`, { permissions })
      toast.success('Permissions updated!')
      dispatch(fetchTeachers())
    } catch (err) {
      toast.error('Error saving permissions')
    }
  }

  const allUsers = [...teachers, ...admins]

  return (
    <div className="space-y-5">
      <div className="page-header"><h1 className="section-title">Roles & Permissions</h1><p className="text-slate-400 text-sm font-body">Manage admin and teacher access rights</p></div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-dark-700/60"><h3 className="font-display font-bold text-white text-sm">Staff Members</h3></div>
          <div className="divide-y divide-dark-700/40">
            {allUsers.map(u => (
              <div key={u._id} onClick={() => selectUser(u)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-dark-800/40 transition-colors ${selected?._id === u._id ? 'bg-primary-500/10 border-r-2 border-primary-500' : ''}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold font-display text-sm shrink-0">{u.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{u.role} · {u.permissions?.length || 0} perms</p>
                </div>
              </div>
            ))}
            {!allUsers.length && <p className="text-center text-slate-500 text-sm py-8 font-body">No staff members found</p>}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-700/60">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold font-display">{selected.name?.charAt(0)}</div>
                <div><h4 className="font-display font-bold text-white">{selected.name}</h4><p className="text-slate-400 text-sm capitalize font-body">{selected.role} · {selected.email}</p></div>
              </div>
              <h4 className="font-display font-semibold text-white mb-3">Permissions</h4>
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {ALL_PERMISSIONS.map(p => (
                  <div key={p.key} onClick={() => toggle(p.key)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${permissions.includes(p.key) ? 'border-primary-500/40 bg-primary-500/10' : 'border-dark-700/60 hover:border-dark-600'}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${permissions.includes(p.key) ? 'bg-primary-500 border-primary-500' : 'border-dark-600'}`}>
                      {permissions.includes(p.key) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{p.label}</p>
                      <p className="text-slate-500 text-xs font-body">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={save} className="btn-primary flex items-center gap-2"><Shield className="w-4 h-4" /> Save Permissions</button>
            </div>
          ) : (
            <div className="card p-16 text-center">
              <Shield className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 font-body">Select a staff member to manage their permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
