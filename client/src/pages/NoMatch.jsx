import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showModal } from '../components/Modal';

const NoMatch = () => {
    // const navigate = useNavigate();

    useEffect(() => {
        showModal('404 Page Not Found');
        // navigate('/');
    }, []);

    return (
        <div>
            <h1>404 Page Not Found</h1>
            <h1>
                <span role="img" aria-label="Face With Rolling Eyes Emoji">
                    🙄
                </span>
            </h1>
        </div>
    );
};

export default NoMatch;