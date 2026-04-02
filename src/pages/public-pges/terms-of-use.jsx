import React from 'react';
import { Container, Typography, Box, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TermsOfUse = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px' }}>
                <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                    Terms & Conditions
                </Typography>
                
                <Box sx={{ mt: 3, textAlign: 'justify' }}>
                    <Typography variant="body1" paragraph>
                        Welcome to <strong>anbupriyal.in</strong>. In order to use the anbupriyal.in Site ("Site"), you must Register as a member of the Site ("Member") and agree to be bound by these Terms of Use ("Agreement").
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>1. Eligibility</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    You must be at least 18 years of age or over to Register as a member of anbupriyal.in or use this Site. Membership to the Site is void where prohibited. Your use of this Site represents and warrants that you have the right, authority, and capacity to enter into this Agreement. This site is not meant to encourage and/or promote illicit sexual relations or extra marital affairs.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>2. Term</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    This Agreement will remain in full force and effect while you use the Site and/or are a Member of anbupriyal.in. You may terminate your membership at any time, for any reason by informing anbupriyal.in in writing.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>3. Non-Commercial Use</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    The anbupriyal.in Site is for the personal use of individual members only, and may not be used in connection with any commercial endeavors. Organizations, companies, and/or businesses may not become Members.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>4. Proprietary Rights</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    anbupriyal.in owns and retains all proprietary rights in the Site and the Service. The Site contains copyrighted material, trademarks, and other proprietary information.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>5. Content Posted on the Site</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    Newly created profiles will be checked for correctness. anbupriyal.in reserves the right to discontinue or lead to deactivate profiles if content is deemed unacceptable. Members agree they are legally eligible to marry.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="body2" color="text.secondary" paragraph>
                        This Agreement contains the entire agreement between you and anbupriyal.in regarding the use of the Site and/or the Service.
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', fontWeight: 600 }}>
                        Please contact us with any questions regarding this Agreement.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsOfUse;
