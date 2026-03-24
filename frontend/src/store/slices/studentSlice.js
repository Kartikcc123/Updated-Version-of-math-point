// studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchStudents = createAsyncThunk('students/fetchAll', async (params) => {
  const { data } = await api.get('/students', { params })
  return data
})
export const createStudent = createAsyncThunk('students/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/students', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const updateStudent = createAsyncThunk('students/update', async ({ id, payload }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/students/${id}`, payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const deleteStudent = createAsyncThunk('students/delete', async (id) => {
  await api.delete(`/students/${id}`); return id
})

const studentSlice = createSlice({
  name: 'students',
  initialState: { list: [], total: 0, pages: 1, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchStudents.pending, (s) => { s.loading = true })
     .addCase(fetchStudents.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.students; s.total = a.payload.total; s.pages = a.payload.pages })
     .addCase(fetchStudents.rejected, (s, a) => { s.loading = false; s.error = a.payload })
     .addCase(createStudent.fulfilled, (s, a) => { s.list.unshift(a.payload.student); s.total++ })
     .addCase(updateStudent.fulfilled, (s, a) => { const i = s.list.findIndex(x => x._id === a.payload.student._id); if (i !== -1) s.list[i] = a.payload.student })
     .addCase(deleteStudent.fulfilled, (s, a) => { s.list = s.list.filter(x => x._id !== a.payload) })
  }
})
export default studentSlice.reducer
