import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_CONVERSATIONS } from '../../utils/queries';
import 'bootstrap/dist/css/bootstrap.min.css';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function Conversations(props) {
    const selectComponent = props.selectComponent
    const goToComp = (args) => { if (selectComponent) { selectComponent(args) } }

    const userData = useQuery(QUERY_USER).data?.user || {};
    const { loading, error, data, refetch } = useQuery(QUERY_CONVERSATIONS, { variables: { userId: userData._id } });

    useEffect(() => { refetch(); }, [refetch]);

    console.log(c.yellow, 'userData', data);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only"></span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    const conversationsData = Object.values(data)[0] || [];
    console.log(c.yellow, 'conversations', data, conversationsData);

    return (
        <div className="container-fluid">
            <div className="container-box">
                <h5>Conversations</h5>
                <div className="row">
                    {conversationsData.length === 0 ?
                        <div className="col">
                            <h6>No Conversations</h6>
                        </div>
                        :
                        (conversationsData.map(con => {
                            const participant = con.participants;
                            const fistLast = participant.firstName || '' + ' ' + participant.lastName || '';
                            console.log('participant', participant);

                            return (
                                <div className="col-6 col-md-6 col-lg-4 mb-3" key={con._id}>
                                    <div className="card" onClick={()=>goToComp({component:'OpenConversation', id: con._id})}>
                                        <img
                                            src={con.productId.image || 'https://via.placeholder.com/150'}
                                            className="card-img-top"
                                            alt={con.productId.name || 'Image title'}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{con.productId.name}</h5>
                                            <p className="card-text">{con.productId.description}</p>
                                        </div>
                                    </div>
                                    <Link to={`/conversation/${con._id}`}>
                                    </Link>
                                    {/* <Link to={`/conversation/${con._id}`}>
                                        <div className="card">
                                            <img
                                                src={con.productId.image || 'https://via.placeholder.com/150'}
                                                className="card-img-top"
                                                alt={con.productId.name || 'Image title'}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{con.productId.name}</h5>
                                                <p className="card-text">{con.productId.description}</p>
                                            </div>
                                        </div>
                                    </Link> */}
                                </div>
                            )
                        })) }
                </div>
            </div>
        </div>
    );
}

export default Conversations;