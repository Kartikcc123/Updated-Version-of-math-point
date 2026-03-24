import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// MATERIAL SLICE
export const fetchMaterials = createAsyncThunk('materials/fetchAll', async (params) => {
  const { data } = await api.get('/materials', { params }); return data
})
export const fetchMyMaterials = createAsyncThunk('materials/fetchMy', async () => {
  const { data } = await api.get('/materials/my'); return data
})
export const uploadMaterial = createAsyncThunk('materials/upload', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/materials', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const deleteMaterial = createAsyncThunk('materials/delete', async (id) => {
  await api.delete(`/materials/${id}`); return id
})

export const materialSlice = createSlice({
  name: 'materials',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMaterials.pending, (s) => { s.loading = true })
     .addCase(fetchMaterials.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.materials })
     .addCase(fetchMyMaterials.fulfilled, (s, a) => { s.list = a.payload.materials })
     .addCase(uploadMaterial.fulfilled, (s, a) => { s.list.unshift(a.payload.material) })
     .addCase(deleteMaterial.fulfilled, (s, a) => { s.list = s.list.filter(m => m._id !== a.payload) })
  }
})
export default materialSlice.reducer
