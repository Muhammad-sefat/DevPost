import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/types";

// Deliberately minimal: this just mirrors the role for instant UI decisions
// (e.g. sidebar rendering before useMeQuery resolves). The real source of
// truth for "am I logged in" is always the /users/me query + httpOnly cookie.
interface AuthState {
  role: Role | null;
}

const initialState: AuthState = { role: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role | null>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;
