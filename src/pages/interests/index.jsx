import React, { useEffect, useState } from 'react';
import { Grid, Typography, Tabs, Tab, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Chip, CircularProgress, Skeleton, Stack, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import interestService from 'services/interestService';
import { useAuth0 } from '@auth0/auth0-react';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';
import { HeartFilled, HeartOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
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
            notifyError(err.response?.data?.message || t("Error fetching interests"));
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
            notifyError(err.response?.data?.message || t("Error updating status"));
        }
    };

    const handleRemoveInterest = async (email) => {
        try {
            const res = await interestService.toggleInterest({ receiver_email: email });
            if (res.status === 200 || res.status === 201) {
                if(res.data.action === "removed") {
                    notifySuccess("Interest withdrawn successfully");
                    fetchInterests();
                }
            }
        } catch (err) {
            notifyError(err.response?.data?.message || t("Error removing interest"));
        }
    }

    const handleChange = (event, newValue) => setValue(newValue);

    const renderList = (items, type) => (
        <List>
            {items.length === 0 ? (
                <Box sx={{ textAlign: 'center', my: 8 }}>
                    <HeartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                    <Typography variant="h6" color="textSecondary">
                        {t(type === 'sent' ? "You haven't sent any interests yet." : "No interests received yet.")}
                    </Typography>
                </Box>
            ) : (
                items.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem 
                            alignItems="center" 
                            sx={{ 
                                py: 2,
                                borderRadius: '12px',
                                transition: 'background 0.2s',
                                '&:hover': { background: 'rgba(166, 98, 124, 0.05)' }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar 
                                    alt={item.partner_profile?.name} 
                                    src={item.partner_profile?.profile_img?.[0]} 
                                    sx={{ width: 56, height: 56, mr: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        {item.partner_profile?.name}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip 
                                                size="small"
                                                icon={item.status === 'accepted' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                                                label={t(item.status.toUpperCase())}
                                                color={item.status === 'accepted' ? 'success' : 'warning'}
                                                variant="outlined"
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                }
                            />
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {type === 'received' && item.status === 'pending' && (
                                    <>
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            onClick={() => handleUpdateStatus(item.id, 'accepted')}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            {t("Accept")}
                                        </Button>
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            {t("Reject")}
                                        </Button>
                                    </>
                                )}
                                {type === 'sent' && (
                                    <Tooltip title={t("Withdraw Interest")}>
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="error" 
                                            startIcon={<DeleteOutlined />}
                                            onClick={() => handleRemoveInterest(item.partner_profile?.email)}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            {t("Withdraw")}
                                        </Button>
                                    </Tooltip>
                                )}
                            </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))
            )}
        </List>
    );

    const renderSkeletons = () => (
        <List>
            {[1, 2, 3].map((n) => (
                <ListItem key={n} sx={{ py: 2 }}>
                    <ListItemAvatar>
                        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                    </ListItemAvatar>
                    <ListItemText 
                        primary={<Skeleton width="40%" />} 
                        secondary={<Skeleton width="20%" />} 
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <HeartFilled style={{ fontSize: '28px', color: '#A6627C' }} />
                    <Typography variant="h2" sx={{ fontWeight: 800 }}>{t("Your Interests")}</Typography>
                </Box>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    {t("Manage your connections and follow-up on your mutual journey.")}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false} sx={{ borderRadius: '20px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        variant="fullWidth" 
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ 
                            background: 'rgba(166, 98, 124, 0.05)',
                            '& .MuiTab-root': { py: 2, fontWeight: 700 }
                        }}
                    >
                        <Tab label={t("Received")} />
                        <Tab label={t("Sent")} />
                    </Tabs>
                    <Divider />
                    <TabPanel value={value} index={0}>
                        {isLoading ? renderSkeletons() : renderList(interests.received, 'received')}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {isLoading ? renderSkeletons() : renderList(interests.sent, 'sent')}
                    </TabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
}
