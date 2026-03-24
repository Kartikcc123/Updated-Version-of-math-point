import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// TEST SLICE
export const fetchTests = createAsyncThunk('tests/fetchAll', async (params) => {
  const { data } = await api.get('/tests', { params }); return data
})
export const fetchMyTests = createAsyncThunk('tests/fetchMy', async () => {
  const { data } = await api.get('/tests/my'); return data
})
export const createTest = createAsyncThunk('tests/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/tests', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const startTest = createAsyncThunk('tests/start', async (id) => {
  const { data } = await api.post(`/tests/${id}/start`); return data
})
export const submitTest = createAsyncThunk('tests/submit', async ({ id, answers }) => {
  const { data } = await api.post(`/tests/${id}/submit`, { answers }); return data
})
export const deleteTest = createAsyncThunk('tests/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/tests/${id}`); return id }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const testSlice = createSlice({
  name: 'tests',
  initialState: { list: [], myTests: [], activeTest: null, activeResult: null, loading: false, error: null },
  reducers: { setActiveTest: (s, a) => { s.activeTest = a.payload } },
  extraReducers: (b) => {
    b.addCase(fetchTests.fulfilled, (s, a) => { s.list = a.payload.tests })
     .addCase(fetchMyTests.fulfilled, (s, a) => { s.myTests = a.payload.tests })
     .addCase(createTest.fulfilled, (s, a) => { s.list.unshift(a.payload.test) })
     .addCase(startTest.fulfilled, (s, a) => { s.activeTest = a.payload.test; s.activeResult = a.payload.result })
     .addCase(submitTest.fulfilled, (s, a) => { s.activeResult = a.payload.result; s.activeTest = null })
     .addCase(deleteTest.fulfilled, (s, a) => { s.list = s.list.filter(t => t._id !== a.payload) })
  }
})
export const { setActiveTest } = testSlice.actions
export default testSlice.reducer
