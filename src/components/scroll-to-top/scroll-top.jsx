import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material'; // Using Material-UI for the button
import { KeyboardArrowUp } from '@mui/icons-material'; // Icon for the button

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to a certain distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div>
            {isVisible && (
                <Fab
                    color="primary"
                    aria-label="scroll to top"
                    onClick={scrollToTop}
                    style={styles.scrollButton}
                >
                    <KeyboardArrowUp />
                </Fab>
            )}
        </div>
    );
};

const styles = {
    scrollButton: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
    }
};

export default ScrollToTopButton;
