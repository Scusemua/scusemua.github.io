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

interface ProjectsProps {
}

interface ProjectsDisplayProps {
    projects: Project[];
    variant: 'grid' | 'carousel';
}

const ProjectsDisplay: React.FunctionComponent<ProjectsDisplayProps> = (props: ProjectsDisplayProps) => {
    if (props.variant === 'carousel') {
        return <CarouselProjectsDisplay projects={props.projects}/>
    }

    return <GridProjectsDisplay projects={props.projects}/>
}

// const Projects: React.FunctionComponent = () => {
const Projects = forwardRef<HTMLInputElement, ProjectsProps>((_props: ProjectsProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    return (
        <Stack
            className={styles.project_section} ref={ref}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Typography variant={"h2"}
                        className={styles.project_section_header_text}>
                Research
            </Typography>

            <Typography variant={(mq_xs || mq_sm) ? "h3" : "h2"}
                        className={styles.project_section_subheader_text}>
                Past Research Projects
            </Typography>

            <ProjectsDisplay projects={PreviousProjects} variant={mq_xl ? 'grid' : 'carousel'}/>

            <Typography variant={(mq_xs || mq_sm) ? "h3" : "h2"}
                        className={styles.project_section_subheader_text}>
                Active Research Projects
            </Typography>

            <ProjectsDisplay projects={CurrentProjects} variant={'carousel'}/>
        </Stack>
    )
});

export default Projects;