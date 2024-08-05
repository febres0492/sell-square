import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Container, Typography, Button, CircularProgress, Paper, List, ListItem, ListItemText, TextField,
} from '@material-ui/core';
import { QUERY_CONVERSATIONS } from '../utils/queries';
import useSendMessage from '../utils/useSendMessage';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    backButton: {
        marginBottom: theme.spacing(2),
    },
}));

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

function ConversationPage() {
    const classes = useStyles();
    const { id } = useParams();
    const [messageText, setMessageText] = useState('');
    const { loading, error, data } = useQuery(QUERY_CONVERSATIONS, { variables: { id } });
    const { messages, sendMessage } = useSendMessage();

    if (loading) return <CircularProgress />;

    if (error) {
        return (
            <Container className={classes.container}>
                <Link to="/" className={classes.backButton}>
                    <Button variant="contained" color="primary" className={classes.backButton}>
                        ← Back to Products
                    </Button>
                </Link>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    console.log(c.yellow, 'data', data);

    let conv = data?.conversation || {};

    if (!conv || !conv.participants.length) {
        return <Typography variant="h6" color="error">No conversation found</Typography>;
    }

    console.log('conversation, messages', conv.messages.map(m => m.text));
    console.log(c.red,'messages', messages);

    const productId = conv.productId._id;
    const participant = conv ? conv.participants.filter(p => p._id !== conv.productId.user._id)[0] : null;

    const handleSendMessage = async () => {
        const newMessage = await sendMessage({
            recipientId: participant._id,
            messageText,
            productId
        });

        if (newMessage) {
            setMessageText('');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Conversation with {conv.participants.map(p => p.firstName).join(', ')}
            </Typography>
            <Paper>
                <List>
                    {conv.messages.map(message => (
                        <ListItem key={message._id}>
                            <ListItemText primary={message.text} secondary={message.createdAt} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <TextField
                label="Type a message"
                variant="outlined"
                fullWidth
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
        </Container>
    );
}

export default ConversationPage;