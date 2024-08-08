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
    button: {
        marginTop: theme.spacing(2),
        alignSelf: 'center',
    },
}));

const ReusableModal = ({ open, handleClose, handleConfirm, message, type }) => {
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
                {type === 'confirm' ? (
                    <>
                        <Button variant="contained" color="primary" onClick={handleConfirm} className={classes.button} >
                            Confirm
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClose} className={classes.button} >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleClose} className={classes.button} >
                        Close
                    </Button>
                )}
            </div>
        </Modal>
    );
};

const showModal = (message, args) => {
    const type = args?.type || 'alert';
    return new Promise((resolve) => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const ModalWrapper = () => {
            const [open, setOpen] = useState(true);

            const handleClose = () => {
                setOpen(false);
                document.body.removeChild(div);
                resolve(false);
            };

            const handleConfirm = () => {
                setOpen(false);
                document.body.removeChild(div);
                resolve(true);
            };

            return (
                <ReusableModal
                    open={open}
                    handleClose={handleClose}
                    handleConfirm={handleConfirm}
                    message={message}
                    type={type}
                />
            );
        };

        ReactDOM.render(<ModalWrapper />, div);
    });
};

export { showModal };
export default ReusableModal;