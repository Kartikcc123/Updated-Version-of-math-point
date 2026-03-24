import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchTeachers = createAsyncThunk('teachers/fetchAll', async (params) => {
  const { data } = await api.get('/teachers', { params }); return data
})
export const createTeacher = createAsyncThunk('teachers/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/teachers', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const updateTeacher = createAsyncThunk('teachers/update', async ({ id, payload }) => {
  const { data } = await api.put(`/teachers/${id}`, payload); return data
})
export const deleteTeacher = createAsyncThunk('teachers/delete', async (id) => {
  await api.delete(`/teachers/${id}`); return id
})

const teacherSlice = createSlice({
  name: 'teachers', initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTeachers.pending, (s) => { s.loading = true })
     .addCase(fetchTeachers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.teachers })
     .addCase(createTeacher.fulfilled, (s, a) => { s.list.unshift(a.payload.teacher) })
     .addCase(updateTeacher.fulfilled, (s, a) => { const i = s.list.findIndex(t => t._id === a.payload.teacher._id); if (i !== -1) s.list[i] = a.payload.teacher })
     .addCase(deleteTeacher.fulfilled, (s, a) => { s.list = s.list.filter(t => t._id !== a.payload) })
  }
})
export default teacherSlice.reducer
