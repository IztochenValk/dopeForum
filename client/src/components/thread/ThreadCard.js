// src/components/ThreadCard.js
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function ThreadCard({ thread }) {
    const { title, content } = thread;

    return (
        <Card className="mb-4">
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {content}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View Thread</Button>
            </CardActions>
        </Card>
    );
}

export default ThreadCard;
