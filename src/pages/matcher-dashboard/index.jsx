


// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// assets
import { CardContent, CardMedia } from '@mui/material';
import { useEffect, useState } from 'react';
import profileService from 'apiServices/profileService';
import ComponentSkeleton from 'pages/component-overview/ComponentSkeleton';
import { useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileFilters from 'components/filter-panel';

// DASHBOARD //
const apiUrl = import.meta.env.VITE_API_ENDPOINT;

export default function DashboardMatcher() {

    const navigate = useNavigate();

    const myProfile = {
        name: "Arjun",
        email: "arjun@yahoo.com",
        profile_img: ["https://i.pravatar.cc/500", "https://i.pravatar.cc/500", "https://i.pravatar.cc/500"],
        gender: "Male",
        dob: {
            dob: "02/07/1991",
            time: "12:48 AM",
            day: "error: Field 'dob' not found",
            age: "33",
            place: "Erode"
        },
        tdob: {
            year: "Rakshasa",
            month: "Aani",
            date: 1
        },
        professional: {
            education: "Master's Degree",
            job: "Social Media Coordinator",
            sector: "Media",
            income: "$257162.36",
            location: "Jaipur"
        },
        family: {
            father_name: "Siva",
            father_job: "Engineer",
            mother_name: "Shanthi",
            mother_job: "Athlete",
            income: "$112246.25",
            ancestral_origin: "Sivakasi",
            kuladeivam: "Brahma",
            elder_sibbling: 3,
            younger_sibbling: 7,
            married_sibbling: 7,
            mobile: "1458838791",
            address: "173 Bellgrove Lane"
        },
        astro: {
            gothram: "Sarvajit",
            rasi: "Meenam",
            nakshatram: "Bharani",
            patham: 3,
            lagnam: "Magaram",
            img: "https://picsum.photos/800/300"
        }
    }


    const initialValues = {
        [`astro.nakshatram`]: '',
        [`astro.rasi`]: '',
        gender: '',
        [`birth.age`]: [21, 31],
    };

    const [profiles, setProfiles] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [profileFilters, setProfileFilters] = useState(initialValues)

    const { user } = useAuth0();

    const getProfiles = () => {
        setLoading(true);
        let payload = Object.entries(profileFilters).reduce((acc, [key, value]) => {
            if ((value && !(Array.isArray(value)) && value?.trim()) || (Array.isArray(value) && value.length > 0)) {
                acc[key] = value;
            }
            return acc;
        }, {});
        try {
            profileService.searchProfiles({ filters: { ...payload } }).then(res => {
                if (res.status === 200) {
                    setProfiles(res.data.data);
                } else if (res.status === 204) {
                    setProfiles([]);
                }
                setLoading(false);

            });
        } catch (err) {
            console.error("Error fetching profiles");
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfiles();
        console.log("Profiles loaded")
    }, [profileFilters]);


    const renderProfileCards = (profile) => (
        <>
            <MainCard content={false}
                sx={{
                    display: "flex", cursor: "pointer",
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
                    image={(profile?.profile_img) ? `${apiUrl}/${profile.profile_img[0]}` : ""}
                    alt="profile image" />
                <CardContent>
                    <Typography variant="h2" gutterBottom>
                        {profile.name}
                    </Typography>

                    <Grid >
                        <Typography variant="body1">
                            {profile.birth.age} years
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
        </>
    )


    return (

        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <MainCard border={false} shadow={3} boxShadow  >
                    <ProfileFilters profileFilters={profileFilters} setProfileFilters={setProfileFilters} />
                </MainCard>
            </Grid>
            <ComponentSkeleton isLoading={isLoading}>

                {(!isLoading && profiles.length > 0) ?


                    profiles.map((data) =>
                        <Grid item xs={12} sm={6} md={6} lg={6} key={data?.email}>
                            {renderProfileCards(data)}
                        </Grid>
                    ) :
                    <Grid item xs={12} sm={6} md={6} lg={12} >
                        <Typography variant='h4' align='center' mt={"50px"} >
                            No profile available for the filters
                        </Typography>
                    </Grid>
                }
            </ComponentSkeleton>
        </Grid>
    );
}
