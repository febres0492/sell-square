import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Typography, Button, Box, Container, Paper } from '@material-ui/core';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';
import ifLoggedIn from '../utils/ifLoggedIn';
import { showModal } from '../components/Modal';

function AccountSettings() {
    const { data: userData, loading: userLoading, error: userError } = ifLoggedIn(QUERY_USER);
    const user = userData?.user || {};
    const [formState, setFormState] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const { 
        mutateFunction: updateUser, loading: updateLoading, error: updateError, data: updateData 
    } = ifLoggedIn(UPDATE_USER, formState, { isMutation: true });

    const removeEmptyKeys = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== ''));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormState = { ...formState, [name]: value };
        const cleanedFormState = removeEmptyKeys(updatedFormState);
        setFormState(cleanedFormState);
    };

    const handleUpdateInfo = async () => {
        try {
            const res = await updateUser();
            console.log('res', res);

            if (res.data) { showModal('User info updated successfully'); }
        } catch (error) {
            showModal(error.message);
        }
    };

    const handleUpdatePassword = async () => {
        if (formState.newPassword !== formState.confirmNewPassword) {
            showModal('New passwords do not match');
            return;
        }

        try {
            const { data } = await updateUser();
            if (data) {
                showModal('Password updated successfully');
            }
        } catch (error) {
            showModal(error.message);
        }
    };

    if (userLoading) return <p>Loading...</p>;
    if (userError) return <p>{userError.message}</p>;

    const fields = [
        { label: 'First Name', name: 'firstName', type: 'text' },
        { label: 'Last Name', name: 'lastName', type: 'text' },
        // { label: 'Email', name: 'email', type: 'email' }
    ];

    const passwordFields = [
        { label: 'Current Password', name: 'currentPassword', type: 'password' },
        { label: 'New Password', name: 'newPassword', type: 'password' },
        { label: 'Confirm New Password', name: 'confirmNewPassword', type: 'password' }
    ];

    const isInfoFormEmpty = !formState.firstName && !formState.lastName;
    const isPasswordFormEmpty = !formState.currentPassword || !formState.newPassword || !formState.confirmNewPassword;

    return (
        <div className="container my-1">
            {user ? (
                <Container>
                    <Paper className="my-4 p-3" elevation={3}>
                        <h2> User Info </h2>
                        <Box component="div" noValidate autoComplete="off">
                            <Typography variant="body1"><strong>First Name:</strong> {user.firstName}</Typography>
                            <Typography variant="body1"><strong>Last Name:</strong> {user.lastName}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                        </Box>
                    </Paper>
                    <Paper className="my-4 p-3" elevation={3}>
                        <h2> Account Settings </h2>
                        <Box component="form" noValidate autoComplete="off">
                            {fields.map((field) => (
                                <TextField key={field.name} label={field.label} variant="filled" name={field.name}
                                    value={formState[field.name] || ''} onChange={handleChange} fullWidth margin="normal" type={field.type}
                                />
                            ))}
                            <Button variant="contained" color="primary" onClick={handleUpdateInfo} disabled={isInfoFormEmpty}>
                                Update Info
                            </Button>
                        </Box>
                    </Paper>
                    <Paper elevation={3} className="mb-4 p-3">
                        <h2> Update Password </h2>
                        <Box component="form" noValidate autoComplete="off">
                            {passwordFields.map((field) => (
                                <TextField key={field.name} label={field.label} variant="filled" type={field.type} name={field.name}
                                    value={formState[field.name] || ''} onChange={handleChange} fullWidth margin="normal"
                                />
                            ))}
                            <Button variant="contained" color="primary" onClick={handleUpdatePassword} disabled={isPasswordFormEmpty}>
                                Update Password
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            ) : null}
        </div>
    );
}

export default AccountSettings;