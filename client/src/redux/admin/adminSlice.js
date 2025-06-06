import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        threads: [],
        reports: [],
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setThreads: (state, action) => {
            state.threads = action.payload;
        },
        setReports: (state, action) => {
            state.reports = action.payload;
        },
    },
});

export const { setUsers, setThreads, setReports } = adminSlice.actions;
export default adminSlice.reducer;
