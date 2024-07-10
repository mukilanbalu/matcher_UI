import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, InputLabel, OutlinedInput, FormHelperText, Button, Select, MenuItem, Typography, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageUploader from 'components/imgae-uploader/image-uploader';
import profileService from 'apiServices/profileService';
import { raasiList, nakshatramList, tamilMonthsList, tamilYearsList, yesNoList, daysList, workStatusList } from 'constants/appConstants';
import { notifyError, notifySuccess } from 'components/toaster/toast';
import { useTranslation } from 'react-i18next';




const ProfileForm = (props) => {
    const [formData, setFormData] = useState(props.profile);
    const [profileImage, setProfileImage] = useState([]);
    const [astroImage, setAstroImage] = useState("");
    const { t } = useTranslation();


    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'Name must be at least 3 characters').required('Required'),
    });

    const renderField = (name, key, value, handleChange, values) => {

        const dropdownOptions = {
            gender: ["Male", "Female"],
            colour: ["Fair", "Wheatish", "Dusky", "Black"],
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
            email: "Enter your email",
            profile_img: "Enter profile image URL",
            height: "Eg: 5 ft 4 in",
            weight: "Eg: 65 kg",
            mobile: "eg: 9876543210",
            address: "Enter address",
            dob: "eg: DD / MM / YYYY",
            time: " eg: 12:30  AM / PM",
            day: "Day",
            age: "Age",
            place: "Place",
            tamil_year: "Year",
            job: " eg: software / doctor / lawyer / accountant / business",
            income: "eg: 12 LPA / 1 LPM",
            location: "working location",
            // Add placeholders for other fields as needed
        };



        // Handle nested fields
        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            if (dropdownOptions[key]) {
                return (
                    <Select
                        name={name}
                        value={values[parent][child] ? values[parent][child] : " "}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value={" "}>
                            <em> {t("Select")} </em>
                            {/* <em>Select {key}</em> */}
                        </MenuItem>
                        {dropdownOptions[key].map(option => (
                            <MenuItem key={option} value={option}>
                                {t(option)}
                                {/* {option} */}
                            </MenuItem>
                        ))}
                    </Select>
                );
            }

            return (
                <OutlinedInput
                    type="text"
                    name={name}
                    value={values[parent][child]}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    lang='ta'
                    placeholder={placeholders[key] || `Enter ${key}`}
                />
            );


        } else {
            if (dropdownOptions[key]) {
                return (
                    <Select
                        name={name}
                        value={values[name] ? values[name] : " "}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value={" "}>
                            <em> {t("Select")} </em>
                            {/* <em>Select {key}</em> */}
                        </MenuItem>
                        {dropdownOptions[key].map(option => (
                            <MenuItem key={option} value={option}>
                                {t(option)}
                            </MenuItem>
                        ))}
                    </Select>
                );
            }

            return (
                <OutlinedInput
                    type="text"
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    placeholder={placeholders[key] || `Enter ${key}`}
                />
            );

        }
    };

    const renderFormFields = (fields, prefix = '', handleChange, values) => {
        return Object.entries(fields).map(([key, value]) => {
            const name = prefix ? `${prefix}.${key}` : key;
            if (["name", "gender", "email", "profile_img", "height", "weight", "colour", "_id", "astro._id",
                "family._id", "professional._id", "birth._id", "astro.img", "__v", "marital_status"
            ].includes(name)) {
                return
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return (
                    <>
                        <Grid item xs={12} key={name}>
                            <Typography variant="h3" color="textPrimary" sx={{ mb: "20px", fontWeight: 500 }}>
                                {t(`${key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")} Details`)}
                            </Typography>

                            <Grid container spacing={2}>
                                {renderFormFields(value, name, handleChange, values)}
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: "40px" }} />
                    </>

                )

            }

            return (
                <Grid key={name} item xs={12} lg={6}>
                    <Grid container>
                        <Grid item xs={12} lg={3} xl={3}>
                            <InputLabel htmlFor={`${name}-input`}>{t(key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "))}</InputLabel>
                        </Grid>
                        <Grid item xs={12} lg={6} xl={9}>
                            {renderField(name, key, value, handleChange, values)}
                            <ErrorMessage name={name} component={FormHelperText} error />
                        </Grid>
                    </Grid>
                </Grid>
            );
        });
    };


    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        let payload = {};
        payload = {
            ...formData,
            ...values,
        }

        if (profileImage.length) {
            payload.profile_img = profileImage;
        }
        if (astroImage !== "") {
            payload.astro.img = astroImage;
        }

        let responseData;

        try {

            if (props.isCreateProfile) {
                responseData = await profileService.createProfile(payload);
            }
            else {
                responseData = await profileService.patchProfile(payload);
            }
            if (responseData.status === 200) {
                props.setProfile(responseData.data.data);
                props.setIsCreateProfile(false);
                notifySuccess(props.isCreateProfile ? "Profile crated successfully" : "Profile Saved successfully");
                props.setIsEdit(false);
            }

        } catch (e) {
            notifyError("Error !")
            console.error(e);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={formData}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, handleBlur, handleChange, values, touched, errors, isSubmitting }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12} mb={2} >
                            <MainCard border={false} shadow={3} boxShadow  >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={12} >
                                        <Typography variant="h3" color="textPrimary" sx={{ mb: "20px", fontWeight: 500 }}>
                                            {t("Basic Details")}
                                        </Typography>
                                    </Grid>

                                    <Grid key={"name"} item xs={12} lg={6} sx={{ mb: "8px" }}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"name"}-input`}> {t("name".charAt(0).toUpperCase() + "name".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("name", "name", formData.name, handleChange, values)}
                                                <ErrorMessage name={"name"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid key={"gender"} item xs={12} lg={6} sx={{ mb: "8px" }}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"gender"}-input`}>{t("gender".charAt(0).toUpperCase() + "gender".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("gender", "gender", formData.gender, handleChange, values)}
                                                <ErrorMessage name={"gender"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid key={"marital_status"} item xs={12} lg={6} sx={{ mb: "8px" }}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"marital_status"}-input`}>{t("marital_status".charAt(0).toUpperCase() + "marital_status".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("marital_status", "marital_status", formData.marital_status, handleChange, values)}
                                                <ErrorMessage name={"marital_status"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid key={"height"} item xs={12} lg={6}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"height"}-input`}>{t("height".charAt(0).toUpperCase() + "height".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("height", "height", formData.height, handleChange, values)}
                                                <ErrorMessage name={"height"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid key={"weight"} item xs={12} lg={6}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"weight"}-input`}>{t("weight".charAt(0).toUpperCase() + "weight".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("weight", "weight", formData.weight, handleChange, values)}
                                                <ErrorMessage name={"weight"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid key={"colour"} item xs={12} lg={6}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"colour"}-input`}>{t("colour".charAt(0).toUpperCase() + "colour".slice(1).replace("_", " "))}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("colour", "colour", formData.colour, handleChange, values)}
                                                <ErrorMessage name={"colour"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Divider sx={{ my: "40px" }} />

                                {renderFormFields(formData, '', handleChange, values)}


                                <Grid key={"profile_image"} item xs={12} lg={12}>
                                    <Grid container>
                                        <Grid item xs={12} lg={3} xl={2}>
                                            <InputLabel htmlFor={`${"profile_image"}-input`}>{t("profile_image".charAt(0).toUpperCase() + "profile_image".slice(1).replace("_", " "))}</InputLabel>
                                        </Grid>
                                        <Grid item xs={12} lg={6} xl={10}>
                                            <ImageUploader setProfileImage={setProfileImage} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: "40px" }} />


                                <Grid key={"astrology_image"} item xs={12} lg={12}>
                                    <Grid container>
                                        <Grid item xs={12} lg={3} xl={2}>
                                            <InputLabel htmlFor={`${"astrology_image"}-input`}>{t("astrology_image".charAt(0).toUpperCase() + "astrology_image".slice(1).replace("_", " "))}</InputLabel>
                                        </Grid>
                                        <Grid item xs={12} lg={6} xl={10}>
                                            <ImageUploader title={"astrology_image"} setAstroImage={setAstroImage} />
                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid container spacing={2} alignContent={"right"} >
                                    <Grid item xs={2} alignContent={"flex-end"}  >
                                        <AnimateButton>
                                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="button" variant="contained" color="primary"
                                                onClick={() => props.setIsEdit(false)}
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <AnimateButton>
                                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                                {t("Save")}
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                </Grid>
                            </MainCard>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

export default ProfileForm;
