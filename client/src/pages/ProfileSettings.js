import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile, uploadAvatar } from '../services/userService';

const ProfileSettings = () => {
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState({ twitter: '', linkedin: '', github: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await fetchProfile();
                setAvatar(profileData.avatar);
                setBio(profileData.bio);
                setSocialLinks(profileData.socialLinks || {});
                setAvatarPreview(profileData.avatar); // Set preview to existing avatar
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        };
        loadProfile();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview the selected file
        setAvatarPreview(URL.createObjectURL(file));

        try {
            const response = await uploadAvatar(file);
            setAvatar(response.avatar); // Set avatar path from server response
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            setErrorMessage('Failed to upload avatar.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ avatar, bio, socialLinks });
            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    return (
        <div className="profile-settings">
            <h1>Edit Profile</h1>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Avatar:
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </label>
                {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview" />}
                <label>
                    Bio:
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength="500"
                    />
                </label>
                {/* Social links input fields */}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;
