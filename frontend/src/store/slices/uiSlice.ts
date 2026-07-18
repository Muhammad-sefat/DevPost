import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  postEditorOpen: boolean
  selectedPostId: string | null
  sidebarCollapsed: boolean
}

const initialState: UiState = {
  postEditorOpen: false,
  selectedPostId: null,
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPostEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.postEditorOpen = action.payload
    },
    setSelectedPostId: (state, action: PayloadAction<string | null>) => {
      state.selectedPostId = action.payload
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    openPostEditor: (state, action: PayloadAction<string>) => {
      state.selectedPostId = action.payload
      state.postEditorOpen = true
    },
    closePostEditor: (state) => {
      state.selectedPostId = null
      state.postEditorOpen = false
    },
  },
})

export const {
  setPostEditorOpen,
  setSelectedPostId,
  setSidebarCollapsed,
  openPostEditor,
  closePostEditor,
} = uiSlice.actions

export default uiSlice.reducer
