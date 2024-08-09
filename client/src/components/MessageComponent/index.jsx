import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../../utils/queries';
import { SEND_MESSAGE } from '../../utils/mutations';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

const MessageComponent = ({ user, recipientId, productId }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [currentUser, setCurrentUser] = useState(user);

    const { data } = useQuery(QUERY_USER, { skip: !!user });

    useEffect(() => {
        if (data && data.user) {
            setCurrentUser(data.user);
        }
    }, [data]);

    const [sendMessage] = useMutation(SEND_MESSAGE);

    console.log('recipient._id', recipientId);

    const handleSendMessage = async () => {
        if (!currentUser) {
            window.alert('Please login to send messages');
            return;
        }

        if (messageText.trim() === '') return;

        const variables = {
            senderId: currentUser._id,
            receiverId: recipientId,
            content: messageText,
            productId
        };

        const invalidVariable = validateVariables(variables);
        if (invalidVariable) {
            console.log(c.red, invalidVariable);
            return;
        }

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
            {/* <TextField
                label="Type a message"
                variant="outlined"
                fullWidth
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button> */}
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