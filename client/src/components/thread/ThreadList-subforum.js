import { useState, useEffect } from 'react';
import { Select, MenuItem, TextField, FormControl, InputLabel, Grid, Pagination } from '@mui/material';
import ThreadCard from './ThreadCard';
import CreateThreadForm from './CreateThreadForm';

const ThreadList = () => {
    const [threads, setThreads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedSubforum, setSelectedSubforum] = useState('');
    const [threadsPerPage, setThreadsPerPage] = useState(12);
    const [subforums, setSubforums] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch subforums from the backend
    useEffect(() => {
        const fetchSubforums = async () => {
            try {
                const response = await fetch('/api/subforums');
                const data = await response.json();
                setSubforums(data);
            } catch (error) {
                console.error("Error fetching subforums:", error);
            }
        };
        fetchSubforums();
    }, []);

    // Fetch threads based on the selected filters
    const fetchThreads = async (page, limit, subforum) => {
        setLoading(true);
        const subforumParam = subforum ? `&subforum=${subforum}` : '';
        try {
            const response = await fetch(`/api/threads?page=${page}&limit=${limit}${subforumParam}`);
            const data = await response.json();
            setThreads(data.threads || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching threads:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update threads when page, threadsPerPage, or selectedSubforum changes
    useEffect(() => {
        fetchThreads(currentPage, threadsPerPage, selectedSubforum);
    }, [currentPage, threadsPerPage, selectedSubforum]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleThreadsPerPageChange = (e) => {
        const value = Math.max(10, Math.min(50, Number(e.target.value) || 12));
        setThreadsPerPage(value);
        setCurrentPage(1);
    };

    const handleSubforumChange = (e) => {
        setSelectedSubforum(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <h1>Threads</h1>
            {/* Controls for Subforum and Threads Per Page */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="subforum-select-label">Subforum</InputLabel>
                        <Select
                            labelId="subforum-select-label"
                            value={selectedSubforum}
                            onChange={handleSubforumChange}
                            label="Subforum"
                        >
                            <MenuItem value="">
                                <em>All Subforums</em>
                            </MenuItem>
                            {subforums.map((subforum) => (
                                <MenuItem key={subforum._id} value={subforum._id}>
                                    {subforum.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Threads per page"
                        type="number"
                        value={threadsPerPage}
                        onChange={handleThreadsPerPageChange}
                        InputProps={{ inputProps: { min: 10, max: 50, step: 1 } }}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* List of Threads */}
            <div className="threads" style={{ marginTop: '16px' }}>
                {loading ? (
                    <p>Loading threads...</p>
                ) : Array.isArray(threads) && threads.length > 0 ? (
                    threads.map((thread) => (
                        <ThreadCard key={thread._id} thread={thread} />
                    ))
                ) : (
                    <div>No threads available</div>
                )}
            </div>

            {/* Pagination Control */}
            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{ marginTop: 2 }}
                />
            )}

            {/* Create New Thread Form */}
            <CreateThreadForm />
        </div>
    );
};

export default ThreadList;
