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
        limit: 12,
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
    const [isInitialized, setIsInitialized] = useState(false);
    const [totalProfiles, setTotalProfiles] = useState(0);
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
                setTotalProfiles(res.data.totalRec || 0);
                setHasMore(!((profileFilter.limit + profileFilter.skip) >= res.data.totalRec));
            } else if (res.status === 204) {
                setProfiles([]);
                setHasMore(false);
            }
            setLoading(false);
        } catch (err) {
            notifyError(err.response?.data?.message || t("Error fetching profiles"));
            setLoading(false);
        }
    };

    const loadFunc = () => {
        setProfileFilters({
            ...profileFilters,
            skip: profileFilters.skip + initialValues.limit,
        });
    }

    useEffect(() => {
        if (!isInitialized) return;

        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
            // No need to reset skip/limit in internal state here as it would re-trigger this effect
            setProfiles([]); // Clear current list on filter change
            getProfiles({ ...profileFilters, skip: 0, limit: initialValues.limit });
        }, debounceTimeout);

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [
        isInitialized,
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

    // Fetch user's profile to set opposite gender default
    useEffect(() => {
        const setGenderDefault = async () => {
            if (user?.email) {
                try {
                    const res = await profileService.getProfile({ email: user.email });
                    if (res.status === 200 && res.data.data) {
                        const myGender = res.data.data.gender; // "Male" or "Female"
                        const opposite = myGender === "Male" ? "Bride" : "Groom";
                        setProfileFilters(prev => ({ ...prev, gender: opposite }));
                    }
                } catch (err) {
                    console.error("Error setting gender default:", err);
                } finally {
                    setIsInitialized(true);
                }
            } else {
                setIsInitialized(true);
            }
        };

        const fetchInterestedProfiles = async () => {
            try {
                const res = await interestService.getInterests(user?.email);
                if (res.status === 200 && res.data.sent) {
                    const interestedEmails = new Set(
                        res.data.sent.map(item => item.partner_profile?.email)
                    );
                    setInterestedProfiles(interestedEmails);
                }
            } catch (err) {
                console.error("Error fetching interested profiles:", err);
            }
        };

        if (user?.email) {
            setGenderDefault();
            fetchInterestedProfiles();
        } else {
            // If no user email, still initialize to show something (or handle guest)
            setIsInitialized(true);
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
            notifyError(err.response?.data?.message || t("Error updating interest"));
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
                border: "1px solid rgba(166, 98, 124, 0.05)",
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                ":hover": {
                    boxShadow: '0 30px 60px -12px rgba(166, 98, 124, 0.15)',
                    transform: 'translateY(-8px)',
                    "& img": { transform: 'scale(1.05)' }
                }
            }}
            onClick={() => navigate("/profile/details", { state: profile })}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: { xs: '4/5', sm: '3/4' } }}>
                <CardMedia
                    component="img"
                    sx={{ 
                        height: '100%', 
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                    }}
                    image={profile?.profile_img ? `${profile.profile_img[0]}` : ""}
                    alt={profile.name}
                    loading="lazy"
                />
                
                {/* Removed Verified Badge */}

                {/* Floating Heart Icon */}
                <IconButton
                    onClick={(e) => handleToggleInterest(e, profile)}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: interestedProfiles.has(profile.email) ? 'rgba(166, 98, 124, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: interestedProfiles.has(profile.email) ? '#fff' : '#A6627C',
                        transition: 'all 0.3s',
                        zIndex: 2,
                        '&:hover': {
                            background: interestedProfiles.has(profile.email) ? 'rgba(166, 98, 124, 1)' : 'rgba(255, 255, 255, 0.9)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {interestedProfiles.has(profile.email) ?
                        <HeartFilled style={{ fontSize: '20px' }} /> :
                        <HeartOutlined style={{ fontSize: '20px' }} />
                    }
                </IconButton>

                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2.5
                }}>
                    <Typography variant="h3" sx={{
                        color: 'white',
                        fontFamily: "'Outfit', 'Noto Sans Tamil', sans-serif",
                        fontSize: { xs: '1.35rem', sm: '1.6rem' },
                        fontWeight: 700,
                        mb: 0.5,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {profile.name}, {calculateAge(profile?.birth?.dob)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 800, fontSize: '0.95rem' }}>
                        {profile.professional.job} • {profile.professional.location}
                    </Typography>
                </Box>
            </Box>
            
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', background: '#fdfdfd' }}>
                <Stack direction="row" spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <StarBorder sx={{ fontSize: 18, color: '#A6627C', opacity: 0.8 }} />
                        <Typography sx={{ fontSize: '0.850rem', fontWeight: 700, color: 'text.secondary' }}>{t(profile.astro.nakshatram) || 'Revati'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <SchoolIcon sx={{ fontSize: 18, color: '#A6627C', opacity: 0.8 }} />
                        <Typography sx={{ fontSize: '0.850rem', fontWeight: 700, color: 'text.secondary' }}>{t(profile.professional.education) || 'Masters'}</Typography>
                    </Box>
                </Stack>
            </Box>
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
        <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
                <MainCard
                    border={false}
                    sx={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        mb: 2,
                        boxShadow: '0 10px 30px -10px rgba(166, 98, 124, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showFilters ? 3 : 0 }}>
                        <Typography variant="h3" sx={{ 
                            color: 'primary.main', 
                            fontWeight: 800,
                            fontFamily: "'Outfit', 'Noto Sans Tamil', sans-serif",
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}>
                                {t("Find Your Soulmate")}
                                {totalProfiles > 0 && (
                                    <Typography 
                                        component="span" 
                                        sx={{ 
                                            ml: 2, 
                                            fontSize: '1rem', 
                                            fontWeight: 600, 
                                            color: '#A6627C',
                                            verticalAlign: 'middle',
                                            background: 'rgba(166, 98, 124, 0.1)',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: '20px'
                                        }}
                                    >
                                        {totalProfiles} {t("MatchesFound")}
                                    </Typography>
                                )}
                            </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                background: 'linear-gradient(135deg, #A6627C 0%, #8a4a63 100%)',
                                borderRadius: '15px',
                                px: 3,
                                py: 1.2,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                boxShadow: '0 8px 20px rgba(166, 98, 124, 0.25)',
                                '&:hover': { opacity: 0.9 }
                            }}
                        >
                            {showFilters ? t("Hide Filters") : t("Show Filters")}
                        </Button>
                    </Box>
                    {showFilters && (
                        <Box sx={{ mt: 2, pt: 3, borderTop: '1px dashed rgba(166, 98, 124, 0.2)' }}>
                            <ProfileFilters profileFilters={profileFilters} setProfileFilters={setProfileFilters} />
                        </Box>
                    )}
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <ComponentSkeleton isLoading={isLoading} >
                    <InfiniteScroll
                        dataLength={profiles.length}
                        next={loadFunc}
                        hasMore={hasMore}
                        loader={renderMessage(t("Curating your next match..."))}
                        endMessage={renderMessage(t("You've seen all matches!"))}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            flexDirection: "row",
                            overflow: 'hidden'
                        }}
                        scrollThreshold={0.9}
                    >
                        {!isLoading && profiles.length > 0 ? (
                            <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', m: 0 }}>
                                {profiles.map((data) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data?.email}>
                                        {renderProfileCards(data)}
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Grid item xs={12} sx={{ minHeight: "60vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant='h4' color="text.secondary">
                                    {t("No profiles found matching your preferences")}
                                </Typography>
                            </Grid>
                        )}
                    </InfiniteScroll>
                </ComponentSkeleton>
            </Grid>
            <ScrollToTopButton />
        </Grid>
    );
}

import { StarBorder, VerifiedUserOutlined } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
