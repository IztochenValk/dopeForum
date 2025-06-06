// client/src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from '../auth/authSlice'; // Adjust paths based on your structure
import adminReducer from '../admin/adminSlice'; // Adjust paths based on your structure

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    // Add other reducers as needed
});

export default rootReducer;
