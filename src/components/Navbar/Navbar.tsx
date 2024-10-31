import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import headshot from '@images/headshot.jpg'
import Image from "next/image";
import styles from "@src/styles/components/Headshot.module.scss";
import {Stack, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";

interface NavbarProps {
    headshotRef: React.RefObject<HTMLInputElement> | undefined;
    projectRef: React.RefObject<HTMLInputElement> | undefined;
    employmentHistoryRef: React.RefObject<HTMLInputElement> | undefined;
    educationRef: React.RefObject<HTMLInputElement> | undefined;
    skillsRef: React.RefObject<HTMLInputElement> | undefined;
    awardRef: React.RefObject<HTMLInputElement> | undefined;
}

const Navbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));

    const headshotButton = (<IconButton
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
    </IconButton>);

    const projectsButton = (<Button
        key={"projects_section"}
        onClick={() => {
            if (props.projectRef?.current) {
                console.log("Scrolling to Projects section.");
                props.projectRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }}
        sx={{my: 2, color: 'white', display: 'block'}}
    >
        <Typography
            sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
        >
            <b>Research</b>
        </Typography>
    </Button>);

    const getEmploymentButton = (text: string) => (<Button
        key={"employment_history_section"}
        onClick={() => {
            if (props.employmentHistoryRef?.current) {
                console.log("Scrolling to Employment History section.");
                props.employmentHistoryRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }}
        sx={{my: 2, color: 'white', display: 'block'}}
    >
        <Typography
            sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
        >
            <b>{text}</b>
        </Typography>
    </Button>);

    const getEducationButton = (text: string) => (
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
            <Typography
                        sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
            >
                <b>{text}</b>
            </Typography>
        </Button>
    );

    const awardsButton = (
        <Button
            key={"awards_section_button"}
            onClick={() => {
                if (props.educationRef?.current) {
                    console.log("Scrolling to Awards section.");
                    props.educationRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
            }}
            sx={{my: 2, color: 'white', display: 'block'}}
        >
            <Typography
                sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
            >
                <b>Awards</b>
            </Typography>
        </Button>
    );

    const skillsButton = (
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
            <Typography
                sx={{typography: {xs: 'body2', sm: 'body1', md: "body1", lg: "body1", xl: "body1"}}}
            >
                <b>Skills</b>
            </Typography>
        </Button>);

    return (
        <AppBar position="fixed" sx={{bgcolor: "rgba(0,0,0,0.31)", width: "100%", overflow: "hidden"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
                    <Stack direction={'row'} spacing={{'xs': 0, 'sm': 2, 'md': 6, 'lg': 8, 'xl': 10}}
                           sx={{alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
                        {headshotButton}
                        {projectsButton}
                        {getEmploymentButton(mq_xs ? "Work" : "Employment")}
                        {getEducationButton(mq_xs ? "School" : "Education")}
                        {awardsButton}
                        {!mq_xs && skillsButton}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;