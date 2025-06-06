import { useState, useEffect } from 'react';
import { Select, MenuItem, TextField, FormControl } from '@mui/material';
import ThreadList from '../components/thread/ThreadList';

const Forum = () => {
    const [selectedSubforum, setSelectedSubforum] = useState('');
    const [subforums, setSubforums] = useState([]);

    useEffect(() => {
        const fetchSubforums = async () => {
            const response = await fetch('/api/subforums');
            const data = await response.json();
            setSubforums(data);
        };
        fetchSubforums();
    }, []);

    const handleSubforumChange = (e) => {
        setSelectedSubforum(e.target.value);
    };

    return (
        <div>
            <h1>Forum</h1>

            <ThreadList selectedSubforum={selectedSubforum} />
        </div>
    );
};

export default Forum;
