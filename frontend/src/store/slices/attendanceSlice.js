import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchBatchAttendance = createAsyncThunk('attendance/batch', async (params) => {
  const { data } = await api.get('/attendance/batch', { params }); return data
})
export const fetchMyAttendance = createAsyncThunk('attendance/my', async (params) => {
  const { data } = await api.get('/attendance/my', { params }); return data
})
export const markAttendance = createAsyncThunk('attendance/mark', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/attendance', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const fetchAttendanceReport = createAsyncThunk('attendance/report', async (batchId) => {
  const { data } = await api.get(`/attendance/report/${batchId}`); return data
})

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { list: [], myRecords: [], myStats: null, report: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBatchAttendance.pending, (s) => { s.loading = true })
     .addCase(fetchBatchAttendance.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.attendance })
     .addCase(fetchMyAttendance.fulfilled, (s, a) => { s.myRecords = a.payload.records; s.myStats = a.payload.stats })
     .addCase(fetchAttendanceReport.fulfilled, (s, a) => { s.report = a.payload.report })
  }
})
export default attendanceSlice.reducer
