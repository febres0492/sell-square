import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../utils/mutations';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

const useSendMessage = () => {
    const [messages, setMessages] = useState([]);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);

    const sendMessage = async ({ recipientId, messageText, productId }) => {

        if (messageText.trim() === '') return null;

        const variables = {
            receiverId: recipientId,
            content: messageText,
            productId // this is required to find the conversation
        };

        const invalidVariable = validateVariables(variables);
        if (invalidVariable) {
            console.log(c.red, invalidVariable);
            return null;
        }

        console.log(c.yellow, 'variables', variables);

        try {
            const newMessage = await sendMessageMutation({ variables });
            console.log(c.green, 'newMessage', newMessage);

            setMessages([...messages, newMessage]);
            return newMessage.data?.sendMessage;
        } catch (error) {
            console.error('Error sending message:', error);
            return null;
        }
    };

    return { messages, sendMessage };
};

function validateVariables(variables) {
    for (const key in variables) {
        if (!variables[key]) {
            return `Missing field ${key}`;
        }
    }
    return null;
}

export default useSendMessage;