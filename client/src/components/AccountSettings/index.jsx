import { useState } from 'react';
import { QUERY_USER } from '../../utils/queries';
import { UPDATE_USER } from '../../utils/mutations';
import ifLoggedIn from '../../utils/ifLoggedIn';
import { showModal } from '../../components/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function AccountSettings() {
    const { data: userData, loading: userLoading, error: userError } = ifLoggedIn(QUERY_USER);
    
    const user  = userData?.user || {};

    const [formState, setFormState] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [updateUser] = ifLoggedIn(UPDATE_USER, formState, { isMutation: true });

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
            const res = await updateUser()
            console.log('updateUser data', res);
            if (res.data?.updateUser?._id) {
                // clearing inputs
                setFormState({ ...formState, currentPassword: '', newPassword: '', confirmNewPassword: '' })

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
        <h2>Account Settings</h2>
        // <div className="container my-1">
        //     {user ? (
        //         <div>
        //             <div className="card my-4 p-3">
        //                 <h2> User Info </h2>
        //                 <div>
        //                     <p><strong>First Name:</strong> {user.firstName}</p>
        //                     <p><strong>Last Name:</strong> {user.lastName}</p>
        //                     <p><strong>Email:</strong> {user.email}</p>
        //                 </div>
        //             </div>
        //             <div className="card my-4 p-3">
        //                 <h2> Update User Info </h2>
        //                 <form>
        //                     {fields.map((field) => (
        //                         <div className="mb-3" key={field.name}>
        //                             <label className="form-label">{field.label}</label>
        //                             <input 
        //                                 type={field.type} 
        //                                 className="form-control" 
        //                                 name={field.name} 
        //                                 value={formState[field.name] || ''} 
        //                                 onChange={handleChange} 
        //                             />
        //                         </div>
        //                     ))}
        //                     <button 
        //                         type="button" 
        //                         className="btn btn-primary" 
        //                         onClick={handleUpdateInfo} 
        //                         disabled={isInfoFormEmpty}>
        //                         Update Info
        //                     </button>
        //                 </form>
        //             </div>
        //             <div className="card mb-4 p-3">
        //                 <h2> Update Password </h2>
        //                 <form>
        //                     {passwordFields.map((field) => (
        //                         <div className="mb-3" key={field.name}>
        //                             <label className="form-label">{field.label}</label>
        //                             <input 
        //                                 type={field.type} 
        //                                 className="form-control" 
        //                                 name={field.name} 
        //                                 value={formState[field.name] || ''} 
        //                                 onChange={handleChange} 
        //                             />
        //                         </div>
        //                     ))}
        //                     <button 
        //                         type="button" 
        //                         className="btn btn-primary" 
        //                         onClick={handleUpdatePassword} 
        //                         disabled={isPasswordFormEmpty}>
        //                         Update Password
        //                     </button>
        //                 </form>
        //             </div>
        //         </div>
        //     ) : null}
        // </div>
    );
}

export default AccountSettings;