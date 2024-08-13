import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const NoMatch = () => {
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <div className='df flex-column jcc fg aic'>
                <h1 className="d-block">
                    <span  role="img" aria-label="Face With Rolling Eyes Emoji">
                        🙄
                    </span>
                </h1>
                <h1>404 Page Not Found</h1>
                <button className="btn bg-d4 text-white" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        </>
    );
};

export default NoMatch;