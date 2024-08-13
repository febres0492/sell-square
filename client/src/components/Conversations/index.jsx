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

    console.log(c.yellow, 'userData', userData);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only"></span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    const conversationsData = Object.values(data)[0] || [];
    console.log(c.yellow, 'conversations', data, conversationsData);

    return (<>
        <div className="container-fluid">
            <div className="col-12 df jcsb aic ">
                <button className="btn-1 bg-c1 m-0" onClick={(e) => goToComp({component:'Products'})}>Back</button>
            </div>
        </div>
    
        <div className="container-fluid">
            <div className="container-box">
                <h3>Conversations</h3>
                <div className="row">
                    {conversationsData.length === 0 ?
                        <div className="col">
                            <h6>No Conversations</h6>
                        </div>
                        :
                        (conversationsData.map(con => {
                            const participant = con.participants.filter(p => p._id !== userData._id)[0];
                            const fistLast = `${participant.firstName} ${participant.lastName}`;
                            console.log('participant', fistLast);

                            return (
                                <div className="col-12 col-md-6 col-lg-4 mb-3 pointer" key={con._id} style={{'--hover-scale':'1.03'}}>
                                    <div className="d-flex rounded bg-d4 overflow-hidden" onClick={()=>goToComp({component:'OpenConversation', id: con._id})}>
                                        <div className="img-div" style={{width:'80px'}}>
                                            <img
                                                src={con.productId.image || 'https://via.placeholder.com/150'}
                                                className="card-img-left"
                                                alt={con.productId.name || 'Image title'}
                                            />
                                        </div>
                                        <div className="d-flex-column p-2 tal">
                                            <h4 className="m-0">{fistLast}</h4>
                                            <h5 className="m-0">{con.productId.name}</h5>
                                        </div>
                                    </div>
                                </div>
                            )
                        })) }
                </div>
            </div>
        </div>
    </>);
}

export default Conversations;