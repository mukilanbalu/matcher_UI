import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
    Grid, InputLabel, OutlinedInput, FormHelperText, Button, Select, 
    MenuItem, Typography, Divider, Stepper, Step, StepLabel, Box 
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageUploader from 'components/imgae-uploader/image-uploader';
import profileService from 'services/profileService';
import { 
    raasiList, nakshatramList, tamilMonthsList, tamilYearsList, 
    yesNoList, daysList, workStatusList, martialStatusList 
} from 'constants/appConstants';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { isEmpty } from 'lodash';
import { supabase } from 'config/supabaseClient';

const steps = [
    'Basic Details',
    'Birth Details',
    'Professional Details',
    'Family Details',
    'Astrology Details',
    'Uploads'
];

const ProfileForm = (props) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData] = useState(props.profile);
    const [profileImage, setProfileImage] = useState([]);
    const [astroImage, setAstroImage] = useState("");
    const { t } = useTranslation();
    const { user } = useAuth0();

    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'Name must be at least 2 characters')
            .matches(/^[a-zA-Z\s]*$/, 'Name cannot contain special characters').required('Required'),
        height: Yup.string().trim().required('Required'),
        weight: Yup.string().trim().required('Required'),
        gender: Yup.string().trim().required('Required'),
        colour: Yup.string().trim().required('Required'),
        marital_status: Yup.string().trim().required('Required'),
        birth: Yup.object({
            dob: Yup.string().trim().required('Required'),
            time: Yup.string().trim().required('Required'),
            day: Yup.string().trim().required('Required'),
            place: Yup.string().trim().required('Required'),
        }),
        professional: Yup.object({
            work_status: Yup.string().trim().required('Required'),
            education: Yup.string().trim().required('Required'),
            job: Yup.string().trim().required('Required'),
            income: Yup.string().trim().required('Required'),
            location: Yup.string().trim().required('Required'),
        }),
        family: Yup.object({
            father_name: Yup.string().trim().required('Required'),
            mother_name: Yup.string().trim().required('Required'),
            father_job: Yup.string().trim().required('Required'),
            mother_job: Yup.string().trim().required('Required'),
            father_alive: Yup.string().trim().required('Required'),
            mother_alive: Yup.string().trim().required('Required'),
            poorvigam: Yup.string().trim().required('Required'),
            gothram: Yup.string().trim().required('Required'),
            kuladeivam: Yup.string().trim().required('Required'),
            brothers: Yup.number().required('Required'),
            sisters: Yup.number().required('Required'),
            married_brothers: Yup.number().required('Required'),
            married_sisters: Yup.number().required('Required'),
            address: Yup.string().trim().required('Required'),
            mobile: Yup.string().trim().matches(/^\d{10}$/, 'Invalid mobile number').required('Required'),
        }),
        astro: Yup.object({
            tamil_year: Yup.string().trim().required('Required'),
            tamil_month: Yup.string().trim().required('Required'),
            tamil_date: Yup.string().trim().required('Required'),
            rasi: Yup.string().trim().required('Required'),
            nakshatram: Yup.string().trim().required('Required'),
            patham: Yup.string().trim().required('Required'),
            lagnam: Yup.string().trim().required('Required'),
            desai: Yup.string().trim().required('Required'),
            desai_year: Yup.string().trim().required('Required'),
            desai_month: Yup.string().trim().required('Required'),
            desai_date: Yup.string().trim().required('Required'),
        }),
    });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderField = (name, key, value, handleChange, values) => {
        const dropdownOptions = {
            gender: ["Male", "Female"],
            colour: ["Fair", "Wheatish", "Dusky", "Black"],
            marital_status: martialStatusList,
            rasi: raasiList,
            nakshatram: nakshatramList,
            tamil_month: tamilMonthsList,
            tamil_year: tamilYearsList,
            lagnam: raasiList,
            father_alive: yesNoList,
            mother_alive: yesNoList,
            day: daysList,
            work_status: workStatusList,
        };

        const placeholders = {
            name: "Enter your name",
            height: "Eg: 5 ft 4 in",
            weight: "Eg: 65 kg",
            mobile: "eg: 9876543210",
            dob: "eg: DD / MM / YYYY",
            time: " eg: 12:30  AM / PM",
            job: " eg: software / doctor / lawyer",
            income: "eg: 12 LPA",
        };

        const [parent, child] = name.includes('.') ? name.split('.') : [null, name];
        const val = parent ? (values[parent]?.[child] || "") : (values[child] || "");

        if (dropdownOptions[key]) {
            return (
                <Select
                    name={name}
                    value={val || " "}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value={" "}><em>{t("Select")}</em></MenuItem>
                    {dropdownOptions[key].map(option => (
                        <MenuItem key={option} value={option}>{t(option)}</MenuItem>
                    ))}
                </Select>
            );
        }

        return (
            <OutlinedInput
                name={name}
                value={val}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder={placeholders[key] || `Enter ${key}`}
            />
        );
    };

    const renderStepContent = (step, handleChange, values) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Basic Details")}</Typography></Grid>
                        {[
                            { name: 'name', label: 'Name' },
                            { name: 'gender', label: 'Gender' },
                            { name: 'marital_status', label: 'Marital Status' },
                            { name: 'height', label: 'Height' },
                            { name: 'weight', label: 'Weight' },
                            { name: 'colour', label: 'Colour' }
                        ].map(f => (
                            <Grid item xs={12} sm={6} key={f.name}>
                                <InputLabel required>{t(f.label)}</InputLabel>
                                {renderField(f.name, f.name, null, handleChange, values)}
                                <ErrorMessage name={f.name} component={FormHelperText} error />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Birth Details")}</Typography></Grid>
                        {[
                            { name: 'birth.dob', label: 'Date of Birth', key: 'dob' },
                            { name: 'birth.time', label: 'Time of Birth', key: 'time' },
                            { name: 'birth.day', label: 'Day', key: 'day' },
                            { name: 'birth.place', label: 'Place of Birth', key: 'place' }
                        ].map(f => (
                            <Grid item xs={12} sm={6} key={f.name}>
                                <InputLabel required>{t(f.label)}</InputLabel>
                                {renderField(f.name, f.key, null, handleChange, values)}
                                <ErrorMessage name={f.name} component={FormHelperText} error />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Professional Details")}</Typography></Grid>
                        {[
                            { name: 'professional.work_status', label: 'Work Status', key: 'work_status' },
                            { name: 'professional.education', label: 'Education', key: 'education' },
                            { name: 'professional.job', label: 'Job', key: 'job' },
                            { name: 'professional.income', label: 'Income', key: 'income' },
                            { name: 'professional.location', label: 'Working Location', key: 'location' }
                        ].map(f => (
                            <Grid item xs={12} sm={6} key={f.name}>
                                <InputLabel required>{t(f.label)}</InputLabel>
                                {renderField(f.name, f.key, null, handleChange, values)}
                                <ErrorMessage name={f.name} component={FormHelperText} error />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Family Details")}</Typography></Grid>
                        {[
                            { name: 'family.father_name', label: 'Father Name', key: 'father_name' },
                            { name: 'family.mother_name', label: 'Mother Name', key: 'mother_name' },
                            { name: 'family.father_job', label: 'Father Job', key: 'father_job' },
                            { name: 'family.mother_job', label: 'Mother Job', key: 'mother_job' },
                            { name: 'family.father_alive', label: 'Father Alive?', key: 'father_alive' },
                            { name: 'family.mother_alive', label: 'Mother Alive?', key: 'mother_alive' },
                            { name: 'family.poorvigam', label: 'Poorvigam', key: 'poorvigam' },
                            { name: 'family.gothram', label: 'Gothram', key: 'gothram' },
                            { name: 'family.kuladeivam', label: 'Kuladeivam', key: 'kuladeivam' },
                            { name: 'family.brothers', label: 'Brothers', key: 'brothers' },
                            { name: 'family.sisters', label: 'Sisters', key: 'sisters' },
                            { name: 'family.married_brothers', label: 'Married Brothers', key: 'married_brothers' },
                            { name: 'family.married_sisters', label: 'Married Sisters', key: 'married_sisters' },
                            { name: 'family.mobile', label: 'Mobile', key: 'mobile' },
                            { name: 'family.address', label: 'Address', key: 'address' }
                        ].map(f => (
                            <Grid item xs={12} sm={6} key={f.name}>
                                <InputLabel required>{t(f.label)}</InputLabel>
                                {renderField(f.name, f.key, null, handleChange, values)}
                                <ErrorMessage name={f.name} component={FormHelperText} error />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Astrology Details")}</Typography></Grid>
                        {[
                            { name: 'astro.tamil_year', label: 'Tamil Year', key: 'tamil_year' },
                            { name: 'astro.tamil_month', label: 'Tamil Month', key: 'tamil_month' },
                            { name: 'astro.tamil_date', label: 'Tamil Date', key: 'tamil_date' },
                            { name: 'astro.rasi', label: 'Rasi', key: 'rasi' },
                            { name: 'astro.nakshatram', label: 'Nakshatram', key: 'nakshatram' },
                            { name: 'astro.patham', label: 'Patham', key: 'patham' },
                            { name: 'astro.lagnam', label: 'Lagnam', key: 'lagnam' },
                            { name: 'astro.desai', label: 'Desai', key: 'desai' },
                            { name: 'astro.desai_year', label: 'Desai Year', key: 'desai_year' },
                            { name: 'astro.desai_month', label: 'Desai Month', key: 'desai_month' },
                            { name: 'astro.desai_date', label: 'Desai Date', key: 'desai_date' }
                        ].map(f => (
                            <Grid item xs={12} sm={6} key={f.name}>
                                <InputLabel required>{t(f.label)}</InputLabel>
                                {renderField(f.name, f.key, null, handleChange, values)}
                                <ErrorMessage name={f.name} component={FormHelperText} error />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="h5">{t("Uploads")}</Typography></Grid>
                        <Grid item xs={12}>
                            <InputLabel required>{t("Profile Image")}</InputLabel>
                            <ImageUploader setProfileImage={setProfileImage} />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel required>{t("Astrology Image")}</InputLabel>
                            <ImageUploader title={"astrology_image"} setAstroImage={setAstroImage} />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    const uploadFile = async (file, bucket) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.sub}/${fileName}`;

        let { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let profileImgUrls = [];
            if (profileImage.length) {
                profileImgUrls = await Promise.all(
                    profileImage.map(file => uploadFile(file, 'profile_images'))
                );
            }

            let astroImgUrl = "";
            if (astroImage && typeof astroImage !== 'string') {
                astroImgUrl = await uploadFile(astroImage, 'astro_images');
            }

            let payload = {
                ...formData,
                ...values,
                email: user?.email,
                profile_img: profileImgUrls.length ? [...(formData.profile_img || []), ...profileImgUrls] : formData.profile_img,
                astro: { ...values.astro, img: astroImgUrl || formData.astro?.img },
                created_on: props.isCreateProfile ? new Date().toISOString() : formData.created_on
            };

            const responseData = props.isCreateProfile 
                ? await profileService.createProfile(payload) 
                : await profileService.patchProfile(payload);
            
            if (responseData.status === 200) {
                props.setProfile(responseData.data.data);
                props.setIsCreateProfile(false);
                notifySuccess(props.isCreateProfile ? "Profile created successfully" : "Profile saved successfully");
                props.setIsEdit(false);
            }
        } catch (e) {
            notifyError("Error saving profile!");
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, handleChange, values, isSubmitting, errors }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <MainCard border={false} shadow={3} boxShadow sx={{ p: 2 }}>
                        <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
                            {steps.map((label) => (
                                <Step key={label}><StepLabel>{t(label)}</StepLabel></Step>
                            ))}
                        </Stepper>
                        
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ mb: 2, display: { md: 'none' } }}>
                                {t(steps[activeStep])} ({activeStep + 1}/{steps.length})
                            </Typography>
                            {renderStepContent(activeStep, handleChange, values)}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                {t("Back")}
                            </Button>
                            <Box>
                                <Button onClick={() => props.setIsEdit(false)} sx={{ mr: 1 }}>
                                    {t("Cancel")}
                                </Button>
                                {activeStep === steps.length - 1 ? (
                                    <AnimateButton>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            type="submit" 
                                            disabled={isSubmitting}
                                        >
                                            {t("Save Profile")}
                                        </Button>
                                    </AnimateButton>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handleNext}>
                                        {t("Next")}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        
                        {!isEmpty(errors) && activeStep === steps.length -1 && (
                            <FormHelperText error sx={{ mt: 2 }}>
                                {t("Please fix validation errors before saving.")}
                            </FormHelperText>
                        )}
                    </MainCard>
                </form>
            )}
        </Formik>
    );
};

export default ProfileForm;
