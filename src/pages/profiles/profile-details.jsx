// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from '../component-overview/ComponentSkeleton';
import { Box, Button, Container } from '@mui/material';
import { EditOutlined, FilePdfOutlined, PhoneOutlined } from '@ant-design/icons';
import { WorkOutline } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import profileService from 'apiServices/profileService';
import ProfileForm from './profile-form-formData';
import ImageUploader from 'components/imgae-uploader/image-uploader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import ImageCarousel from "../../components/image-carousel";
export default function ProfileDetails(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isCreateProfile, setIsCreateProfile] = useState(false);
  const location = useLocation();
  const { state, pathname } = location;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const initProfile = {
    name: "",
    email: "",
    profile_img: "",
    gender: "",
    height: "",
    weight: "",
    colour: "",
    birth: {
      dob: "",
      time: "",
      day: "",
      age: "",
      place: "",
      tamil_year: "",
      tamil_month: "",
      tamil_date: ""
    },
    professional: {
      education: "",
      job: "",
      sector: "",
      income: "",
      location: "",
    },
    family: {
      father_name: "",
      father_job: "",
      mother_name: "",
      mother_job: "",
      income: "",
      ancestral_origin: "",
      kuladeivam: "",
      brothers: 0,
      sisters: 0,
      married_brothers: 0,
      married_sisters: "",
      mobile: "",
      address: "",
    },
    astro: {
      gothram: "",
      rasi: "",
      nakshatram: "",
      patham: "",
      lagnam: "",
      img: "",
    },
  }

  const apiUrl = import.meta.env.VITE_API_ENDPOINT;
  const getData = () => {
    setIsLoading(true);
    try {
      if (state) {
        profileService.searchProfiles({ filters: { email: state.email }, isFullProfile: true }).then(res => {
          if (res.status === 200) {
            setProfile(res.data.data[0]);
          }
          setIsLoading(false);
        });
      } else {
        profileService.searchProfiles({ filters: { email: props?.currentUser?.email }, isFullProfile: true }).then(res => {
          if (res.status === 200) {
            setProfile(res.data.data[0]);
          } else if (res.status === 204) {
            setIsCreateProfile(true)
          }
          setIsLoading(false);
        });
      }
    }
    catch (err) {
      console.error("Error fetching profiles");
      setIsLoading(false);
    }
  }


  useEffect(() => {
    getData()
  }, [state, pathname]);

  const downloadAsPDF = () => {
    const input = document.getElementById('pdf-content');
    html2pdf()
      .from(input)
      .set({
        watermark: { text: 'Downloaded from matcher.com', color: '#000', opacity: 0.5 },
        filename: `${profile.name}_profile.pdf`,
        margin: [1, 0.5],
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }

      })
      .save();
  };

  const handleCreate = () => {
    setProfile(initProfile);
    setIsEdit(true);
  }

  const renderProfileImagePreview = () => (
    open && <ImageCarousel open={open} handleClose={handleClose} images={profile?.profile_img} />
  )


  const renderProfileDetails = (data) => {
    let details = [];
    for (const category in data) {
      if (category === "img") {
        details.push(
          <Grid key={category} item xs={12} lg={12}>
            <Box
              component="img"
              sx={{
              }}
              src={(data[category]) ? `${apiUrl}/${data[category]}` : ""} alt={"astro_image"}
            ></Box>
          </Grid>)
      } else if (category !== "_id") {
        details.push(
          <Grid key={category} item xs={12} lg={6}>
            <Grid container>
              <Grid item xs={12} lg={3} xl={3}>
                <Typography variant="h6" color="textPrimary" sx={{ mb: '8px', fontWeight: 500 }}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}:
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} xl={9}>
                <Typography variant="h6" color="textPrimary" sx={{ mb: '8px', fontWeight: 500 }}>
                  {data[category]}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }

      // }
    }
    return details;
  };

  const renderProfileDetailsView = () => <>
    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3} >
            <Box
              component="img"
              sx={{
                height: 250,
                maxWidth: "100%",
                cursor: "pointer"
              }}
              src={(profile?.profile_img) ? `${apiUrl}/${profile.profile_img[0]}` : ""}
              alt={"profile_image"}
              onClick={handleOpen}
            />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            {pathname === "/my_profile" ?
              <Button variant="outilned" size='large' sx={{ float: "right", fontSize: "22px" }} onClick={() => setIsEdit(true)}>
                <EditOutlined alt='Edit proifle' />
              </Button> : <Button variant="outilned" color='primary' size='large' sx={{ float: "right", fontSize: "22px", color: "primary" }} onClick={downloadAsPDF}>
                <FilePdfOutlined />
              </Button>
            }
            <Typography variant="h3" color="textPrimary">
              {profile?.name}
            </Typography>
            <br />
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              {`${profile?.birth?.age} years | ${profile?.height}  | ${profile?.weight}  | ${profile?.colour} `}
            </Typography>
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              <SchoolIcon fontSize='10' /> {profile?.professional?.education}
            </Typography>
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              <WorkOutline fontSize='10' /> {profile?.professional?.job}
            </Typography>
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              < LocationOnIcon fontSize='10' />{profile?.professional?.location}
            </Typography>
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              <PhoneOutlined /> {profile?.family?.mobile}
            </Typography>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>


    {/* birth deatils */}
    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow  >
        <Grid>
          <Typography variant="h3" color="textPrimary">
            Birth Details
          </Typography>
          <br />
        </Grid>
        <Grid container>
          {renderProfileDetails(profile?.birth)}
        </Grid>
      </MainCard>
    </Grid>

    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow  >
        <Grid >
          <Typography variant="h3" color="textPrimary">
            Professional Details
          </Typography>
          <br />
        </Grid>
        <Grid container>
          {renderProfileDetails(profile?.professional)}
        </Grid>
      </MainCard>
    </Grid>


    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow  >
        <Grid >
          <Typography variant="h3" color="textPrimary">
            Family Details
          </Typography>
          <br />
        </Grid>
        <Grid container>
          {renderProfileDetails(profile?.family)}
        </Grid>
      </MainCard>
    </Grid>


    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow  >
        <Grid >
          <Typography variant="h3" color="textPrimary">
            Astrology Details
          </Typography>
          <br />
        </Grid>
        <Grid container>
          {renderProfileDetails(profile?.astro)}
        </Grid>
      </MainCard>
    </Grid>
  </>


  const renderCreateProfile = () => <>
    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow >
        <Grid container spacing={3}>
          <Grid item xs={12} >
            <Typography variant="h4">
              {`Welcome ${props?.currentUser?.name} !`}
            </Typography>

            <br />

            <Typography variant="h6">
              <Button variant='text' onClick={handleCreate}>Click here </Button>  {`to create your profile`}
            </Typography>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  </>




  return (
    <ComponentSkeleton isLoading={isLoading}>
      <Container maxWidth="md" id="pdf-content">

        {isEdit ?
          <ProfileForm profile={profile} setIsCreateProfile={setIsCreateProfile} isCreateProfile={isCreateProfile} setProfile={setProfile} setIsEdit={setIsEdit} />
          : (
            <>
              {isCreateProfile ? renderCreateProfile() :
                renderProfileDetailsView()
              }

            </>
          )
        }
        {renderProfileImagePreview()}
      </Container>

    </ComponentSkeleton >
  );
}
