import React, { useState, useEffect } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, InputLabel, OutlinedInput, FormHelperText, Button, Select, MenuItem, Typography, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import _ from 'lodash';
import ImageUploader from 'components/imgae-uploader/image-uploader';
import profileService from 'apiServices/profileService';
import { isEmpty } from 'lodash';
import { useAuth0 } from '@auth0/auth0-react';
const initialValues = {
    name: "",
    email: "",
    profile_img: "",
    gender: "",
    height: "",
    weight: "",
    colour: " ",
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
        married_brother: 0,
        married_sisters: "",
        mobile: "",
        address: "",
        _id: ""
    },
    astro: {
        gothram: "",
        rasi: "",
        nakshatram: "",
        patham: "",
        lagnam: "",
        img: "",
        _id: ""
    },
};

const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Required'),
});

const renderField = (name, key, value, handleChange, values) => {

    const dropdownOptions = {
        gender: ["Male", "Female", "Other"],
        colour: ["Fair", "Wheatish", "Dusky", "Light Brown"],
        rasi: ["Mesham", "Rishabam", "Mithunam", "Kadagam", "Simmam", "Kanni", "Thulam", "Vrichigam", "Dhanusu", "Makaram", "Kumbham", "Meenam"],
        nakshatram: [
            "Ashwini", "Bharani", "Karthigai", "Rohini", "Mrigashira", "Thiruvathira", "Punarpoosam", "Pooyam", "Aayilyam", "Magam", "Pooram", "Uthiram", "Hastham", "Chithirai", "Swati", "Visakam", "Anuradam", "Keetai", "Moolam", "Pooradam", "Uthradam", "Thiruvonam", "Avittam", "Sadhayam", "Poorattathi", "Uthrattathi", "Revathi"
        ]

    };

    const placeholders = {
        name: "Enter your name",
        email: "Enter your email",
        profile_img: "Enter profile image URL",
        height: "Eg: 5 ft 4 in",
        weight: "Eg: 65kg",
        mobile: "eg: 9876543210",
        address: "Enter address",
        dob: "eg: DD / MM / YYYY",
        time: " eg: 12:30  AM / PM",
        day: "Day",
        age: "Age",
        place: "Place",
        tamil_year: "Year",
        job: " eg: software / doctor / lawyer / accountant / business",
        sector: "eg: IT / civil / medical / BPO / Government ",
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
                        <em>Select {key}</em>
                    </MenuItem>
                    {dropdownOptions[key].map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
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
                        <em>Select {key}</em>
                    </MenuItem>
                    {dropdownOptions[key].map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
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
            "family._id", "professional._id", "birth._id", "astro.img", "__v"
        ].includes(name)) {
            return
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
                <>
                    <Grid item xs={12} key={name}>
                        <Typography variant="h3" color="textPrimary" sx={{ mb: "20px", fontWeight: 500 }}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")} Details
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
                        <InputLabel htmlFor={`${name}-input`}>{key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}</InputLabel>
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

const ProfileForm = (props) => {
    const [formData, setFormData] = useState(props.profile);
    const [profileImage, setProfileImage] = useState([]);
    const [astroImage, setAstroImage] = useState([]);


    const { user } = useAuth0();

    // const handleChange = (e) => {

    // const { name, value } = e.target;
    // setChangedValues((prevState) => ({
    //     ...prevState,
    //     [name]: value
    // }));
    // setFormData((prevState) => ({
    //     ...prevState,
    //     [name]: value
    // }));

    //     const { name, value } = e.target;

    //     // Use lodash's set function to handle nested updates
    //     setFormData((prevState) => {
    //         const newState = _.cloneDeep(prevState);
    //         _.set(newState, name, value);
    //         return newState;
    //     });

    //     setChangedValues((prevState) => {
    //         const newState = _.cloneDeep(prevState);
    //         _.set(newState, name, value);
    //         return newState;
    //     });

    // };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        // Only log changed values
        const formData = new FormData();

        delete values.profile_img
        delete values.astro.img
        const appendFormData = (data, root = '') => {
            for (const key in data) {
                if (data[key] instanceof FileList && key !== 'profile_img') {
                    for (let i = 0; i < data[key].length; i++) {
                        formData.append(`${root}${key}[]`, data[key][i]);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null && key !== 'profile_img') {
                    appendFormData(data[key], `${root}${key}.`);
                }
                else {
                    formData.append(`${root}${key}`, data[key]);
                }
            }
        };

        profileImage.forEach((profile, index) => {
            formData.append('profile_img', profile);
        })

        formData.append('astro_img', astroImage[0]);

        appendFormData(values);
        let responseData;

        try {

            if (props.isCreateProfile) {
                formData.delete('email');
                formData.append('email', user.email);
                responseData = await profileService.createProfile(formData);
            }
            else {
                responseData = await profileService.patchProfile(formData);
            }
            if (responseData.status === 200) {
                props.setProfile(responseData.data.data);
                props.setIsCreateProfile(false);
                props.setIsEdit(false);
            }

        } catch (e) {
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
                                            Basic Details
                                        </Typography>
                                    </Grid>

                                    <Grid key={"name"} item xs={12} lg={6} sx={{ mb: "8px" }}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"name"}-input`}>{"name".charAt(0).toUpperCase() + "name".slice(1).replace("_", " ")}</InputLabel>
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
                                                <InputLabel htmlFor={`${"gender"}-input`}>{"gender".charAt(0).toUpperCase() + "gender".slice(1).replace("_", " ")}</InputLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} xl={9}>
                                                {renderField("gender", "gender", formData.gender, handleChange, values)}
                                                <ErrorMessage name={"gender"} component={FormHelperText} error />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid key={"height"} item xs={12} lg={6}>
                                        <Grid container>
                                            <Grid item xs={12} lg={3} xl={3}>
                                                <InputLabel htmlFor={`${"height"}-input`}>{"height".charAt(0).toUpperCase() + "height".slice(1).replace("_", " ")}</InputLabel>
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
                                                <InputLabel htmlFor={`${"weight"}-input`}>{"weight".charAt(0).toUpperCase() + "weight".slice(1).replace("_", " ")}</InputLabel>
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
                                                <InputLabel htmlFor={`${"colour"}-input`}>{"colour".charAt(0).toUpperCase() + "colour".slice(1).replace("_", " ")}</InputLabel>
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
                                            <InputLabel htmlFor={`${"profile_image"}-input`}>{"profile_image".charAt(0).toUpperCase() + "profile_image".slice(1).replace("_", " ")}</InputLabel>
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
                                            <InputLabel htmlFor={`${"astrology_image"}-input`}>{"astrology_image".charAt(0).toUpperCase() + "astrology_image".slice(1).replace("_", " ")}</InputLabel>
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
                                                Cancel
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <AnimateButton>
                                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                                Save
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
