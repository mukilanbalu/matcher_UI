import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const Disclaimer = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px' }}>
                <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                    Disclaimer
                </Typography>
                
                <Box sx={{ mt: 3, textAlign: 'justify' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                        This website is strictly for matrimonial purposes only and is not a dating website. 
                        It should not be used for posting obscene material.
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body1" paragraph>
                        It must be clearly understood that each profile you find in this website is the resultant consequence of a process and procedure, which is expected to be adhered by our clients with due diligence.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>anbupriyal.in</strong> does not engage in any matchmaking whatsoever, and cannot be held responsible in any way for the character and integrity of a person whose profile is found on this site.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        We make no representations regarding the accuracy or significance of any detail of a person found on this website, and cannot be responsible for any abuse that may be done by any third party therewith. Further, the management does not guarantee the accuracy of any person's background gained membership.
                    </Typography>

                    <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                        Limitation of Liability
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Under no circumstances shall anbupriyal.in or its management be liable to the user or any other person for any indirect, special, incidental, or consequential damages of any character including, without limitation, damages resulting from the use of or the inability to use the service.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        We shall not be held responsible for personal or business losses arising from using or not using our services in any way. Please use your own discretion when following our services. Any action taken by the user on the basis of information contained in this site is the user's responsibility alone.
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="body1" paragraph>
                        This site is the property of <strong>anbupriyal.in</strong> and is subject to Indian laws. We reserve the right to make modifications and alterations in the material contained at this site without any prior notice.
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        The responsibility lies on the interested parties to do background checks of the probable Bride or Bridegroom in advance before entering into any nuptial confirmations.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Disclaimer;
