// src/ImageCarousel.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
} from '@mui/material';
import {
    Close as CloseIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from '@mui/icons-material';


const ImageCarousel = ({ open, handleClose, images }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.primary[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ position: 'relative', textAlign: 'center' }}>
                <Paper square elevation={0} sx={{ padding: 2 }}>
                    {images[activeStep].label}
                </Paper>
                <div>
                    <img
                        src={images[activeStep]}
                        alt={images[activeStep].label}
                        style={{ display: 'block', maxHeight: "80vh", margin: "0 auto" }}
                    />
                </div>
                <IconButton
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: 'translateY(-50%)',
                        backgroundColor: ' rgba(105, 177, 255, 0.4) ',
                        '&:hover': { backgroundColor: '#1677ff' },
                        color: "#fff"
                    }}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        transform: 'translateY(-50%)',
                        backgroundColor: ' rgba(105, 177, 255, 0.4) ',
                        '&:hover': { backgroundColor: '#1677ff' },
                        color: "#fff"

                    }}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCarousel;







