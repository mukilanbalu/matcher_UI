import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { CardContent, CardMedia } from '@mui/material';
import profileService from 'services/profileService';
import ComponentSkeleton from 'pages/component-overview/ComponentSkeleton';
import { useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileFilters from 'components/filter-panel';
import { calculateAge } from 'utils/appUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { notifyError } from 'components/toaster/toast';
import ScrollToTopButton from 'components/scroll-to-top/scroll-top';
import { useTranslation } from 'react-i18next';
import { Box, Divider } from '@mui/material';

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
        setProfileFilters({
            ...profileFilters,
            skip: 0,
            limit: 5,
        })

        timeoutId.current = setTimeout(() => {
            setProfileFilters((prevFilters) => ({
                ...prevFilters,
                skip: 0,
                limit: 5,
            }));
            setProfiles([])
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

    const renderProfileCards = (profile) => (
        <MainCard
            content={false}
            sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                borderRadius: '12px',
                overflow: 'hidden',
                transition: '0.3s',
                "&:hover": {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                },
                border: "1px solid #eee"
            }}
            onClick={() => navigate("/profile/details", { state: profile })}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{ height: 260, objectFit: 'cover' }}
                    image={profile?.profile_img ? `${profile.profile_img[0]}` : ""}
                    alt={profile.name}
                    loading="lazy"
                />
            </Box>
            <CardContent sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {profile.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {calculateAge(profile?.birth?.dob)} yrs • {profile?.marital_status}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={0.5}>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            📍 {profile.professional.location}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            🎓 {profile.professional.education}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );

    const renderMessage = (msg, color) => (<Grid item xs={12} sx={{ background: color }}>
        <Typography variant="h6" align='center'>{msg} </Typography>
    </Grid>)


    return (
        <Grid container rowSpacing={2} columnSpacing={2} >
            <Grid item xs={12} >
                <MainCard border={false} shadow={3} boxShadow>
                    <ProfileFilters profileFilters={profileFilters} setProfileFilters={setProfileFilters} />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <ComponentSkeleton isLoading={isLoading} >
                    <InfiniteScroll
                        dataLength={profiles.length} //This is important field to render the next data
                        next={loadFunc}
                        hasMore={hasMore}
                        loader={renderMessage("Loading more Data", "#fffbe6")}
                        endMessage={renderMessage("No more Data Available !", "#fffbe6")}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            flexDirection: "row",
                            // marginTop: " -36px",
                            // marginLeft: "-22px",
                        }}
                        scrollThreshold={"1px"}

                    >
                        {!isLoading && profiles.length > 0 ?
                            profiles.map((data) =>
                                <Grid item xs={12} sm={6} md={6} lg={4} key={data?.email} padding={1} >
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
