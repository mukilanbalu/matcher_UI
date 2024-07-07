
import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Select, FormControl, InputLabel, MenuItem, Grid, Slider, Stack } from '@mui/material';
import { martialStatusList, nakshatramList, workStatusList } from 'constants/appConstants';

const ProfileFilters = (props) => {

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
                        <Grid item xs={12} sm={12} md={6} lg={2}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Looking for</InputLabel>
                                <Select
                                    name={"gender"}
                                    value={props.profileFilters.gender}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Looking for</em>
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

                        <Grid item xs={12} sm={12} md={6} lg={2}>
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



                        <Grid item xs={12} sm={12} md={6} lg={2}>
                            <FormControl fullWidth>
                                <InputLabel id="work_status-label">Wokring status</InputLabel>
                                <Select
                                    name={"professional.work_status"}
                                    value={props.profileFilters["professional.work_status"]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select </em>
                                    </MenuItem>
                                    {workStatusList.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <ErrorMessage name="work_status" component="div" />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={2}>
                            <FormControl fullWidth>
                                <InputLabel id="marital_status-label">Marital status</InputLabel>
                                <Select
                                    name={"marital_status"}
                                    value={props.profileFilters["marital_status"]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select </em>
                                    </MenuItem>
                                    {martialStatusList.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <ErrorMessage name="marital_status" component="div" />
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={12} md={6} lg={2}>
                            <FormControl fullWidth>
                                <InputLabel id="created_on-label"> Profile posted </InputLabel>
                                <Select
                                    name={"created_on"}
                                    value={props.profileFilters["created_on"]}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value={" "}>
                                        <em>Select </em>
                                    </MenuItem>
                                    <MenuItem value={"10"}>
                                        Last 10 days
                                    </MenuItem>
                                    <MenuItem value={"30"}>
                                        Last month
                                    </MenuItem>
                                    <MenuItem value={"90"}>
                                        Last 3 month
                                    </MenuItem>
                                    <MenuItem value={"All"}>
                                        All
                                    </MenuItem>
                                </Select>
                                <ErrorMessage name="created_on" component="div" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={2}>
                            <InputLabel id="age-label" sx={{ mr: "15px" }}>Age : {`${props.profileFilters[`birth.age`][0]} - ${props.profileFilters[`birth.age`][1]} `}  </InputLabel>

                            <FormControl fullWidth>
                                <Stack direction={"row-reverse"}>
                                    <Slider
                                        name='birth.age'
                                        onChange={handleChange}
                                        value={props.profileFilters[`birth.age`]}
                                        valueLabelDisplay="auto"
                                        step={1}
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