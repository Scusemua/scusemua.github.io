"use client";

import styles from "@src/styles/components/Projects.module.scss";

import React, {forwardRef} from "react";

import {Stack, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import {CurrentProjects, PreviousProjects, Project} from "@data/ProjectsData";
import theme from "@src/app/theme";

import "@styles/embla.css"
import CarouselProjectsDisplay from "@src/components/Projects/CarouselProjectsDisplay";
import GridProjectsDisplay from "@src/components/Projects/GridProjectsDisplay";
import {useSettings} from "@src/components/Context/SettingsContext";
import Wave from "@src/components/Effects/Wave";

interface ProjectsDisplayProps {
    projects: Project[];
    variant: 'grid' | 'carousel';
    dark_card_actions?: boolean;
}

const ProjectsDisplay: React.FunctionComponent<ProjectsDisplayProps> = (props: ProjectsDisplayProps) => {
    if (props.variant === 'carousel') {
        return <CarouselProjectsDisplay projects={props.projects} dark_card_actions={props.dark_card_actions}/>
    }

    return <GridProjectsDisplay projects={props.projects} dark_card_actions={props.dark_card_actions}/>
}

// const Projects: React.FunctionComponent = () => {
const Projects = forwardRef<HTMLDivElement>((_props, ref) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));

    const {darkCardActionArea} = useSettings();

    return (
        <Stack
            className={styles.project_section} ref={ref}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >

            <Typography variant={mq_xs ? "h2" : "h1"}
                        className={styles.project_section_header_text}>
                Research
            </Typography>

            <Typography variant={(mq_xs || mq_sm) ? "h3" : "h2"}
                        className={styles.project_section_subheader_text}>
                Published Research Projects
            </Typography>

            <ProjectsDisplay projects={PreviousProjects} variant={'carousel'}
                             dark_card_actions={darkCardActionArea}/>

            <Typography variant={(mq_xs || mq_sm) ? "h3" : "h2"}
                        className={styles.project_section_subheader_text}>
                Work-in-Progress Research Projects
            </Typography>

            {/* These are displayed as a static grid for Large and XL screens and a carousel for <= Medium screens. */}
            <ProjectsDisplay projects={CurrentProjects} variant={mq_md_or_less ? "carousel" : 'grid'}
                             dark_card_actions={darkCardActionArea}/>
        </Stack>
    )
});

Projects.displayName = "Projects";

export default Projects;