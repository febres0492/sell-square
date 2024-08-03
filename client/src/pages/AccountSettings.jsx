import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

function OrderHistory() {
    const { data } = useQuery(QUERY_USER);
    let user;

    if (data) {
        user = data.user;
        console.log('user', user);
    }

    return (
        <>
            <div className="container my-1">
                <Link to="/">← Back to Products</Link>

                {user ? (
                    <>
                        <h2>
                            Account Settings for {user.firstName} {user.lastName}
                        </h2>
                    </>
                ) : null}
            </div>
        </>
    );
}

export default OrderHistory;
