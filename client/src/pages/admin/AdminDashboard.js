import React, { useEffect, useState } from 'react';
import { fetchReports, resolveReport, deleteThread, lockThread } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const reportData = await fetchReports();
                setReports(reportData);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, []);

    const handleResolve = async (reportId) => {
        try {
            await resolveReport(reportId);
            setReports(reports.filter((report) => report._id !== reportId));
        } catch (error) {
            console.error('Failed to resolve report:', error);
        }
    };

    const handleDeleteThread = async (threadId) => {
        try {
            await deleteThread(threadId);
            setReports(reports.filter((report) => report.thread._id !== threadId));
        } catch (error) {
            console.error('Failed to delete thread:', error);
        }
    };

    const handleLockThread = async (threadId) => {
        try {
            await lockThread(threadId);
            setReports(
                reports.map((report) =>
                    report.thread._id === threadId ? { ...report, thread: { ...report.thread, locked: true } } : report
                )
            );
        } catch (error) {
            console.error('Failed to lock thread:', error);
        }
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Reporter</th>
                        <th>Thread Title</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id}>
                            <td>{report.reporter.username}</td>
                            <td>{report.thread.title}</td>
                            <td>{report.reason}</td>
                            <td>
                                {!report.thread.locked && (
                                    <button onClick={() => handleLockThread(report.thread._id)}>Lock Thread</button>
                                )}
                                <button onClick={() => handleDeleteThread(report.thread._id)}>Delete Thread</button>
                                <button onClick={() => handleResolve(report._id)}>Resolve Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
