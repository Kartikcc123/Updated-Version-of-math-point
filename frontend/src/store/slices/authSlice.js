import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('mp_token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/change-password', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('mp_token'), loading: false, error: null, initialized: !localStorage.getItem('mp_token') },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('mp_token')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(getMe.pending, (s) => { s.loading = true })
      .addCase(getMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.initialized = true })
      .addCase(getMe.rejected, (s) => { s.loading = false; s.token = null; localStorage.removeItem('mp_token'); s.initialized = true })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
