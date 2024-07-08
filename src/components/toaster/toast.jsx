// ToastNotification.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
    return (
        <ToastContainer position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
};

// Helper functions for different types of notifications
export const notifySuccess = (message) => {
    toast.success(message);
};

export const notifyError = (message) => {
    toast.error(message);
};

export const notifyInfo = (message) => {
    toast.info(message);
};

export const notifyWarning = (message) => {
    toast.warning(message);
};

export default ToastNotification;
