import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../../services/threadService';
import { fetchSubforums } from '../../services/subforumService';

import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Alert,
    MenuItem,
    CircularProgress,
    Slide,
    Box,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';

const CreateThreadForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedSubforum, setSelectedSubforum] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [subforums, setSubforums] = useState([]);
    const navigate = useNavigate();

    // Fetch subforums on component mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const tagsData = await fetchTags(); // Call the fetchTags service
                setTags(tagsData);
            } catch (err) {
                console.error('Failed to fetch tags:', err);
            }
        };
        loadInitialData();
    }, []);


    const handleCreateThread = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim() || !selectedSubforum) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            const newThread = await createThread({
                title: title.trim(),
                content: content.trim(),
                subforum: selectedSubforum,
            });
            navigate(`/threads/${newThread._id}`);
        } catch (err) {
            console.error('Failed to create thread:', err);
            setError('An error occurred while creating the thread.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" mt={5}>
            <Slide direction="down" in mountOnEnter unmountOnExit>
                <Card variant="outlined" sx={{ p: 4, width: '100%', maxWidth: '600px' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Create New Thread</Typography>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={handleCreateThread} noValidate>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                margin="normal"
                            />
                            <TextField
                                label="Content"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="subforum-select-label">Subforum</InputLabel>
                                <Select
                                    labelId="subforum-select-label"
                                    value={selectedSubforum}
                                    onChange={(e) => setSelectedSubforum(e.target.value)}
                                    label="Subforum"
                                    required
                                >
                                    {subforums.map((subforum) => (
                                        <MenuItem key={subforum._id} value={subforum._id}>
                                            {subforum.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Thread'}
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Slide>
        </Box>
    );
};

export default CreateThreadForm;
