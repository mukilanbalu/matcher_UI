import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import profileImg from "../../assets/images/profile.png"
import imgPlaceholder from "../../assets/images/imagePlaceholder.jpg"
import { useTranslation } from 'react-i18next';

const ImageUploader = (props) => {
    const [images, setImages] = useState([]);
    const [isBigFile, setIsBigFile] = useState(false);

    const imgPickerRef = useRef();
    const { t } = useTranslation();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        const imagesArray = [];
        if (files) {
            const fileSizeInBytes = files?.map((file) => file.size);
            const fileSizeInMB = fileSizeInBytes.map((file) => (file / (1024 * 1024)).toFixed(2));

            const maxSizeInMB = 5;

            if (fileSizeInMB?.some((el) => el > maxSizeInMB)) {
                setIsBigFile(true);
                return;
            }
        }
        setIsBigFile(false);
        const processImage = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagesArray.push(e.target.result);
                    resolve();
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        };

        const processImages = () => {
            const promises = files.map(processImage);
            return Promise.all(promises);
        };

        processImages().then(() => {
            setImages(imagesArray);
            if (props.title !== "astrology_image") {
                props.setProfileImage(imagesArray)
            } else {
                props.setAstroImage(imagesArray[0])
            }
        }).catch((error) => {
            console.error('Error processing images:', error);
        });
    };

    const handelImagePick = () => {
        imgPickerRef.current.click();
    };

    return (
        <Grid item xs={12} lg={12} mb={2}>
            <input
                id={props.id}
                ref={imgPickerRef}
                type="file"
                accept='.jpg , .png, .jpeg, .JPG, .JPEG, .PNG'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                // multiple={props.title !== "astrology_image"}
                multiple={false}
            />
            <Stack spacing={1} direction={'row'} >

                <Box border={0.1} sx={{ width: "100%" }}>
                    {images.length ?
                        <>{images.map((previewImage) =>
                            < Box
                                shadow={3}
                                boxShadow
                                component={"img"}
                                src={previewImage}
                                sx={{
                                    height: 250,
                                    maxWidth: "100%",
                                }}
                            />

                        )}
                        </> :
                        <Box
                            shadow={3}
                            boxShadow
                            component={"img"}
                            src={props.isProfile ? profileImg : imgPlaceholder}

                            sx={{
                                height: 250,
                                maxWidth: "100%",
                                display: "block",
                                margin: "5px auto"
                            }}
                        />}
                </Box>

            </Stack>
            <Button variant='contained' size='sm' onClick={handelImagePick} sx={{ mx: "30px", mt: "15px", float: "right" }} >
                {t("Upload image")}
            </Button>

            {isBigFile &&
                <Typography variant="body1" color="error">
                    {t("File size exceeds the maximum limit of 5MB.")}
                </Typography>
            }
        </Grid>
    )
}

export default ImageUploader;