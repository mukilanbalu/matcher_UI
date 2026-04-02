import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { CardContent, CardMedia, Box, Button, IconButton } from '@mui/material';
import profileService from 'services/profileService';
import ComponentSkeleton from 'pages/component-overview/ComponentSkeleton';
import { useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileFilters from 'components/filter-panel';
import { calculateAge } from 'utils/appUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import ScrollToTopButton from 'components/scroll-to-top/scroll-top';
import { useTranslation } from 'react-i18next';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import interestService from 'services/interestService';

// DASHBOARD //

export default function DashboardMatcher() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const initialValues = {
        gender: '',
        'astro.nakshatram': '',
        'professional.work_status': '',
        marital_status: '',
        created_on: '',
        'birth.age': [21, 31],
        limit: 5,
        skip: 0

    };

    const [profiles, setProfiles] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [profileFilters, setProfileFilters] = useState(initialValues);
    const [prevLimit, setPrevLimit] = useState(initialValues.limit);
    const [prevSkip, setPrevSkip] = useState(initialValues.skip);
    const { user } = useAuth0();
    const debounceTimeout = 1000;
    const timeoutId = useRef(null);
    const page = useRef(1);
    const scrollParentRef = useRef(null);
    const [interestedProfiles, setInterestedProfiles] = useState(new Set());

    const getProfiles = async (profileFilter, append) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        let payload = Object.entries(profileFilter).reduce((acc, [key, value]) => {
            if ((value && typeof value === 'string' && value.trim()) || (Array.isArray(value) && value.length > 0) || (typeof value === 'number')) {
                acc[key] = value;
            }
            return acc;
        }, {});
        try {
            const res = await profileService.searchProfiles({ filters: { ...payload } });

            if (res.status === 200) {
                if (profileFilter.limit !== prevLimit || profileFilter.skip !== prevSkip) {
                    if (append) {
                        const newProfiles = res.data.data.filter(newProfile =>
                            !profiles.some(existingProfile => existingProfile.email === newProfile.email)
                        );
                        setProfiles((prevProfiles) => [...prevProfiles, ...newProfiles]);
                    } else {
                        setProfiles(res.data.data);
                    }
                    setPrevLimit(profileFilter.limit);
                    setPrevSkip(profileFilter.skip);
                } else {
                    setProfiles(res.data.data);
                }
                setHasMore(!((profileFilter.limit + profileFilter.skip) >= res.data.totalRec));
            } else if (res.status === 204) {
                setProfiles([]);
                setHasMore(false);
            }
            setLoading(false);
        } catch (err) {
            notifyError("Error fetching profiles");
            setLoading(false);
        }
    };

    const loadFunc = () => {
        setProfileFilters({
            ...profileFilters,
            skip: profileFilters.skip + 5,
        });
    }

    useEffect(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
            // No need to reset skip/limit in internal state here as it would re-trigger this effect
            setProfiles([]); // Clear current list on filter change
            getProfiles({ ...profileFilters, skip: 0, limit: 5 });
        }, debounceTimeout);

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [
        profileFilters.gender,
        profileFilters['astro.nakshatram'],
        profileFilters['professional.work_status'],
        profileFilters.marital_status,
        profileFilters.created_on,
        profileFilters['birth.age']
    ]);

    useEffect(() => {
        if (profileFilters.skip > 0) {
            getProfiles(profileFilters, profileFilters.skip > 0);
        }
    }, [profileFilters.limit, profileFilters.skip]);

    // Fetch user's interested profiles on mount
    useEffect(() => {
        const fetchInterestedProfiles = async () => {
            try {
                const res = await interestService.getInterests(user.email);
                if (res.status === 200 && res.data.data) {
                    const interestedEmails = new Set(
                        res.data.data
                            .filter(item => item.sender_email === user.email)
                            .map(item => item.partner_profile?.email)
                    );
                    setInterestedProfiles(interestedEmails);
                }
            } catch (err) {
                console.error("Error fetching interested profiles:", err);
            }
        };

        if (user?.email) {
            fetchInterestedProfiles();
        }
    }, [user]);

    const handleToggleInterest = async (e, profile) => {
        e.stopPropagation(); // Prevent card click

        try {
            const isInterested = interestedProfiles.has(profile.email);

            if (isInterested) {
                // Remove interest
                const res = await interestService.toggleInterest({ receiver_email: profile.email });
                if (res.status === 200) {
                    setInterestedProfiles(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(profile.email);
                        return newSet;
                    });
                    notifySuccess("Interest removed");
                }
            } else {
                // Add interest
                const res = await interestService.toggleInterest({ receiver_email: profile.email });
                if (res.status === 201) {
                    setInterestedProfiles(prev => {
                        const newSet = new Set(prev);
                        newSet.add(profile.email);
                        return newSet;
                    });
                    notifySuccess("Interest sent successfully");
                }
            }
        } catch (err) {
            notifyError("Error updating interest");
            console.error("Error toggling interest:", err);
        }
    };

    const renderProfileCards = (profile) => (
        <MainCard
            content={false}
            boxShadow
            sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                border: "none",
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)',
                borderRadius: '16px',
                ":hover": {
                    boxShadow: '0 20px 40px -12px rgba(166, 98, 124, 0.2)',
                    transform: 'scale(1.02)'
                }
            }}
            onClick={() => navigate("/profile/details", { state: profile })}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                <CardMedia
                    component="img"
                    sx={{ height: 200, objectFit: 'cover' }}
                    image={profile?.profile_img ? `${profile.profile_img[0]}` : ""}
                    alt={profile.name}
                    loading="lazy"
                />
                {/* Profile ID Chip */}
                <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'linear-gradient(45deg, #A6627C 30%, #D9AEBB 90%)',
                    color: 'white',
                    px: 1,
                    py: 0.25,
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 10px rgba(166, 98, 124, 0.3)',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {profile.profile_id || 'CURATED'}
                </Box>
                {/* Floating Heart Icon */}
                <IconButton
                    onClick={(e) => handleToggleInterest(e, profile)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: interestedProfiles.has(profile.email) ? 'rgba(255, 82, 82, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: interestedProfiles.has(profile.email) ? '#fff' : '#A6627C',
                        transition: 'all 0.3s',
                        '&:hover': {
                            background: interestedProfiles.has(profile.email) ? 'rgba(255, 82, 82, 1)' : 'rgba(255, 255, 255, 0.7)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {interestedProfiles.has(profile.email) ?
                        <HeartFilled style={{ fontSize: '14px' }} /> :
                        <HeartOutlined style={{ fontSize: '14px' }} />
                    }
                </IconButton>
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                }} />
                <Typography variant="h6" sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    color: 'white',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: 'calc(100% - 20px)'
                }}>
                    {profile.name}
                </Typography>
            </Box>
            <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                <Typography variant="caption" color="primary.main" sx={{ mb: 1, fontWeight: 700, letterSpacing: '0.1em', display: 'block' }}>
                    {calculateAge(profile?.birth?.dob)} YRS • {profile?.marital_status}
                </Typography>
                <Grid container spacing={0.5}>
                    <Grid item xs={12}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                            <span style={{ fontSize: '10px' }}>📍</span> {profile.professional.location}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                            <span style={{ fontSize: '10px' }}>🎓</span> {profile.professional.education}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );

    const renderMessage = (msg) => (
        <Grid item xs={12} sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
                background: 'rgba(166, 98, 124, 0.1)',
                color: 'primary.main',
                px: 3,
                py: 1,
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                fontWeight: 600
            }}>
                {msg}
            </Box>
        </Grid>
    )


    const [showFilters, setShowFilters] = useState(false);

    return (
        <Grid container rowSpacing={2} columnSpacing={2} >
            <Grid item xs={12} >
                <MainCard
                    border={false}
                    boxShadow
                    sx={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        mb: 2
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showFilters ? 3 : 0 }}>
                        <Typography variant="h3" color="primary">
                            {t("Find Your Soulmate")}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                background: 'linear-gradient(45deg, #A6627C 30%, #D9AEBB 90%)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(166, 98, 124, 0.2)'
                            }}
                        >
                            {showFilters ? t("Hide Filters") : t("Show Filters")}
                        </Button>
                    </Box>
                    {showFilters && <ProfileFilters profileFilters={profileFilters} setProfileFilters={setProfileFilters} />}
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <ComponentSkeleton isLoading={isLoading} >
                    <InfiniteScroll
                        dataLength={profiles.length} //This is important field to render the next data
                        next={loadFunc}
                        hasMore={hasMore}
                        loader={renderMessage(t("Searching for your match..."))}
                        endMessage={renderMessage(t("You've seen all matches!"))}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            flexDirection: "row",
                        }}
                        scrollThreshold={"1px"}

                    >
                        {!isLoading && profiles.length > 0 ?
                            profiles.map((data) =>
                                <Grid item xs={6} sm={4} md={3} lg={2.4} key={data?.email} padding={1} >
                                    {renderProfileCards(data)}
                                </Grid>
                            )
                            :
                            <Grid item xs={12} sm={6} md={6} lg={12} sx={{ minHeight: "70vh" }}>
                                <Typography variant='h4' align='center' mt={"50px"}>
                                    {t("No profile available for the filters")}
                                </Typography>
                            </Grid>
                        }
                    </InfiniteScroll>
                </ComponentSkeleton>
            </Grid>
            <ScrollToTopButton />
        </Grid>
    );
}
