import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDashboard, fetchLeads } from '../api/dashboardApi'

export const loadDashboard = createAsyncThunk(
  'dashboard/load',
  async (_, { rejectWithValue }) => {
    try {
      const [data, leads] = await Promise.all([
        fetchDashboard(),
        fetchLeads(0, 500),  // ← 500 leads ek baar mein lo
      ])
      return { data, leads }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    allSessions: [],
    allLeads:    [],
    sessions:    [],
    leads:       [],
    metrics:     {},
    hourly:      { labels: [], inbound: [], outbound: [] },
    campData:    { labels: [], t10: [],     tday: []     },
    collData:    { mens: 0, womens: 0,      couples: 0   },
    timeline:    [],
    loading:     false,
    error:       null,
    lastRefresh: null,
  },
  reducers: {
  filterByFlow: (state, action) => {
  const flow = action.payload
  state.sessions = flow === 'all'
    ? state.allSessions
    : state.allSessions.filter(s => s.flow === flow)

  state.leads = flow === 'all'
    ? state.allLeads
    : state.allLeads.filter(l =>
        !l.flow || l.flow === '' || l.flow === flow  // ← NULL/empty bhi dikhao
      )
},
  },
  extraReducers: (builder) => {
    builder
      // ── SINGLE fulfilled handler ──────────────────────────
      .addCase(loadDashboard.fulfilled, (state, action) => {
        const { data, leads } = action.payload

        state.allSessions = Array.isArray(data.sessions) ? data.sessions : []
        state.allLeads    = Array.isArray(leads)         ? leads         : []

        // Default — show all
        state.sessions    = state.allSessions
        state.leads       = state.allLeads

        state.metrics     = data.metrics  || {}
        state.hourly      = data.hourly   || { labels: [], inbound: [], outbound: [] }
        state.campData    = data.campData || { labels: [], t10: [], tday: [] }
        state.collData    = data.collData || { mens: 0, womens: 0, couples: 0 }
        state.timeline    = Array.isArray(data.timeline) ? data.timeline : []
        state.loading     = false
        state.lastRefresh = new Date().toISOString()
      })
      .addCase(loadDashboard.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  },
})

export const { filterByFlow } = dashboardSlice.actions
export default dashboardSlice.reducer