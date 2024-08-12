import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';
import { showModal } from '../components/Modal';

function Login(props) {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            let res = await login({
                variables: { email: formState.email, password: formState.password },
            });
            res = res.data || res
            res = res ? Object.values(res)[0] : null;
    
            if (res.success === false || !res) {
                showModal(res.message || 'An error occurred during signup');
                return
            }

            if(res.token){ Auth.login(res.token); }
        } catch (e) {
            console.log(e);
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
        <div className="container df fg aic">
            <div className="box-1 df flex-column jcc bg-d4 text-white">
                <h2 className=''>Login</h2>
                <form className='df-column p-3 rounded bg-l1 gap-3' onSubmit={handleFormSubmit}>
                    <div className="df flex-column tal ">
                        <label htmlFor="email">Email address:</label>
                        <input className='border'
                            placeholder="youremail@test.com"
                            name="email"
                            type="email"
                            id="email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="df flex-column tal my-2">
                        <label htmlFor="pwd">Password:</label>
                        <input className='border'
                            placeholder="******"
                            name="password"
                            type="password"
                            id="pwd"
                            onChange={handleChange}
                        />
                    </div>
                    {error ? (
                        <div>
                            <p className="error-text">The provided credentials are incorrect</p>
                        </div>
                    ) : null}
                    <div className="df-column ais">
                        <button className="btn-1 m-0 py-1 bg-c1" type="submit">LOG IN</button>
                    </div>
                </form>

                <div>
                    <p>Don't have an account? </p>
                    <Link to="/signup">
                        <button className="btn-1 bg-l2">CREATE NEW</button>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Login;
