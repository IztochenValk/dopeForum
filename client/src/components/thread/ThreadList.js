import { useState, useEffect } from 'react';
import { TextField, Grid, Pagination, CircularProgress, Autocomplete, Chip } from '@mui/material';
import ThreadCard from './ThreadCard';
import { fetchThreads } from '../../services/threadService';
import { fetchTags } from '../../services/tagService';
import CreateThreadForm from './CreateThreadForm';

const ThreadList = () => {
    const [threads, setThreads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [threadsPerPage, setThreadsPerPage] = useState(12);
    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [loadingThreads, setLoadingThreads] = useState(false);

    // Fetch available tags from the backend
    useEffect(() => {
        const loadTags = async () => {
            setLoadingTags(true);
            try {
                const tagsData = await fetchTags();
                const formattedTags = tagsData.map((tag, index) =>
                    typeof tag === 'string' ? { id: index, name: tag } : { ...tag, id: tag._id || index }
                );
                setTags(formattedTags);
            } catch (error) {
                console.error('Error loading tags:', error);
            } finally {
                setLoadingTags(false);
            }
        };
        loadTags();
    }, []);

    // Fetch threads based on selected page, limit, and tags
    const loadThreads = async (page, limit, tags) => {
        setLoadingThreads(true);
        const tagParams = tags.length ? `&tags=${tags.join(',')}` : '';
        try {
            const response = await fetch(`/api/threads?page=${page}&limit=${limit}${tagParams}`);
            const data = await response.json();
            setThreads(data.threads || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Error loading threads:', error);
        } finally {
            setLoadingThreads(false);
        }
    };

    // Load threads whenever the selected page, threads per page, or selected tags change
    useEffect(() => {
        loadThreads(currentPage, threadsPerPage, selectedTags);
    }, [currentPage, threadsPerPage, selectedTags]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleThreadsPerPageChange = (e) => {
        const value = Math.max(10, Math.min(50, Number(e.target.value) || 12));
        setThreadsPerPage(value);
        setCurrentPage(1);
    };

    const handleTagChange = (event, newValue) => {
        setSelectedTags(newValue.map((tag) => tag.id));
        setCurrentPage(1);
    };

    return (
        <div>
            {/* Controls for Tags and Threads Per Page */}
            <Grid container spacing={2} alignItems="center">
                {/* Tag Selection with Autocomplete */}
                <Grid item xs={12} md={9}>
                    {loadingTags ? (
                        <CircularProgress size={24} />
                    ) : (
                            <Autocomplete
                                multiple
                                options={tags}
                                getOptionLabel={(option) => option.name}
                                value={tags.filter((tag) => selectedTags.includes(tag.id))}
                                onChange={handleTagChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search and select tags"
                                        variant="outlined"
                                        placeholder="Tags"
                                        fullWidth
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            key={option.id} // Ensure key is applied directly
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />




                    )}
                </Grid>

                {/* Threads Per Page Field */}
                <Grid item xs={12} md={3}>
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

            {/* Thread List */}
            <div className="threads">
                {loadingThreads ? (
                    <CircularProgress size={48} />
                ) : Array.isArray(threads) && threads.length > 0 ? (
                    threads.map((thread) => (
                        <ThreadCard key={thread._id} thread={thread} />
                    ))
                ) : (
                    <div>No threads available</div>
                )}
            </div>

            {/* Pagination Control */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{ marginTop: 2 }}
            />

            {/* Thread Creation Form */}
            <CreateThreadForm />
        </div>
    );
};

export default ThreadList;
