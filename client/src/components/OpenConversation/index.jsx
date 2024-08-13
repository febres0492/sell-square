import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_CONVERSATIONS } from '../../utils/queries';
import useSendMessage from '../../utils/useSendMessage';
// import ifLoggedIn from '../../utils/ifLoggedIn';
import Auth from "../../utils/auth";
import { showModal } from '../../components/Modal';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function ConversationPage(props) {
    const { id } = props;
    const navigate = useNavigate();    
    const [messageText, setMessageText] = useState('');
    let { loading, error, data } = useQuery(QUERY_CONVERSATIONS, { variables: { id } });
    let conv = data?.conversation[0] || {};
    
    const userData = useQuery(QUERY_USER).data?.user || {};
    
    const { newMessages, sendMessage } = useSendMessage();
    const [messageList, setMessagesList] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        if(!Auth.loggedIn()) { showModal('Please Login First'); }
    },[])

    useEffect(() => {
        if (conv._id) {
            setMessagesList(conv.messages);
        }
    }, [data, newMessages]);

    const handleSendMessage = useCallback(async () => {
        const participant = conv?.participants.filter(p => p._id !== userData._id)[0];
        console.log(c.red, 'handleSendMessage participant', participant);
        const productId = conv?.productId._id;

        const newMessage = await sendMessage({
            recipientId: participant._id,
            messageText,
            productId
        });

        if (!newMessage) { return }
        setMessageText('');

        setMessagesList([...messageList, newMessage]);
    }, [messageText, sendMessage, data]);

    const handleChange = useCallback((event) => {
        setMessageText(event.target.value);
    }, []);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;

    if (error) {
        return (
            <div className="container-fluid">
                <div className="col-12 df jcsb aic ">
                    <button className="btn-1 bg-c1 m-0" onClick={(e) => navigate('/dashboard/Conversations')}>Back</button>
                    <div className="text-danger">Error: {error.message}</div>
                </div>
            </div>
        );
    }

    if (!conv._id || !conv.participants.length) {
        return (<div className="container-fluid">
            <div className="col-12 df jcsb aic ">
                <button className="btn-1 bg-c1 m-0" onClick={(e) => navigate('/dashboard/Conversations')}>Back</button>
                <div className="text-danger">No conversation found</div>
            </div>
        </div>)
    }

    const participant = conv.participants.filter(p => p._id !== conv.productId.user._id)[0];

    return (<>
        <div className="container-fluid">
            <div className="col-12 df jcsb aic ">
                <button className="btn-1 bg-c1 m-0" onClick={(e) => navigate('/dashboard/Conversations')}>Back</button>
                <div class="drop-menu rel">
                    <button class="btn-1 btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                        Options
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2"
                        style={{ top: '100%', right: '0px', }}
                    >
                        <li><a class="dropdown-item active" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                        <li><hr class="dropdown-divider"/></li>
                        <li><a class="dropdown-item" href="#">Separated link</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div className="container-fluid">
            <div className="container-box ">
                <div className="container">
                    <h4 className="mb-4">
                        {participant.firstName} {participant.lastName}
                    </h4>
                    <div className="mb-4">
                        <ul className="p-0">
                        {/* <ul className="list-group list-group-flush"> */}
                            {messageList.map((message, i) => {
                                console.log('message', message.receiverId, userData._id, message.receiverId == userData._id);
                                const sendtByMe = message.receiverId != userData._id;
                                const hhmm = formatTime(message.createdAt)

                                if(message.text === '--startconversation' || message.text === 'I am interested in your product') {
                                    return ''
                                }
                                return (
                                    <li className="list-group-item mb-3" key={`${message._id}_${i}`}>
                                        <div className={`d-flex justify-content-${sendtByMe ? 'end' : 'start'}`}>
                                            <div className={`p-2 rounded text-white ${sendtByMe ? 'bg-c1' : 'bg-secondary'}`}>
                                                <div>{message.text}</div>
                                                <small className="text-muted">{hhmm}</small>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message"
                            value={messageText}
                            onChange={handleChange}
                        />
                        <button className="btn btn-primary" onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
                
    </>);
}

export default ConversationPage;

function formatTime (timestamp){
    const date = new Date(parseInt(timestamp, 10))
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2,'0')
    return `${hours}:${minutes}`
};