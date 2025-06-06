import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread, fetchTags } from '../services/threadService';
import { fetchSubforums } from '../services/subforumService';
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
    Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from 'react-bootstrap';
import './CreateThread.css';

// Styled component to add custom styling
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    marginTop: theme.spacing(2),
    '& .MuiAutocomplete-inputRoot': {
        padding: theme.spacing(1),
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiAutocomplete-option': {
        padding: theme.spacing(1.5),
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiAutocomplete-listbox': {
        maxHeight: 200,
        backgroundColor: theme.palette.background.paper,
    },
    '& .MuiAutocomplete-paper': {
        boxShadow: theme.shadows[5],
    },
}));

const CreateThread = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [subforums, setSubforums] = useState([]); // List of subforums
    const [selectedSubforum, setSelectedSubforum] = useState(null); // Selected subforum
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTagsAndSubforums = async () => {
            try {
                const tagsData = await fetchTags();
                setTags(tagsData);
                const subforumsData = await fetchSubforums();
                setSubforums(subforumsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        loadTagsAndSubforums();
    }, []);

    const handleCreateThread = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title.trim() || !content.trim() || !selectedSubforum) {
            setError('Title, content, and subforum selection are required.');
            setLoading(false);
            return;
        }

        try {
            const newThread = await createThread({
                title,
                content,
                tags: selectedTags,
                subforum: selectedSubforum._id,
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
        <Container className="mt-5">
            <Slide direction="down" in mountOnEnter unmountOnExit>
                <Card className="p-4 shadow-lg create-thread-card">
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Create New Thread
                        </Typography>
                        {error && (
                            <Alert severity="error" className="mb-3">
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={handleCreateThread}>
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
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                margin="normal"
                            />

                            {/* Styled Autocomplete for Subforums */}
                            <StyledAutocomplete
                                options={subforums}
                                getOptionLabel={(option) => option.name}
                                value={selectedSubforum}
                                onChange={(e, newValue) => setSelectedSubforum(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Subforum"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        required
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                            />

                            <TextField
                                label="Tags"
                                variant="outlined"
                                fullWidth
                                select
                                SelectProps={{ multiple: true }}
                                value={selectedTags}
                                onChange={(e) => setSelectedTags(e.target.value)}
                                margin="normal"
                            >
                                {tags.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.name}>
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Thread'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Slide>
        </Container>
    );
};

export default CreateThread;
