import { Box, Button, Grid, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import profileImg from "../../assets/images/profile.png"
import imgPlaceholder from "../../assets/images/imagePlaceholder.jpg"
import { useAuth0 } from '@auth0/auth0-react';

const ImageUploader = (props) => {
    const [images, setImages] = useState([])
    const imgPickerRef = useRef();
    const [previewImages, setPreviewImages] = useState([])
    const { user } = useAuth0();



    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        const imagesArray = [];

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
            console.log(imagesArray)
        }).catch((error) => {
            console.error('Error processing images:', error);
        });
    };

    // useEffect(() => {
    //     if (!images?.length) {
    //         return;
    //     }

    //     const fileReaders = [];
    //     const previews = [];

    //     Array.from(images).forEach((file, index) => {
    //         const fileReader = new FileReader();
    //         fileReaders.push(fileReader);

    //         fileReader.onload = () => {
    //             previews.push(fileReader.result);

    //             // When all files are read, update the state
    //             if (previews.length === images.length) {
    //                 setPreviewImages(previews);
    //             }
    //         };

    //         fileReader.readAsDataURL(file);
    //     });



    //     // Clean up
    //     return () => {
    //         fileReaders.forEach((fileReader) => {
    //             if (fileReader.readyState === 1) {
    //                 fileReader.abort();
    //             }
    //         });
    //     };
    // }, [images]);


    const handelImageUpload = (event) => {
        if (event.target.files && event.target.files.length) {
            const selectedImage = event.target.files;
            setImages(selectedImage)
            let email = user.email;
            const newFiles = Object.values(event.target.files).map((file, index) =>
                new File([file], `${email?.replace(/[^a-zA-Z0-9]/g, '_')}_${props.title === "astrology_image" ? "astro" : "profile"}_${index + 1}.${file.name.split('.').pop()}`, { type: file.type })
            )
            const base64Img = handleFileChange(event);
            console.log(base64Img);

            if (props.title !== "astrology_image") {
                props.setProfileImage(newFiles)
            } else {
                props.setAstroImage(newFiles[0])
            }

        };
    }
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
                multiple={props.title !== "astrology_image"}
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
                Upload Image
            </Button>
        </Grid>
    )
}

export default ImageUploader;