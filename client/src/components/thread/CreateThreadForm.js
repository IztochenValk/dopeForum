import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createThread, fetchTags } from '../../services/threadService';
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Alert,
    Chip,
    Box,
    FormControl,
    Autocomplete,
    CircularProgress,
} from '@mui/material';

const CreateThreadForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTags, setLoadingTags] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch tags on component mount
    useEffect(() => {
        const loadTags = async () => {
            setLoadingTags(true);
            try {
                const tagsData = await fetchTags();
                // Ensure tags are in { id, name } format if not already
                setTags(tagsData.map((tag, index) => (typeof tag === 'string' ? { id: index, name: tag } : tag)));
            } catch (err) {
                console.error('Failed to fetch tags:', err);
            } finally {
                setLoadingTags(false);
            }
        };
        loadTags();
    }, []);

    const validateInput = () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return false;
        }
        if (!selectedTags.length) {
            setError('Please select at least one tag.');
            return false;
        }
        setError('');
        return true;
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();

        if (!validateInput()) return;

        if (!token) {
            setError('You must be logged in to create a thread.');
            return;
        }

        setLoading(true);
        try {
            const newThread = await createThread({
                title: title.trim(),
                content: content.trim(),
                tags: selectedTags.map((tag) => tag.name), // Pass only tag names
            }, token);

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
                            {loadingTags ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Autocomplete
                                    multiple
                                    options={tags}
                                    getOptionLabel={(option) => option.name} // Display only the name
                                    value={selectedTags}
                                    onChange={(event, newValue) => setSelectedTags(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tags"
                                            variant="outlined"
                                            placeholder="Select tags"
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option.name} // Display only the name
                                                {...getTagProps({ index })}
                                                key={option.id}
                                            />
                                        ))
                                    }
                                />
                            )}
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
        </Box>
    );
};

export default CreateThreadForm;
