import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_USER_CONVERSATIONS } from '../../utils/queries';
import { SEND_MESSAGE } from '../../utils/mutations';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

const MessageComponent = ({ user, recipientId, productId }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    user = user || useQuery(QUERY_USER).data?.user

    const conversationsData = useQuery(QUERY_USER_CONVERSATIONS).data?.user?.conversations || [];
    const [sendMessage] = useMutation(SEND_MESSAGE);

    console.log('conversationsData', conversationsData);
    // console.log('recipient', recipient);
    // console.log('user._id', user._id);
    console.log('recipient._id', recipientId);

    const handleSendMessage = async () => {
        if(!user){ window.alert('Please login to send messages'); }
        
        if (messageText.trim() === '') return;
        const variables = {
            senderId: user._id,
            receiverId: recipientId,
            content: messageText,
            productId
        }
        
        const invalidVariable = validateVariables(variables);
        if (invalidVariable) { 
            console.log(c.red, invalidVariable);
            return;
        };

        try {
            const { data } = await sendMessage({ variables });
            const newMessage = data.sendMessage.messages[data.sendMessage.messages.length - 1];

            console.log(c.green, 'newMessage', data.sendMessage);

            setMessages([...messages, newMessage]);
            setMessageText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <Typography variant="h6">Messages</Typography>
            {/* <List>
                {messages && messages.map((message, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${message.sender.firstName} ${message.sender.lastName}`}
                            secondary={message.text}
                        />
                    </ListItem>
                ))}
            </List> */}
            <TextField label="Type a message" variant="outlined" fullWidth value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
        </div>
    );
};

function validateVariables(variables) {
    return Object.keys(variables).some(key => {
        if (!variables[key]) {
            return `Missing field ${key}`;
        }
    });
}

export default MessageComponent;