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
import {Stack, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";

interface NavbarProps {
    headshotRef: React.RefObject<HTMLDivElement> | undefined;
    projectRef: React.RefObject<HTMLDivElement> | undefined;
    employmentHistoryRef: React.RefObject<HTMLDivElement> | undefined;
    educationRef: React.RefObject<HTMLDivElement> | undefined;
    skillsRef: React.RefObject<HTMLDivElement> | undefined;
    awardRef: React.RefObject<HTMLDivElement> | undefined;
}

interface NavButtonProps {
    sectionRef: React.RefObject<HTMLDivElement> | undefined;
    label: string;
}

const NavButton: React.FunctionComponent<NavButtonProps> = ({sectionRef, label}) => (
    <Button
        aria-label={`Go to ${label} Section`}
        onClick={() => sectionRef?.current?.scrollIntoView({behavior: 'smooth', block: 'start'})}
        sx={{my: 2, color: 'white', display: 'block'}}
    >
        <Typography
            sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
        >
            <b>{label}</b>
        </Typography>
    </Button>
);

const HomepageNavbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));

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
                    <Stack direction={'row'} spacing={{'xs': 0, 'sm': 2, 'md': 6, 'lg': 8, 'xl': 10}}
                           alignItems={'center'} justifyContent={'center'}
                           sx={{margin: "0 auto", width: "100%", overflow: "hidden"}}>
                        <IconButton
                            aria-label="Go to top"
                            onClick={() => props.headshotRef?.current?.scrollIntoView({behavior: 'smooth', block: 'start'})}>
                            <Avatar style={{width: 50, height: 50}}>
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
                        {!mq_xs && <NavButton sectionRef={props.awardRef} label="Awards"/>}
                        <NavButton sectionRef={props.educationRef} label={mq_xs ? "School" : "Education"}/>
                        <NavButton sectionRef={props.employmentHistoryRef} label={mq_xs ? "Work" : "Employment"}/>
                        {!mq_xs && <NavButton sectionRef={props.skillsRef} label="Skills"/>}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default HomepageNavbar;