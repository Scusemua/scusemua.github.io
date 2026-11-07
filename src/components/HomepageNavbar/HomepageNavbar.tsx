import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import headshot from '@images/headshot_solid.webp'
import Image from "next/image";
import styles from "@src/styles/components/Headshot.module.scss";
import {Stack} from "@mui/material";
import {SectionRef} from "@src/types";
import {scrollToRef} from "@src/utils/scrollToRef";

interface NavbarProps {
    headshotRef: SectionRef | undefined;
    projectRef: SectionRef | undefined;
    employmentHistoryRef: SectionRef | undefined;
    educationRef: SectionRef | undefined;
    skillsRef: SectionRef | undefined;
    awardRef: SectionRef | undefined;
}

interface NavButtonProps {
    sectionRef: SectionRef | undefined;
    label: string;
}

const navButtonSx = {my: {xs: 1, sm: 2}, color: 'white', display: 'block', whiteSpace: 'nowrap', minWidth: 'auto', px: {xs: 0.5, sm: 2}} as const;
const navButtonTypographySx = {typography: {xs: 'caption', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}} as const;
const hideOnXsSx = {display: {xs: 'none', sm: 'block'}} as const;

const NavButton: React.FunctionComponent<NavButtonProps> = ({sectionRef, label}) => (
    <Button
        aria-label={`Go to ${label} Section`}
        onClick={() => scrollToRef(sectionRef)}
        sx={navButtonSx}
    >
        <Typography sx={navButtonTypographySx}>
            <b>{label}</b>
        </Typography>
    </Button>
);

const HomepageNavbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: "rgba(0,0,0,0.31)",
                overflow: "hidden",
                margin: "0 auto",
            }}
        >
            <Container>
                <Toolbar disableGutters>
                    <Stack direction={'row'} spacing={{xs: 0.5, sm: 1, md: 4, lg: 8, xl: 10}}
                           alignItems={'center'} justifyContent={'center'}
                           sx={{margin: "0 auto", width: "100%", flexWrap: 'wrap'}}>
                        <IconButton
                            aria-label="Go to top"
                            onClick={() => scrollToRef(props.headshotRef)}
                            sx={{p: {xs: 0.5, sm: 1}}}>
                            <Avatar sx={{width: {xs: 36, sm: 50}, height: {xs: 36, sm: 50}}}>
                                <Image
                                    className={styles.headshot_container_image}
                                    src={headshot}
                                    alt={"Ben's Headshot Avatar"}
                                    width={50}
                                    height={50}
                                    priority={true}
                                />
                            </Avatar>
                        </IconButton>
                        <NavButton sectionRef={props.projectRef} label="Research"/>
                        <Button
                            aria-label="Go to Awards Section"
                            onClick={() => scrollToRef(props.awardRef)}
                            sx={{...navButtonSx, ...hideOnXsSx}}
                        >
                            <Typography sx={navButtonTypographySx}><b>Awards</b></Typography>
                        </Button>
                        <NavButton sectionRef={props.educationRef} label="Education"/>
                        <NavButton sectionRef={props.employmentHistoryRef} label="Employment"/>
                        <Button
                            aria-label="Go to Skills Section"
                            onClick={() => scrollToRef(props.skillsRef)}
                            sx={{...navButtonSx, ...hideOnXsSx}}
                        >
                            <Typography sx={navButtonTypographySx}><b>Skills</b></Typography>
                        </Button>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default HomepageNavbar;