import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';
import { showModal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Signup(props) {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [addUser] = useMutation(ADD_USER);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        const emptyFields = Object.values(formState).some((field) => field === '');
        if (emptyFields) {
            showModal('All fields are required');
            return;
        }
    
        if (formState.password !== formState.repeatPassword) {
            showModal('Passwords and Repeat Password do not match');
            return;
        }
    
        try {
            let res = await addUser({
                variables: {
                    email: formState.email,
                    password: formState.password,
                    firstName: formState.firstName,
                    lastName: formState.lastName,
                },
            });

            res = res.data || res
            res = res ? Object.values(res)[0] : null;
    
            if (res.success === false || !res) {
                showModal(res.message || 'An error occurred during signup');
                return
            }

            if(res.token){
                Auth.login(res.token);
            }

        } catch (error) {
            console.error(error);
            showModal('An error occurred during signup');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    return (
        <div className="container df fg aic py-4">
            <div className="box-1 df flex-column jcc bg-d4 text-white">

                <h2>Signup</h2>
                <form className='df-column p-3 rounded bg-l1 gap-3' onSubmit={handleFormSubmit}>
                    <div className="df flex-column tal">
                        <label htmlFor="firstName">First Name:</label>
                        <input placeholder="First" name="firstName" type="firstName" id="firstName" onChange={handleChange} />
                    </div>
                    <div className="df flex-column tal">
                        <label htmlFor="lastName">Last Name:</label>
                        <input placeholder="Last" name="lastName" type="lastName" id="lastName" onChange={handleChange} />
                    </div>
                    <div className="df flex-column tal">
                        <label htmlFor="email">Email:</label>
                        <input placeholder="youremail@test.com" name="email" type="email" id="email" onChange={handleChange} />
                    </div>
                    <div className="df flex-column tal">
                        <label htmlFor="pwd">Password:</label>
                        <input placeholder="******" name="password" type="password" id="pwd" onChange={handleChange} />
                    </div>
                    <div className="df flex-column tal">
                        <label htmlFor="pwd">Repeat Password:</label>
                        <input placeholder="******" name="repeatPassword" type="password" id="pwd" onChange={handleChange} />
                    </div>
                    <div className="df-column ais">
                        <button className='btn-1 bg-c1 m-0' type="submit">Create Account</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default Signup;
