import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import headshot from '@images/headshot.jpg'
import Image from "next/image";
import styles from "@src/styles/components/Headshot.module.scss";
import {PersonalData} from "@data/PersonalData";
import {Stack} from "@mui/material";

interface NavbarProps {
    headshotRef: React.RefObject<HTMLInputElement> | undefined;
    projectRef: React.RefObject<HTMLInputElement> | undefined;
    educationRef: React.RefObject<HTMLInputElement> | undefined;
    skillsRef: React.RefObject<HTMLInputElement> | undefined;
}

const Navbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
    return (
        <AppBar position="fixed" sx={{bgcolor: "rgba(0,0,0,0.31)", width: "100%", overflow: "hidden"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{alignItems: "center", justifyContent: "center"}}>
                    <Stack direction={'row'} spacing={{'xs': 1, 'sm': 2, 'md': 6, 'lg': 8, 'xl': 10}} sx={{alignItems: "center", justifyContent: "center"}}>
                        <IconButton
                            key={"header_section"}
                            onClick={() => {
                                if (props.headshotRef?.current) {
                                    console.log("Scrolling to Headshot section.");
                                    props.headshotRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
                                }
                            }}>
                            <Avatar style={{width: 50, height: 50}}>
                                <Image
                                    className={styles.headshot_container_image}
                                    src={headshot}
                                    alt={"Ben's Headshot"}
                                    width={50}
                                    height={50}
                                />
                            </Avatar>
                        </IconButton>
                        <Button
                            key={"projects_section"}
                            onClick={() => {
                                if (props.projectRef?.current) {
                                    console.log("Scrolling to Projects section.");
                                    props.projectRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
                                }
                            }}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            <Typography variant={"body1"}><b>Research</b></Typography>
                        </Button>
                        <Button
                            key={"education_section"}
                            onClick={() => {
                                if (props.educationRef?.current) {
                                    console.log("Scrolling to Education section.");
                                    props.educationRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
                                }
                            }}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            <Typography variant={"body1"}><b>Education</b></Typography>
                        </Button>
                        <Button
                            key={"skills_section"}
                            onClick={() => {
                                if (props.skillsRef?.current) {
                                    console.log("Scrolling to Skills section.");
                                    props.skillsRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
                                }
                            }}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            <Typography variant={"body1"}><b>Skills</b></Typography>
                        </Button>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;