import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  hydrated: boolean;
  sessionVerified: boolean;
}

interface CredentialsPayload {
  access: string;
  refresh?: string;
  user: any;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
  sessionVerified: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.accessToken = action.payload.access;

      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }

      state.user = action.payload.user;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },

    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
    setSessionVerified: (state, action: PayloadAction<boolean>) => {
      state.sessionVerified = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.hydrated = true;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setRefreshToken,
  setHydrated,
  setSessionVerified,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
