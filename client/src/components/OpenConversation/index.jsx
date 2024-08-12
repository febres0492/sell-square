// import { useEffect, useState, useCallback } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import { QUERY_USER, QUERY_CONVERSATIONS } from '../utils/queries';
// import useSendMessage from '../utils/useSendMessage';
// import ifLoggedIn from '../utils/ifLoggedIn';
// import Auth from "../utils/auth";
// import { showModal } from '../components/Modal';
// import 'bootstrap/dist/css/bootstrap.min.css';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

function ConversationPage() {
    // const { id } = useParams();
    // const [messageText, setMessageText] = useState('');
    // let { loading, error, data } = useQuery(QUERY_CONVERSATIONS, { variables: { id } });
    // let conv = data?.conversation[0] || {};
    // console.log(c.red, 'conv', conv);
    
    // const userData = useQuery(QUERY_USER).data?.user || {};
    
    // const { newMessages, sendMessage } = useSendMessage();
    // const [messageList, setMessagesList] = useState([]);
    // const [selectedValue, setSelectedValue] = useState('');

    // useEffect(() => {
    //     if(!Auth.loggedIn()) { showModal('Please Login First'); }
    // },[])

    // useEffect(() => {
    //     if (conv._id) {
    //         setMessagesList(conv.messages);
    //     }
    // }, [data, newMessages]);

    // const handleSendMessage = useCallback(async () => {
    //     const participant = conv?.participants.filter(p => p._id !== userData._id)[0];
    //     console.log(c.red, 'handleSendMessage participant', participant);
    //     const productId = conv?.productId._id;

    //     const newMessage = await sendMessage({
    //         recipientId: participant._id,
    //         messageText,
    //         productId
    //     });

    //     if (!newMessage) { return }
    //     setMessageText('');

    //     setMessagesList([...messageList, newMessage]);
    // }, [messageText, sendMessage, data]);

    // const handleChange = useCallback((event) => {
    //     setMessageText(event.target.value);
    // }, []);

    // const handleDropdownChange = (event) => {
    //     setSelectedValue(event.target.value);
    // };

    // if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;

    // if (error) {
    //     return (
    //         <div className="container">
    //             <Link to="/">
    //                 <button className="btn btn-primary">
    //                     ← Home
    //                 </button>
    //             </Link>
    //             <div className="text-danger">Error: {error.message}</div>
    //         </div>
    //     );
    // }

    // if (!conv._id || !conv.participants.length) {
    //     return <div className="text-danger">No conversation found</div>;
    // }

    // const participant = conv.participants.filter(p => p._id !== conv.productId.user._id)[0];

    return (<>
        <div className='container my-4'>
            <Link to="/dashboard">
                <button className="btn btn-primary">
                    ← Dashboard
                </button>
            </Link>
        </div>
    
        {/* <div className="container">
            <h4 className="mb-4">
                Conversation with {participant.firstName} {participant.lastName}
            </h4>
            <select className="form-select mb-4" value={selectedValue} onChange={handleDropdownChange}>
                <option value="" disabled>Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            <div className="card mb-4">
                <ul className="list-group list-group-flush">
                    {messageList.map((message, i) => {
                        console.log('message', message.receiverId, userData._id, message.receiverId == userData._id);
                        const sendtByMe = message.receiverId != userData._id;
                        const hhmm = formatTime(message.createdAt)
                        return (
                            <li className="list-group-item" key={`${message._id}_${i}`}>
                                <div className={`d-flex justify-content-${sendtByMe ? 'end' : 'start'}`}>
                                    <div className={`p-2 ${sendtByMe ? 'bg-secondary text-white' : ''}`}>
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
        </div> */}
    </>);
}

export default ConversationPage;

function formatTime (timestamp){
    const date = new Date(parseInt(timestamp, 10))
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2,'0')
    return `${hours}:${minutes}`
};