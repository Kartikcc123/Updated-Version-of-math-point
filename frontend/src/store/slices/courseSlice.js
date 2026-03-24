import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCourses = createAsyncThunk('courses/fetchAll', async () => {
  const { data } = await api.get('/courses'); return data
})
export const fetchBatches = createAsyncThunk('courses/fetchBatches', async (params) => {
  const { data } = await api.get('/courses/batches', { params }); return data
})
export const createCourse = createAsyncThunk('courses/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/courses', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const createBatch = createAsyncThunk('courses/createBatch', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/courses/batches', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const enrollStudent = createAsyncThunk('courses/enroll', async ({ batchId, studentId }, { rejectWithValue }) => {
  try { const { data } = await api.post(`/courses/batches/${batchId}/enroll`, { studentId }); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const courseSlice = createSlice({
  name: 'courses',
  initialState: { courses: [], batches: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCourses.fulfilled, (s, a) => { s.courses = a.payload.courses })
     .addCase(fetchBatches.pending, (s) => { s.loading = true })
     .addCase(fetchBatches.fulfilled, (s, a) => { s.loading = false; s.batches = a.payload.batches })
     .addCase(createCourse.fulfilled, (s, a) => { s.courses.push(a.payload.course) })
     .addCase(createBatch.fulfilled, (s, a) => { s.batches.push(a.payload.batch) })
  }
})
export default courseSlice.reducer
