// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from '../component-overview/ComponentSkeleton';
import { Box, Button, Container, Tooltip } from '@mui/material';
import { EditOutlined, FilePdfOutlined, PhoneOutlined } from '@ant-design/icons';
import { Check, Close, WorkOutline } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import profileService from 'apiServices/profileService';
import ProfileForm from './profile-form-formData';
import html2pdf from 'html2pdf.js';
import ImageCarousel from "../../components/image-carousel";
import { initialProfileValues } from 'constants/appConstants';
import { calculateAge } from 'utils/appUtils';
import { notifyError } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import pokeralaService from 'apiServices/prokereala';
import { MaterialReactTable } from 'material-react-table';
export default function ProfileDetails(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(initialProfileValues);
  const [isEdit, setIsEdit] = useState(false);
  const [isCreateProfile, setIsCreateProfile] = useState(false);
  const [matchScore, setMatchScore] = useState({
    "maximum_points": "",
    "obtained_points": "",
    "matches": []
  });
  const location = useLocation();
  const { state, pathname } = location;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getData = () => {
    try {
      setIsLoading(true);
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
        })
      }
    }
    catch (err) {
      notifyError("Error fetching your profile");
      setIsLoading(false);
    }
  }

  const getProutham = () => {
    pokeralaService.getMatch(
      {
        params: {
          girl_nakshatra: 5,
          girl_nakshatra_pada: 2,
          boy_nakshatra: 6,
          boy_nakshatra_pada: 2
        },
      }
    ).then((res) => {
      setMatchScore(res.data.data)
    }).catch((err) => console.log(err))
  }

  useEffect(() => {
    getData()
  }, [state, pathname]);

  const downloadAsPDF = () => {
    setIsLoading(true);
    const input = document.getElementById('pdf-content');
    html2pdf()
      .from(input)
      .set({
        watermark: { text: 'Downloaded from matcher.com', color: '#000', opacity: 0.5 },
        filename: `${profile.name}_profile.pdf`,
        margin: [1, 0.5],
        html2canvas: {
          scale: 3,
          logging: true, // Enable logging to check for any errors
          useCORS: true, // Enable cross-origin images
          allowTaint: true, // Allow cross-origin images to taint the canvas
          onclone: (document) => {
            // Ensure all images are fully loaded
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
              if (!img.complete) {
                img.onload = () => { }; // Force load event
                img.src = img.src; // Re-trigger the loading
              }
            });
          }
        },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      })
      .save()
      .finally(() => {
        setIsLoading(false);
      });

  };

  const handleCreate = () => {
    setProfile(initialProfileValues);
    setIsEdit(true);
  }

  const renderProfileImagePreview = () => (
    open && <ImageCarousel open={open} handleClose={handleClose} images={profile?.profile_img} />
  )

  const columns = [
    {
      accessorKey: 'name',
      header: `${t('name')}`,
      Cell: ({ renderedCellValue, row }) => t(renderedCellValue)

    },
    {
      accessorKey: 'has_porutham',
      header: `${t('match')}`,
      Cell: ({ renderedCellValue, row }) => renderedCellValue ? <Check color='success' /> : <Close color='error' />
    },
    {
      accessorKey: 'description',
      header: `${t('description')}`,
    }
  ]


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
              src={data[category]}
            ></Box>
          </Grid>)
      } else if (category !== "_id" && category !== "mobile") {
        details.push(
          <Grid key={category} item xs={12} lg={6}>
            <Grid container>
              <Grid item xs={12} lg={3} xl={3}>
                <Typography variant="h6" color="textPrimary" sx={{ mb: '8px', fontWeight: 500 }}>
                  {t(category.charAt(0).toUpperCase() + category.slice(1).replace("_", " "))}:
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} xl={9}>
                <Typography variant="h6" color="textPrimary" sx={{ mb: '8px', fontWeight: 500 }}>
                  {t(data[category])}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }
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
              src={(profile?.profile_img) ? `${profile.profile_img[0]}` : ""}
              alt={"profile_image"}
              onClick={handleOpen}
              blurDataURL={`data:image/png;base64,${profile.profile_img[0]}`}
            />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            {pathname === "/my_profile" ?
              <Button variant="outilned" size='large' sx={{ float: "right", fontSize: "22px" }} onClick={() => setIsEdit(true)}>
                <EditOutlined alt='Edit proifle' />
              </Button> :
              <Tooltip title={t("download as PDF")}>
                <Button
                  variant="outilned"
                  color='primary'
                  size='large'
                  sx={{ float: "right", fontSize: "22px", color: "primary" }}
                  onClick={downloadAsPDF}
                >
                  <FilePdfOutlined />
                </Button>
              </Tooltip>
            }
            <Typography variant="h3" color="textPrimary">
              {profile?.name}
            </Typography>
            <br />
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              {calculateAge(profile?.birth?.dob)} {`years | ${profile?.marital_status}`}
            </Typography>
            <Typography variant="h6" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              {`${profile?.height}  | ${profile?.weight}  | ${profile?.colour} `}
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
            <Typography variant="caption" color="textPrimary" sx={{ mb: "8px", fontWeight: "500" }}>
              {/* <em>Profile created on: {new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(profile?.created_on && new Date(profile?.created_on))} </em> */}
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
            {t("Birth Details")}
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
            {t("Professional Details")}
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
            {t("Family Details")}

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

            {t("Astrology Details")}
          </Typography>
          <br />
        </Grid>
        <Grid container>
          {renderProfileDetails(profile?.astro)}
        </Grid>
      </MainCard>
    </Grid>
    <Grid item xs={12} lg={12} mb={2}>
      <MainCard border={false} shadow={3} boxShadow  >
        <Grid >
          <Typography variant="h3" color="textPrimary">

            {t("Match score")}  {matchScore?.obtained_points} / {matchScore?.maximum_points}
          </Typography>
          <br />
        </Grid>
        {/* <Grid container> */}

        <MaterialReactTable
          columns={columns}
          data={matchScore?.matches}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableSorting={false}
          enablePagination={false}
          enableColumnActions={false}
        />
        {/* </Grid> */}
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
  getProutham()
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
