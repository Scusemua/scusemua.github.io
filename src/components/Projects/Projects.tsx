import styles from "@src/styles/components/Projects.module.scss";

import React, {forwardRef} from "react";

import {Button, Card, Grid2, Stack, Tooltip, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, PastProjects, CurrentProjects} from "@data/ProjectsData";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {Variant, motion, Variants, useInView} from "framer-motion";
import theme from "@src/app/theme";

const cardContainerVariant = {
    hidden: {
        opacity: 1,
    },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.125,
            staggerChildren: 0.35,
            bounce: 0.4,
            duration: 0.75,
        }
    }
}

const cardVariant = {
    hidden: {
        y: 10,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

interface ProjectsProps {
}

// const Projects: React.FunctionComponent = () => {
const Projects = forwardRef<HTMLInputElement, ProjectsProps>((_props: ProjectsProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getAnimMargin = (): string => {
        if (mq_xl) {
            return "-50px";
        } else if (mq_lg) {
            return "45px";
        } else if (mq_md) {
            return "75px";
        } else if (mq_sm) {
            return "125px";
        }

        return "150px";
    }

    const getProjects = (projects: Project[]) => {
        if (mq_xs || mq_sm) {
            return (<Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                           className={styles.project_container}>
                {projects.map((project: Project, index: number) => (
                    <Grid2 style={{display: 'flex'}} size={{'xs': 12, 'sm': 12}}
                           component={motion.div} variants={cardVariant} sx={{justifyContent: 'center'}}
                           whileHover={{
                               scale: 1.05,
                           }}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{once: true, amount: 0.125}}
                           key={`project-${project.name}-display`}>
                        <ProjectDisplay project={project}/>
                    </Grid2>
                ))}
            </Grid2>)
        } else {
            return (
                <motion.div variants={cardContainerVariant}
                            initial="hidden"
                            whileInView="visible"
                            style={{
                                width: "100%",
                                margin: "0 auto",
                            }}
                            viewport={{once: true, amount: 0.125, margin: getAnimMargin()}}
                            onViewportEnter={() => console.log("Project Section has entered viewport")}>
                    <Grid2
                        container
                        rowSpacing={4}
                        columnSpacing={8}
                        className={styles.project_container}
                        sx={{
                            marginBottom: "4rem",
                        }}
                    >
                        {projects.map((project: Project) => {
                            return (
                                <Grid2 size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 4, 'xl': 4}}
                                       component={motion.div}
                                       variants={cardVariant}
                                       sx={{
                                           margin: "0 auto",
                                       }}
                                       whileHover={{
                                           scale: 1.05,
                                       }}
                                       key={`project-${project.name}-display`}>
                                    <div style={{overflow: "hidden"}}>
                                        <ProjectDisplay project={project}/>
                                    </div>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                </motion.div>
            );
        }
    }

    return (<div className={styles.project_section} ref={ref}>
        <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Typography variant={"h2"}
                        className={styles.project_section_header_text}>
                Research
            </Typography>

            <Typography variant={"h3"}
                        className={styles.project_section_subheader_text}>
                Past Research Projects
            </Typography>

            {getProjects(PastProjects)}

            <Typography variant={"h3"}
                        className={styles.project_section_subheader_text}>
                Ongoing Research Projects
            </Typography>

            {getProjects(CurrentProjects)}
        </Stack>
    </div>)
});

export default Projects;