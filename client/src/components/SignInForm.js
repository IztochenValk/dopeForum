import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SignInForm = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        // Handle sign-in logic here
        console.log('Signing in:', email, password);
        closeModal(); // Close the modal after sign-in
    };

    return (
        <Form onSubmit={handleSignIn}>
            <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
                Sign In
            </Button>
        </Form>
    );
};

export default SignInForm;
