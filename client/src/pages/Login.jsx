import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

function Login(props) {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const mutationResponse = await login({
                variables: { email: formState.email, password: formState.password },
            });
            const token = mutationResponse.data.login.token;
            Auth.login(token);
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
        <div className="container my-1">
            <div className="login-box df flex-column jcc border">
                <h2 className=''>Login</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="df flex-column tal  my-4">
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
                    <div className="d-flex flex-column ais border">
                        <button className=' btn-1' type="submit">LOG IN</button>
                    </div>
                </form>

                <div>
                    <p>Don't have an account? </p>
                    <Link to="/signup">
                        <button className="btn btn-sm border">CREATE NEW</button>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Login;
