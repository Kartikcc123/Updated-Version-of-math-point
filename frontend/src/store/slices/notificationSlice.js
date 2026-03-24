import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
  const { data } = await api.get('/notifications'); return data
})
export const fetchMyNotifications = createAsyncThunk('notifications/fetchMy', async () => {
  const { data } = await api.get('/notifications/my'); return data
})
export const createNotification = createAsyncThunk('notifications/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/notifications', payload); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})
export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id) => {
  await api.put(`/notifications/${id}/read`); return id
})
export const deleteNotification = createAsyncThunk('notifications/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/notifications/${id}`); return id }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => { s.list = a.payload.notifications })
     .addCase(fetchMyNotifications.fulfilled, (s, a) => { s.list = a.payload.notifications; s.unreadCount = a.payload.unreadCount })
     .addCase(createNotification.fulfilled, (s, a) => { s.list.unshift(a.payload.notification) })
     .addCase(markNotificationRead.fulfilled, (s, a) => { s.unreadCount = Math.max(0, s.unreadCount - 1) })
     .addCase(deleteNotification.fulfilled, (s, a) => { s.list = s.list.filter(n => n._id !== a.payload) })
  }
})
export default notificationSlice.reducer
