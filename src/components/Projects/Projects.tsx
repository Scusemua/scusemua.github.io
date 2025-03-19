"use client";

import styles from "@src/styles/components/Projects.module.scss";

import React, {forwardRef} from "react";

import {Grid2, Stack, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import {CurrentProjects, PastProjects, Project} from "@data/ProjectsData";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {motion} from "framer-motion";
import theme from "@src/app/theme";

import EmblaCarousel from "@src/components/Carousel/EmblaCarousel";

import "@styles/embla.css"

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

    const [expandedPastProjects, setExpandedPastProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());
    const [expandedCurrentProjects, setExpandedCurrentProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

    React.useEffect(() => {
        PastProjects.forEach((project: Project) => {
            setExpandedPastProjects(prev => new Map(prev).set(project.name, false));
        })

        CurrentProjects.forEach((project: Project) => {
            setExpandedCurrentProjects(prev => new Map(prev).set(project.name, false));
        })
    }, [])

    const toggleExpansionOfPastProject = (name: string, expanded: boolean) => {
        setExpandedPastProjects(prev => new Map(prev).set(name, expanded));
    }

    const toggleExpansionOfCurrentProject = (name: string, expanded: boolean) => {
        setExpandedCurrentProjects(prev => new Map(prev).set(name, expanded));
    }

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

    const getPastProjectsAsGrid = (projects: Project[]) => {
        if (mq_xs || mq_sm) {
            return (<Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                           className={styles.project_container}>
                {projects.map((project: Project) => (
                    <Grid2 style={{display: 'flex'}} size={{'xs': 12, 'sm': 12}}
                           component={motion.div} variants={cardVariant} justifyContent={'center'} alignItems="stretch"
                           whileHover={{
                               scale: 1.05,
                           }}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{once: true, amount: 0.125}}
                           key={`project-${project.name}-display`}>
                        <ProjectDisplay
                            toggleExpansion={toggleExpansionOfPastProject}
                            expanded={expandedPastProjects.get(project.name) || false}
                            project={project}
                            is_xs={mq_xs}
                        />
                    </Grid2>
                ))}
            </Grid2>)
        } else {
            return (
                <motion.div variants={cardContainerVariant}
                            initial="hidden"
                            whileInView="visible"
                            style={{
                                width: "90%",
                                margin: "0 auto",
                            }}
                            viewport={{once: true, amount: 0.125, margin: getAnimMargin()}}
                >
                    <Grid2
                        container
                        rowSpacing={4}
                        columnSpacing={8}
                        className={styles.project_container}
                        sx={{
                            marginBottom: "4rem",
                        }}
                    >
                        {projects.map((project: Project, index: number) => {
                            return (
                                <Grid2 size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 4, 'xl': 4}}
                                       component={motion.div}
                                       variants={cardVariant}
                                       sx={{
                                           margin: "0 auto",
                                       }}
                                       whileHover={!mq_xs ? {
                                           scale: 1.05,
                                       } : undefined}
                                       key={`project-${project.name}-display-${index}`}>
                                    <div style={{overflow: "hidden"}}
                                         className={styles.project_section_card}>
                                        <ProjectDisplay
                                            toggleExpansion={toggleExpansionOfPastProject}
                                            expanded={expandedPastProjects.get(project.name) || false}
                                            project={project}
                                            is_xs={mq_xs}
                                        />
                                    </div>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                </motion.div>
            );
        }
    }

    const getSlides = (pastProjects: boolean): React.JSX.Element[] => {
        if (pastProjects) {
            return PastProjects.map((project: Project, idx: number) => {
                return (
                    <ProjectDisplay key={`project-${idx}-${project.name}`}
                                    project={project}
                                    is_xs={mq_xs || mq_sm || mq_md}
                                    toggleExpansion={toggleExpansionOfPastProject}
                                    expanded={expandedPastProjects.get(project.name) || false}
                    />
                );
            });
        }

        return CurrentProjects.map((project: Project, idx: number) => {
            return (
                <ProjectDisplay key={`project-${idx}-${project.name}`}
                                project={project}
                                is_xs={mq_xs || mq_sm || mq_md}
                                toggleExpansion={toggleExpansionOfCurrentProject}
                                expanded={expandedCurrentProjects.get(project.name) || false}
                />
            );
        });
    }

    const onPastProjectSelectedIndexChanged = (selectedIndex: number) => {
        PastProjects.forEach((project: Project, index: number) => {
            if (selectedIndex === index) {
                return;
            }

            if (expandedPastProjects.get(project.name)) {
                setExpandedPastProjects(prev => new Map(prev).set(project.name, false));
            }
        })
    }

    const onCurrentProjectSelectedIndexChanged = (selectedIndex: number) => {
        CurrentProjects.forEach((project: Project, index: number) => {
            if (selectedIndex === index) {
                return;
            }

            if (expandedCurrentProjects.get(project.name)) {
                setExpandedCurrentProjects(prev => new Map(prev).set(project.name, false));
            }
        })
    }

    const getCurrentProjectsAsCarousel = () => {
        return (
            <EmblaCarousel className={styles.project_container}
                           is_md_or_less={mq_xs || mq_sm || mq_md}
                           onSelectedIndexChanged={onCurrentProjectSelectedIndexChanged}
                           is_lg={mq_lg}
                           slides={getSlides(false)}
                           autoplayEnabled={true}
                           options={{
                               loop: true,
                           }}
            />
        );
    }

    const getPastProjects = () => {
        if (mq_xs || mq_sm || mq_md || mq_lg) {
            return (<EmblaCarousel className={styles.project_container}
                                   is_md_or_less={mq_xs || mq_sm || mq_md}
                                   is_lg={mq_lg}
                                   slides={getSlides(true)}
                                   autoplayEnabled={true}
                                   onSelectedIndexChanged={onPastProjectSelectedIndexChanged}
                                   options={{
                                       loop: true,
                                   }}
            />);
        }

        return getPastProjectsAsGrid(PastProjects);
    }

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

            {getPastProjects()}

            <Typography variant={(mq_xs || mq_sm) ? "h3" : "h2"}
                        className={styles.project_section_subheader_text}>
                Active Research Projects
            </Typography>

            {getCurrentProjectsAsCarousel()}
        </Stack>
    )
});

export default Projects;