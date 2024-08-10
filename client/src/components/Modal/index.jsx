import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReusableModal = ({ open, handleClose, handleConfirm, handleLogin, message, type }) => {
    if (!open) return null;

    return (
        <div className="modal show d-block bg-" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{message}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {type === 'confirm' ? (
                            <>
                                <button className="btn btn-primary m-2" onClick={handleConfirm}>
                                    Confirm
                                </button>
                                <button className="btn btn-secondary m-2" onClick={handleClose}>
                                    Cancel
                                </button>
                            </>
                        ) : type === 'login' ? (
                            <>
                                <button className="btn btn-primary m-2" onClick={handleLogin}>
                                    Login
                                </button>
                                <button className="btn btn-secondary m-2" onClick={handleClose}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary m-2" onClick={handleClose}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const showModal = (message, args) => {
    const type = args?.type || 'alert';
    return new Promise((resolve) => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const ModalWrapper = () => {
            const [open, setOpen] = useState(true);

            const closeModal = (args) => {
                setOpen(false);
                document.body.removeChild(div);
                if (type === 'login') { window.location.href = '/login'; }
                resolve(args.resolve);
            };

            return (
                <ReusableModal
                    open={open}
                    handleClose={() => closeModal({ resolve: false })}
                    handleConfirm={() => closeModal({ resolve: true })}
                    handleLogin={() => closeModal({ resolve: false })}
                    message={message}
                    type={type}
                />
            );
        };

        const root = createRoot(div);
        root.render(<ModalWrapper />);
    });
};

export { showModal };
export default ReusableModal;