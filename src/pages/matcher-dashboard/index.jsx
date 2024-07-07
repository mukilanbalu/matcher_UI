import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { CardContent, CardMedia } from '@mui/material';
import profileService from 'apiServices/profileService';
import ComponentSkeleton from 'pages/component-overview/ComponentSkeleton';
import { useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileFilters from 'components/filter-panel';
import { calculateAge } from 'utils/appUtils';
import InfiniteScroll from 'react-infinite-scroll-component';

// DASHBOARD //
const apiUrl = import.meta.env.VITE_API_ENDPOINT;

export default function DashboardMatcher() {

    const navigate = useNavigate();

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
    const [hasMore, setHasMore] = useState(true);
    const [profileFilters, setProfileFilters] = useState(initialValues);
    const [prevLimit, setPrevLimit] = useState(initialValues.limit);
    const [prevSkip, setPrevSkip] = useState(initialValues.skip);
    const { user } = useAuth0();
    const debounceTimeout = 3000;
    const timeoutId = useRef(null);
    const page = useRef(1);
    const scrollParentRef = useRef(null);

    const getProfiles = async (profileFilter) => {

        setLoading(true);
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
                    setProfiles((prevProfiles) => {
                        if (profileFilter.skip === 0) {
                            return res.data.data;
                        } else {
                            const newProfiles = res.data.data.filter(newProfile =>
                                !prevProfiles.some(existingProfile => existingProfile.email === newProfile.email)
                            );
                            return [...prevProfiles, ...newProfiles];
                        }
                    })
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
            console.error("Error fetching profiles");
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
        console.log("filter")
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
        console.log("pagi")
        if (profileFilters.skip > 0) {
            getProfiles(profileFilters);
        }
    }, [profileFilters.limit, profileFilters.skip]);

    const renderProfileCards = (profile) => (
        <MainCard
            content={false}
            sx={{
                display: "flex",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "rgba(22, 119, 255, 0.08)",
                    borderRight: "2px solid rgb(22, 119, 255)"
                },
                minHeight: "252px",
            }}
            onClick={() => navigate("/profile/details", { state: profile })}
        >
            <CardMedia
                component="img"
                sx={{ maxHeight: "250px", width: "auto", minWidth: "190" }}
                image={profile?.profile_img ? `${profile.profile_img[0]}` : ""}
                alt="profile image"
            />
            <CardContent>
                <Typography variant="h2" gutterBottom>
                    {profile.name}
                </Typography>

                <Grid>
                    <Typography variant="body1">
                        {calculateAge(profile?.birth?.dob)} years | {profile?.marital_status}
                    </Typography>
                    <Typography variant="body1">
                        {profile.professional.education}
                    </Typography>
                    <Typography variant="body1">
                        {profile.professional.job}
                    </Typography>
                    <Typography variant="body1">
                        {profile.professional.location}
                    </Typography>
                    <Typography variant="body1">
                        {profile?.astro?.rasi}
                    </Typography>
                    <Typography variant="body1">
                        {profile?.astro?.nakshatram}
                    </Typography>
                </Grid>
            </CardContent>
        </MainCard>
    );
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75} >
            <Grid item xs={12} sx={{ mb: -2.25 }}>
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
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>You have seen it all</b>
                            </p>}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            flexDirection: "row",
                            // marginTop: " -36px",
                            // marginLeft: "-22px",
                        }}

                    >
                        {!isLoading && profiles.length > 0 ?
                            profiles.map((data) =>
                                <Grid item xs={12} sm={6} md={6} lg={6} key={data?.email} padding={3} >
                                    {renderProfileCards(data)}
                                </Grid>
                            )
                            :
                            <Grid item xs={12} sm={6} md={6} lg={12} sx={{ minHeight: "70vh" }}>
                                <Typography variant='h4' align='center' mt={"50px"}>
                                    No profile available for the filters
                                </Typography>
                            </Grid>
                        }
                    </InfiniteScroll>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
}
