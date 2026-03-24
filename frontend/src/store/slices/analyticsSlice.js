import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ANALYTICS
export const fetchAdminDashboard = createAsyncThunk('analytics/admin', async () => {
  const { data } = await api.get('/analytics/admin'); return data
})
export const fetchStudentDashboard = createAsyncThunk('analytics/student', async () => {
  const { data } = await api.get('/analytics/student'); return data
})
export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { adminStats: null, studentStats: null, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAdminDashboard.pending, (s) => { s.loading = true })
     .addCase(fetchAdminDashboard.fulfilled, (s, a) => { s.loading = false; s.adminStats = a.payload })
     .addCase(fetchStudentDashboard.fulfilled, (s, a) => { s.studentStats = a.payload })
  }
})
export default analyticsSlice.reducer
