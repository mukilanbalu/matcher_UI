
import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Select, FormControl, InputLabel, MenuItem, Grid, Slider, Stack } from '@mui/material';

const ProfileFilters = (props) => {

    const raasiList = [
        'Mesham',
        'Risabham',
        'Mithunam',
        'Kadagam',
        'Simmam',
        'Kanni',
        'Thulam',
        'Viruchigam',
        'Dhanushu',
        'Magaram',
        'Kumbham',
        'Meenam'
    ];

    const nakshatramList = [
        "Ashwini",
        "Bharani",
        "Karthigai",
        "Rohini",
        "Mrigashira",
        "Thiruvathira",
        "Punarpoosam",
        "Pooyam",
        "Aayilyam",
        "Magam",
        "Pooram",
        "Uthiram",
        "Hastham",
        "Chithirai",
        "Swati",
        "Visakam",
        "Anuradam",
        "Keetai",
        "Moolam",
        "Pooradam",
        "Uthradam",
        "Thiruvonam",
        "Avittam",
        "Sadhayam",
        "Poorattathi",
        "Uthrattathi",
        "Revathi"

    ]



    const handleSubmit = (values) => {
    };
    const handleChange = (values) => {
        props.setProfileFilters({ ...props.profileFilters, [values?.target?.name]: values?.target?.value });
    };

    return (
        <Formik initialValues={props.profileFilters} >
            {({ handleBlur, values, touched, errors, isSubmitting }) => (
                <form noValidate onChange={handleSubmit} >
                    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                        <Grid item xs={12} sm={12} md={12} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Bride / Groom</InputLabel>
                                <Select
                                    name={"gender"}
                                    value={props.profileFilters.gender}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select Bride / Groom</em>
                                    </MenuItem>

                                    <MenuItem key={"Bride"} value={"Bride"}>
                                        Bride
                                    </MenuItem>
                                    <MenuItem key={"Groom"} value={"Groom"}>
                                        Groom
                                    </MenuItem>
                                </Select>
                                <ErrorMessage name="nakshatram" component="div" />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="raasi-label">Raasi</InputLabel>
                                <Select
                                    name={"astro.rasi"}
                                    value={props.profileFilters["astro.rasi"]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select Raasi</em>
                                    </MenuItem>
                                    {raasiList.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <ErrorMessage name="rasip" component="div" />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="nakshatram-label">Nakshatram</InputLabel>
                                <Select
                                    name={"astro.nakshatram"}
                                    value={props.profileFilters["astro.nakshatram"]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select Nakshatram</em>
                                    </MenuItem>
                                    {nakshatramList.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <ErrorMessage name="nakshatram" component="div" />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={3}>
                            <InputLabel id="age-label" sx={{ mr: "15px" }}>Age : {`${props.profileFilters[`birth.age`][0]} - ${props.profileFilters[`birth.age`][1]} `}  </InputLabel>

                            <FormControl fullWidth>
                                <Stack direction={"row-reverse"}>
                                    <Slider
                                        name='birth.age'
                                        // aria-label="age"
                                        // defaultValue={values.age}
                                        onChange={handleChange}
                                        value={props.profileFilters[`birth.age`]}
                                        // getAriaValueText={"age"}
                                        valueLabelDisplay="auto"
                                        // shiftStep={30}
                                        step={1}
                                        // marks
                                        min={21}
                                        max={55} />
                                </Stack>
                                <ErrorMessage name="age" component="div" />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            )
            }
        </Formik >
    );
};

export default ProfileFilters;