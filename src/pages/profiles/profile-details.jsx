// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, Button, Container, Tooltip, Divider, Paper, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from '../component-overview/ComponentSkeleton';
import { EditOutlined, FilePdfOutlined, PhoneOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { WorkOutline, PersonOutline, HomeOutlined, StarBorder, VerifiedUserOutlined } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import profileService from 'services/profileService';
import ProfileForm from './profile-form-formData';
import html2pdf from 'html2pdf.js';
import ImageCarousel from "../../components/image-carousel";
import { initialProfileValues } from 'constants/appConstants';
import { calculateAge } from 'utils/appUtils';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';
import interestService from 'services/interestService';

export default function ProfileDetails(props) {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(initialProfileValues);
  const [isEdit, setIsEdit] = useState(false);
  const [isCreateProfile, setIsCreateProfile] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const location = useLocation();
  const { state, pathname } = location;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getData = () => {
    try {
      setIsLoading(true);
      const email = state?.email || props?.currentUser?.email;
      if (email) {
        profileService.searchProfiles({ filters: { email }, isFullProfile: true })
          .then(res => {
            if (res.status === 200 && res.data.data?.length > 0) {
              setProfile(res.data.data[0]);
              checkInterest(res.data.data[0].email);
            } else {
              if (email === props?.currentUser?.email) setIsCreateProfile(true);
            }
          })
          .catch(err => {
            console.error("Error fetching profile:", err);
            notifyError("Error searching profile");
          })
          .finally(() => setIsLoading(false));
      }
    } catch (err) {
      notifyError("Error fetching profile");
      setIsLoading(false);
    }
  }

  const checkInterest = async (email) => {
    try {
      const res = await interestService.checkInterestStatus(email);
      if (res.status === 200) setIsInterested(res.data.hasSentInterest);
    } catch (err) { console.error(err); }
  }

  const handleToggleInterest = async () => {
    try {
      const res = await interestService.toggleInterest({ receiver_email: profile.email });
      if (res.status === 200 || res.status === 201) {
        setIsInterested(res.data.action === "added");
        notifySuccess(res.data.message);
      }
    } catch (err) { notifyError("Error toggling interest"); }
  }

  useEffect(() => {
    getData()
  }, [state, pathname]);

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const downloadAsPDF = () => {
    setIsPdfLoading(true);
    const input = document.getElementById('details-to-pdf');
    html2pdf()
      .from(input)
      .set({
        filename: `${profile.name}_profile.pdf`,
        margin: [1, 0.5],
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      })
      .save()
      .finally(() => setIsPdfLoading(false));
  };

  const renderDetailsSection = (data, title, icon) => {
    const entries = Object.entries(data || {}).filter(([key]) => !['img', '_id', 'mobile'].includes(key));
    if (entries.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <Box sx={{ 
            display: 'flex', 
            p: 1.2, 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #A6627C 0%, #D9AEBB 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(166, 98, 124, 0.2)'
          }}>
            {icon}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.dark', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {t(title)}
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ 
          p: { xs: 2.5, sm: 3.5 }, 
          borderRadius: '20px', 
          background: 'rgba(255, 255, 255, 0.5)', 
          border: '1px solid rgba(166, 98, 124, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {entries.map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    mb: 0.5,
                    display: 'block'
                  }}>
                    {t(key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "))}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.05rem' }}>
                    {t(value) || '-'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderProfileDetailsView = () => (
    <>
      {/* Hero Section */}
      <Paper elevation={0} sx={{ 
        p: { xs: 2.5, sm: 4 }, 
        borderRadius: '24px', 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.3)',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Accent */}
        <Box sx={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 300, 
          height: 300, 
          background: 'radial-gradient(circle, rgba(166, 98, 124, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                onClick={handleOpen}
                src={profile?.profile_img?.[0] || ""}
                sx={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px -12px rgba(166, 98, 124, 0.3)',
                  border: '4px solid white'
                }}
              />
              {!state?.email && (
                <Button 
                  size="small" 
                  variant="contained" 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -15, 
                    right: 20, 
                    minWidth: 46, 
                    height: 46,
                    borderRadius: '14px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => setIsEdit(true)}
                >
                  <EditOutlined style={{ fontSize: '20px' }} />
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                   <Typography variant="h1" sx={{ fontWeight: 900, color: 'text.primary', fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
                    {profile?.name}
                  </Typography>
                  <VerifiedUserOutlined color="primary" sx={{ fontSize: 24 }} />
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ px: 1.5, py: 0.4, borderRadius: '8px', background: 'rgba(166, 98, 124, 0.1)', color: 'primary.main', fontSize: '0.85rem' }}>
                    {profile?.profile_id || 'ID PENDING'}
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {pathname !== "/my_profile" && (
                  <Tooltip title={isInterested ? "Remove Interest" : "Express Interest"}>
                    <Button
                      variant={isInterested ? "contained" : "outlined"}
                      color="primary"
                      onClick={handleToggleInterest}
                      sx={{ borderRadius: '14px', minWidth: 50, height: 50, p: 0 }}
                    >
                      {isInterested ? <HeartFilled style={{ fontSize: '20px' }} /> : <HeartOutlined style={{ fontSize: '20px' }} />}
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Download Profile PDF">
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={downloadAsPDF}
                    sx={{ borderRadius: '14px', minWidth: 50, height: 50, p: 0 }}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? '...' : <FilePdfOutlined style={{ fontSize: '20px' }} />}
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <Grid container spacing={3}>
              <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}><PersonOutline /></Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>{t('Age / Status')}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{calculateAge(profile?.birth?.dob)} YRS / {profile?.marital_status}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}><SchoolIcon /></Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>{t('Education')}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }} noWrap>{profile?.professional?.education}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}><WorkOutline /></Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>{t('Occupation')}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }} noWrap>{profile?.professional?.job}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}><LocationOnIcon /></Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>{t('Location')}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{profile?.professional?.location}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}><PhoneOutlined /></Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>{t('Contact')}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{profile?.family?.mobile || 'HIDDEN'}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Content Sections */}
      <Box id="details-to-pdf">
        {renderDetailsSection(profile?.birth, "Personal & Birth Details", <PersonOutline />)}
        {renderDetailsSection(profile?.professional, "Career & Education", <WorkOutline />)}
        {renderDetailsSection(profile?.family, "Family Background", <HomeOutlined />)}
        {renderDetailsSection(profile?.astro, "Astrology & Horoscope", <StarBorder />)}
      </Box>
    </>
  );

  return (
    <ComponentSkeleton isLoading={isLoading}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 5 } }}>
        {isEdit ? (
          <ProfileForm profile={profile} setIsCreateProfile={setIsCreateProfile} isCreateProfile={isCreateProfile} setProfile={setProfile} setIsEdit={setIsEdit} />
        ) : (
          isCreateProfile ? (
            <Box sx={{ textAlign: 'center', py: 15, background: 'rgba(255,255,255,0.5)', borderRadius: '30px' }}>
              <Typography variant="h2" gutterBottom color="primary">{t("Welcome")}, {props?.currentUser?.name}!</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>{t("You haven't shared your story yet. Create your profile to start your search.")}</Typography>
              <Button variant="contained" size="large" onClick={() => setIsEdit(true)} sx={{ height: 50, px: 5, borderRadius: '15px' }}>{t("Create My Profile")}</Button>
            </Box>
          ) : renderProfileDetailsView()
        )}
        {open && <ImageCarousel open={open} handleClose={handleClose} images={profile?.profile_img} />}
      </Container>
    </ComponentSkeleton>
  );
}
