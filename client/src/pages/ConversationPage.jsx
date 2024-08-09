import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
    Container, Typography, Button, CircularProgress, Paper, List, ListItem, ListItemText, TextField, Grid, 
    Select, MenuItem, Icon
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { QUERY_USER, QUERY_CONVERSATIONS } from '../utils/queries';
import useSendMessage from '../utils/useSendMessage';
import ifLoggedIn from '../utils/ifLoggedIn';
import Auth from "../utils/auth";
import { showModal } from '../components/Modal'; 

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

function ConversationPage() {
    const { id } = useParams();
    const [messageText, setMessageText] = useState('');
    let { loading, error, data } = useQuery(QUERY_CONVERSATIONS, { variables: { id } });
    let conv = data?.conversation[0] || {};
    console.log(c.red, 'conv', conv);
    
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

    const handleDropdownChange = (event) => {
        setSelectedValue(event.target.value);
    };

    if (loading) return <CircularProgress />;

    if (error) {
        return (
            <Container>
                <Link to="/">
                    <Button variant="contained" color="primary">
                        ← Home
                    </Button>
                </Link>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    if (!conv._id || !conv.participants.length) {
        return <Typography variant="h6" color="error">No conversation found</Typography>;
    }

    const participant = conv.participants.filter(p => p._id !== conv.productId.user._id)[0];

    return (<>
        <Container className='my-4'>
            <Link to="/dashboard">
                <Button variant="contained" color="primary" >
                    ← Dashboard
                </Button>
            </Link>
        </Container>
    
        <Container>
            <Typography variant="h4" gutterBottom>
                Conversation with {participant.firstName} {participant.lastName}
            </Typography>
            <Select value={selectedValue} onChange={handleDropdownChange} displayEmpty IconComponent={MoreVertIcon}>
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
                <MenuItem value="option3">Option 3</MenuItem>
            </Select>
            <Paper>
                <List>
                    {messageList.map((message, i) => {
                        console.log('message', message.receiverId, userData._id, message.receiverId == userData._id);
                        const sendtByMe = message.receiverId != userData._id;
                        const hhmm = formatTime(message.createdAt)
                        return (
                            <Grid container justifyContent={sendtByMe ? 'flex-end' : 'flex-start'} key={`${message._id}_${i}`}>
                                <Grid item xs={8}>
                                    <div className={`${sendtByMe ? 'bg-secondary' : ''}`}>
                                        <Typography variant="body1" color="textPrimary">
                                            {message.text}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {hhmm}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        );
                    })}
                </List>
            </Paper>
            <TextField
                label="Type a message"
                variant="outlined"
                fullWidth
                value={messageText}
                onChange={handleChange}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
        </Container>
    </>);
}

export default ConversationPage;

function formatTime (timestamp){
    const date = new Date(parseInt(timestamp, 10))
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2,'0')
    return `${hours}:${minutes}`
};