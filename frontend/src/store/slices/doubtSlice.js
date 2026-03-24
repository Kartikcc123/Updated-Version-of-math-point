import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMyDoubts = createAsyncThunk('doubts/fetchMy', async () => {
  const { data } = await api.get('/doubts/my'); return data
})
export const fetchAllDoubts = createAsyncThunk('doubts/fetchAll', async (params) => {
  const { data } = await api.get('/doubts', { params }); return data
})
export const createDoubt = createAsyncThunk('doubts/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/doubts', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const replyToDoubt = createAsyncThunk('doubts/reply', async ({ id, message }) => {
  const { data } = await api.post(`/doubts/${id}/reply`, { message }); return data
})
export const updateDoubtStatus = createAsyncThunk('doubts/updateStatus', async ({ id, status }) => {
  const { data } = await api.put(`/doubts/${id}/status`, { status }); return data
})

const doubtSlice = createSlice({
  name: 'doubts',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMyDoubts.pending, (s) => { s.loading = true })
     .addCase(fetchMyDoubts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.doubts })
     .addCase(fetchAllDoubts.pending, (s) => { s.loading = true })
     .addCase(fetchAllDoubts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.doubts })
     .addCase(createDoubt.fulfilled, (s, a) => { s.list.unshift(a.payload.doubt) })
     .addCase(replyToDoubt.fulfilled, (s, a) => {
       const i = s.list.findIndex(d => d._id === a.payload.doubt._id)
       if (i !== -1) s.list[i] = a.payload.doubt
     })
     .addCase(updateDoubtStatus.fulfilled, (s, a) => {
       const i = s.list.findIndex(d => d._id === a.payload.doubt._id)
       if (i !== -1) s.list[i] = a.payload.doubt
     })
  }
})
export default doubtSlice.reducer
