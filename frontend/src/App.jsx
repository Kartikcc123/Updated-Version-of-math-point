import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/slices/authSlice'

// Public pages
import HomePage from './pages/public/HomePage'
import CoursesPage from './pages/public/CoursesPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'

// Admin pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentsPage from './pages/admin/StudentsPage'
import TeachersPage from './pages/admin/TeachersPage'
import CoursesAdminPage from './pages/admin/CoursesAdminPage'
import FeesPage from './pages/admin/FeesPage'
import AttendancePage from './pages/admin/AttendancePage'
import TestsAdminPage from './pages/admin/TestsAdminPage'
import MaterialsAdminPage from './pages/admin/MaterialsAdminPage'
import NotificationsAdminPage from './pages/admin/NotificationsAdminPage'
import DoubtsAdminPage from './pages/admin/DoubtsAdminPage'
import RolesPage from './pages/admin/RolesPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'

// Student pages
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentFees from './pages/student/StudentFees'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentBatches from './pages/student/StudentBatches'
import StudentMaterials from './pages/student/StudentMaterials'
import StudentTests from './pages/student/StudentTests'
import StudentResults from './pages/student/StudentResults'
import StudentNotifications from './pages/student/StudentNotifications'
import StudentDoubts from './pages/student/StudentDoubts'
import TestAttempt from './pages/student/TestAttempt'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} replace />
  }
  return children
}

const PublicRoute = ({ children }) => {
  const { token, user } = useSelector(s => s.auth)
  if (token && user) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} replace />
  }
  return children
}

function App() {
  const dispatch = useDispatch()
  const { token, initialized } = useSelector(s => s.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [token, dispatch])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-body">Loading Math Point...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['superadmin','admin','teacher']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="courses" element={<CoursesAdminPage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="tests" element={<TestsAdminPage />} />
          <Route path="materials" element={<MaterialsAdminPage />} />
          <Route path="notifications" element={<NotificationsAdminPage />} />
          <Route path="doubts" element={<DoubtsAdminPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="batches" element={<StudentBatches />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="tests" element={<StudentTests />} />
          <Route path="tests/:id/attempt" element={<TestAttempt />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="doubts" element={<StudentDoubts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
