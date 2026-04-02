import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px' }}>
                <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                    Privacy Policy
                </Typography>
                
                <Box sx={{ mt: 3, textAlign: 'justify' }}>
                    <Typography variant="body1" paragraph>
                        This electronic website is being operated and owned by <strong>www.anbupriyal.in</strong>. This PRIVACY POLICY STATEMENT is made/published in the internet web site to protect the user's privacy and it is connected to our terms and conditions.
                    </Typography>

                    <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                        Data Collection & Security
                    </Typography>
                    <Typography variant="body1" paragraph>
                        A user/member, when he is entering our web site after accepting our full terms and conditions of www.anbupriyal.in should provide the mandatory information, he has the option of not providing the information which is not mandatory. User/Member is solely responsible for maintaining confidentiality of the User Name/Identity and User Password and all activities and transmission/transactions performed by the User through his/her user identity/name.
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                        www.anbupriyal.in assumes no responsibility / liability for improper use of information relating to such usage of credit/debit cards used by the subscriber online/offline.
                    </Typography>

                    <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                        Usage of Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        www.anbupriyal.in is connected / link to service partners, such as servers/administrators. We may use your IP address and other information provided like Email address, Contact name, User-created password, Address, Pin code, Telephone number etc; to help diagnose problems with our server, and to manage our Web site.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Your IP address may be also used to gather broad demographic information. The information will be used by us to contact you and to deliver information to you that are targeted to your interests. By using the site, you accept our terms and conditions and privacy policy.
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                        Disclosure
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Unless otherwise you give your consent, we do not sell, rent, share, trade or give away your data to third parties. Contact information for profiles will only be displayed as per site settings and user requests.
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 4, fontWeight: 600 }}>
                        Contact : info@anbupriyal.in for further clarifications.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PrivacyPolicy;
