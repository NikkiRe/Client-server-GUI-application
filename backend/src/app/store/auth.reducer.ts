import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  token: null
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { userId, token }) => ({
    ...state,
    isAuthenticated: true,
    userId,
    token
  })),
  on(logout, () => initialState)
);
