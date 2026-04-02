import React, { useEffect, useState } from 'react';
import { Grid, Typography, Tabs, Tab, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import interestService from 'services/interestService';
import { useAuth0 } from '@auth0/auth0-react';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function InterestsPage() {
    const [value, setValue] = useState(0);
    const [interests, setInterests] = useState({ sent: [], received: [] });
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth0();
    const { t } = useTranslation();

    const fetchInterests = async () => {
        try {
            setIsLoading(true);
            const res = await interestService.getInterests(user.email);
            if (res.status === 200) {
                setInterests(res.data);
            }
        } catch (err) {
            notifyError("Error fetching interests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchInterests();
    }, [user]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await interestService.updateStatus({ interest_id: id, status });
            if (res.status === 200) {
                notifySuccess(`Interest ${status}`);
                fetchInterests();
            }
        } catch (err) {
            notifyError("Error updating status");
        }
    };

    const handleChange = (event, newValue) => setValue(newValue);

    const renderList = (items, type) => (
        <List>
            {items.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ my: 4 }}>
                    {t("No interests found.")}
                </Typography>
            ) : (
                items.map((item) => (
                    <React.Fragment key={item._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={item.profile?.name} src={item.profile?.profile_img?.[0]} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.profile?.name}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            Status: {item.status}
                                        </Typography>
                                        {" — " + new Date(item.created_at).toLocaleDateString()}
                                    </>
                                }
                            />
                            {type === 'received' && item.status === 'pending' && (
                                <Box>
                                    <Button size="small" variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleUpdateStatus(item._id, 'accepted')}>
                                        {t("Accept")}
                                    </Button>
                                    <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateStatus(item._id, 'rejected')}>
                                        {t("Reject")}
                                    </Button>
                                </Box>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))
            )}
        </List>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h3">{t("Your Interests")}</Typography>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <Tabs value={value} onChange={handleChange} variant="fullWidth">
                        <Tab label={t("Received")} />
                        <Tab label={t("Sent")} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {renderList(interests.received, 'received')}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {renderList(interests.sent, 'sent')}
                    </TabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
}
