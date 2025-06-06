import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import Forum from './pages/Forum';
import ThreadDetail from './pages/ThreadDetail';
import CreateThread from './pages/CreateThread';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header'; // Ensure Header is imported
import theme from './styles/theme'; // Custom Material-UI theme
import './styles/global.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Header /> {/* Place Header here to ensure it appears on all routes */}
                <Container maxWidth="lg" className="main-container">
                    <Routes>
                        <Route path="/" element={<Forum />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/threads/:id" element={<ThreadDetail />} />
                        <Route path="/threads/new" element={<CreateThread />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
