import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activePage:        'overview',
    activeFlow:        'bday_t10',
    sidebarCollapsed:  false,
  },
  reducers: {
    setActivePage:  (state, action) => { state.activePage       = action.payload },
    setActiveFlow:  (state, action) => { state.activeFlow       = action.payload },
    toggleSidebar:  (state)         => { state.sidebarCollapsed = !state.sidebarCollapsed },
  },
})

export const { setActivePage, setActiveFlow, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer