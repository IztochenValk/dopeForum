import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchThreadById, reportThread } from '../services/threadService';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Slide,
    Fade
} from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import './ThreadDetail.css';

const ThreadDetail = () => {
    const { id } = useParams();
    const [thread, setThread] = useState(null);
    const [reason, setReason] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadThread = async () => {
            try {
                const threadData = await fetchThreadById(id);
                setThread(threadData);
            } catch (error) {
                console.error('Failed to load thread:', error);
                setError('Failed to load the thread.');
            } finally {
                setLoading(false);
            }
        };
        loadThread();
    }, [id]);

    const handleReport = async () => {
        if (!reason.trim()) {
            alert('Please provide a reason for reporting this thread.');
            return;
        }

        try {
            await reportThread(id, reason);
            setReportSuccess(true);
            setReason('');
        } catch (error) {
            console.error('Failed to report thread:', error);
            setError('An error occurred while submitting the report.');
        }
    };

    return (
        <Container className="mt-5">
            {loading ? (
                <div className="text-center">
                    <CircularProgress />
                    <Typography variant="h6">Loading thread...</Typography>
                </div>
            ) : thread ? (
                <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
                    <Card className="p-4 shadow-lg thread-detail-card">
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {thread.title}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {thread.content}
                            </Typography>
                        </CardContent>

                        <Fade in={error !== ''}>
                            <Alert severity="error">{error}</Alert>
                        </Fade>

                        <div className="report-thread mt-4">
                            <Typography variant="h5">Report this thread</Typography>
                            {reportSuccess ? (
                                <Fade in={reportSuccess}>
                                    <Alert severity="success" className="mt-2">
                                        Thank you for your report. Our team will review this thread.
                                    </Alert>
                                </Fade>
                            ) : (
                                <Row className="mt-3">
                                    <Col>
                                        <TextField
                                            label="Reason for reporting"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleReport}
                                            className="mt-3"
                                        >
                                            Submit Report
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </Card>
                </Slide>
            ) : (
                <Alert severity="warning">Thread not found</Alert>
            )}
        </Container>
    );
};

export default ThreadDetail;
