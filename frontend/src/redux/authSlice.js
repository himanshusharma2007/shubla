import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        signUp : (state, action) => {
            const user = action.payload;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
            state.isAuthenticated = true;
            state.error = null;
        },
        login: (state, action) => {
            const {email, password} = action.payload;
            const storedUser = localStorage.getItem(JSON.stringify('user'));
            if(storedUser && storedUser.email === email && storedUser.password === password) {
                state.user = storedUser;
                state.isAuthenticated = true;
                state.error = null;
            } else {
                state.isAuthenticated = false;
                state.error = "Invalid Credentials";
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('user')
        },
    },
});

export const {login, logout, signUp} = authSlice.actions;
export default authSlice.reducer;