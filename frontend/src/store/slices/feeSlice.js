import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// FEE SLICE
export const fetchFees = createAsyncThunk('fees/fetchAll', async (params) => {
  const { data } = await api.get('/fees', { params }); return data
})
export const fetchMyFees = createAsyncThunk('fees/fetchMy', async () => {
  const { data } = await api.get('/fees/my'); return data
})
export const createFee = createAsyncThunk('fees/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/fees', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const collectPayment = createAsyncThunk('fees/collectPayment', async ({ id, payload }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/fees/${id}/pay`, payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const fetchFeeStats = createAsyncThunk('fees/stats', async () => {
  const { data } = await api.get('/fees/stats'); return data
})

export const feeSlice = createSlice({
  name: 'fees', initialState: { list: [], stats: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFees.pending, (s) => { s.loading = true })
     .addCase(fetchFees.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.fees })
     .addCase(fetchFees.rejected, (s) => { s.loading = false })
     .addCase(fetchMyFees.pending, (s) => { s.loading = true })
     .addCase(fetchMyFees.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.fees })
     .addCase(fetchMyFees.rejected, (s) => { s.loading = false })
     .addCase(fetchFeeStats.fulfilled, (s, a) => { s.stats = a.payload.stats })
     .addCase(createFee.fulfilled, (s, a) => { s.list.unshift(a.payload.fee) })
     .addCase(collectPayment.fulfilled, (s, a) => {
       const i = s.list.findIndex(x => x._id === a.payload.fee._id)
       if (i !== -1) s.list[i] = a.payload.fee
     })
  }
})
export default feeSlice.reducer
