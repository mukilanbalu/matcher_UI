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
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, px: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            p: 1.25, 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, #A6627C 0%, #D9AEBB 100%)',
            color: 'white',
            boxShadow: '0 8px 16px rgba(166, 98, 124, 0.25)'
          }}>
            {icon}
          </Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: 'primary.main', 
            fontSize: { xs: '1.25rem', sm: '1.625rem' },
            fontFamily: "'Outfit', 'Noto Sans Tamil', sans-serif"
          }}>
            {t(title)}
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ 
          p: { xs: 3, sm: 4.5 }, 
          borderRadius: '24px', 
          background: 'rgba(255, 255, 255, 0.7)', 
          border: '1px solid rgba(166, 98, 124, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.03)'
        }}>
          <Grid container spacing={{ xs: 2.5, sm: 4 }}>
            {entries.map(([key, value]) => (
              <Grid item xs={6} sm={6} key={key}>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px',
                    fontSize: '0.65rem',
                    mb: 0.75,
                    display: 'block',
                    opacity: 0.8
                  }}>
                    {t(key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "))}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 700, 
                    color: '#191c1d', 
                    fontSize: '1.1rem',
                    fontFamily: "'Public Sans', 'Noto Sans Tamil', sans-serif"
                  }}>
                    {t(value) || '-'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          {data?.img && (
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px dashed rgba(166, 98, 124, 0.2)' }}>
              <Typography variant="caption" sx={{ 
                color: 'primary.main', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                fontSize: '0.65rem',
                mb: 2,
                display: 'block',
                opacity: 0.8
              }}>
                {t('Attached Document / Jathagam')}
              </Typography>
              <Box
                component="img"
                src={data.img}
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: '16px',
                  border: '1px solid rgba(166, 98, 124, 0.15)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  const renderProfileDetailsView = () => (
    <>
      {/* Hero Section */}
      <Paper elevation={0} sx={{ 
        p: { xs: 3, sm: 5 }, 
        borderRadius: '30px', 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(166, 98, 124, 0.05)',
        mb: 6,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(166, 98, 124, 0.08)'
      }}>
        {/* Background Accent */}
        <Box sx={{ 
          position: 'absolute', 
          top: -120, 
          right: -120, 
          width: 400, 
          height: 400, 
          background: 'radial-gradient(circle, rgba(166, 98, 124, 0.12) 0%, transparent 75%)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <Grid container spacing={5} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} sm={5} md={3.5}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                onClick={handleOpen}
                src={profile?.profile_img?.[0] || ""}
                sx={{
                  width: '100%',
                  aspectRatio: '0.8',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.25)',
                  border: '6px solid white',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
              {!state?.email && (
                <Button 
                  size="small" 
                  variant="contained" 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -20, 
                    right: 30, 
                    minWidth: 52, 
                    height: 52,
                    borderRadius: '16px',
                    boxShadow: '0 12px 24px rgba(166, 98, 124, 0.3)',
                    background: 'linear-gradient(135deg, #A6627C 0%, #8a4a63 100%)'
                  }}
                  onClick={() => setIsEdit(true)}
                >
                  <EditOutlined style={{ fontSize: '24px' }} />
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={7} md={8.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Typography variant="h1" sx={{ 
                    fontWeight: 900, 
                    color: '#191c1d', 
                    fontSize: { xs: '2.2rem', sm: '3.2rem' },
                    fontFamily: "'Outfit', 'Noto Sans Tamil', sans-serif",
                    letterSpacing: '-1px'
                  }}>
                    {profile?.name}
                  </Typography>
                </Stack>
                {/* Removed ID Chip */}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {pathname !== "/my_profile" && (
                  <Tooltip title={isInterested ? "Remove Interest" : "Express Interest"}>
                    <Button
                      variant={isInterested ? "contained" : "outlined"}
                      onClick={handleToggleInterest}
                      sx={{ 
                        borderRadius: '18px', 
                        minWidth: 56, 
                        height: 56, 
                        p: 0,
                        borderWidth: isInterested ? 0 : '1.5px',
                        borderColor: 'rgba(166, 98, 124, 0.2)',
                        background: isInterested ? 'linear-gradient(135deg, #A6627C 0%, #8a4a63 100%)' : 'transparent',
                        '&:hover': { background: isInterested ? 'linear-gradient(135deg, #A6627C 0%, #8a4a63 100%)' : 'rgba(166, 98, 124, 0.05)', borderColor: '#A6627C' }
                      }}
                    >
                      {isInterested ? <HeartFilled style={{ fontSize: '24px', color: 'white' }} /> : <HeartOutlined style={{ fontSize: '24px', color: '#A6627C' }} />}
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Download Profile PDF">
                  <Button
                    variant="outlined"
                    onClick={downloadAsPDF}
                    sx={{ 
                      borderRadius: '18px', 
                      minWidth: 56, 
                      height: 56, 
                      p: 0,
                      borderWidth: '1.5px',
                      borderColor: 'rgba(166, 98, 124, 0.2)',
                      color: '#A6627C',
                      '&:hover': { background: 'rgba(166, 98, 124, 0.05)', borderColor: '#A6627C' }
                    }}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? '...' : <FilePdfOutlined style={{ fontSize: '24px' }} />}
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr' }, 
              gap: { xs: 3, sm: 4 }, 
              pt: 4, 
              borderTop: '1px solid rgba(166, 98, 124, 0.1)' 
            }}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(217, 174, 187, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#A6627C'
                }}>
                  <PersonOutline sx={{fontSize: 22}} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#837377', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{t('Age / Status')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#191c1d', fontSize: '1.05rem' }}>{calculateAge(profile?.birth?.dob)} {t('YRS')} / {t(profile?.marital_status)}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(217, 174, 187, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#A6627C'
                }}>
                  <SchoolIcon sx={{fontSize: 22}} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#837377', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{t('Education')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#191c1d', fontSize: '1.05rem' }} noWrap>{profile?.professional?.education}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(217, 174, 187, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#A6627C'
                }}>
                  <LocationOnIcon sx={{fontSize: 22}} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#837377', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{t('Location')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#191c1d', fontSize: '1.05rem' }}>{profile?.professional?.location}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(217, 174, 187, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#A6627C'
                }}>
                  <PhoneOutlined sx={{fontSize: 22}} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#837377', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{t('Contact')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#191c1d', fontSize: '1.05rem' }}>{profile?.family?.mobile || 'HIDDEN'}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ gridColumn: { sm: 'span 2' } }}>
                <Box sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(217, 174, 187, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#A6627C'
                }}>
                  <WorkOutline sx={{fontSize: 22}} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#837377', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{t('Occupation')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#191c1d', fontSize: '1.05rem' }} noWrap>{profile?.professional?.job}</Typography>
                </Box>
              </Stack>
            </Box>
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
