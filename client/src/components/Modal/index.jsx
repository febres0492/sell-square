import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    closeButton: {
        marginTop: theme.spacing(2),
        alignSelf: 'center',
    },
}));

const ReusableModal = ({ open, handleClose, message }) => {
    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className={classes.modal}
        >
            <div className={classes.paper}>
                <Typography variant="h6" component="h4">
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClose}
                    className={classes.closeButton}
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

const showModal = (message) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ModalWrapper = () => {
        const [open, setOpen] = useState(true);

        const handleClose = () => {
            setOpen(false);
            document.body.removeChild(div);
        };

        return (
            <ReusableModal
                open={open}
                handleClose={handleClose}
                message={message}
            />
        );
    };

    ReactDOM.render(<ModalWrapper />, div);
};

export { showModal };
export default ReusableModal;

// import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
// import { Modal, Button, TextField, makeStyles } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//     modal: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     paper: {
//         backgroundColor: theme.palette.background.paper,
//         border: '2px solid #000',
//         boxShadow: theme.shadows[5],
//         padding: theme.spacing(2, 4, 3),
//     },
// }));

// const ReusableModal = ({ open, handleClose, handleSendMessage, messageText, setMessageText }) => {
//     const classes = useStyles();

//     return (
//         <Modal
//             open={open}
//             onClose={handleClose}
//             className={classes.modal}
//         >
//             <div className={classes.paper}>
//                 <h2>Send a Message</h2>
//                 <TextField
//                     label="Message"
//                     value={messageText}
//                     onChange={(e) => setMessageText(e.target.value)}
//                     fullWidth
//                 />
//                 <Button variant="contained" color="primary" onClick={handleSendMessage}>
//                     Send
//                 </Button>
//             </div>
//         </Modal>
//     );
// };

// const showModal = (handleSendMessage) => {
//     const div = document.createElement('div');
//     document.body.appendChild(div);

//     const ModalWrapper = () => {
//         const [open, setOpen] = useState(true);
//         const [messageText, setMessageText] = useState('');

//         const handleClose = () => {
//             setOpen(false);
//             document.body.removeChild(div);
//         };

//         return (
//             <ReusableModal
//                 open={open}
//                 handleClose={handleClose}
//                 handleSendMessage={() => {
//                     handleSendMessage(messageText);
//                     handleClose();
//                 }}
//                 messageText={messageText}
//                 setMessageText={setMessageText}
//             />
//         );
//     };

//     ReactDOM.render(<ModalWrapper />, div);
// };

// export { showModal };
// export default ReusableModal;