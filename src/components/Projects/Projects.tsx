"use client";

import styles from "@src/styles/components/Projects.module.scss";

import React, {forwardRef} from "react";

import {Grid2, Stack, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import {CurrentProjects, PreviousProjects, Project} from "@data/ProjectsData";
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

const CarouselProjectsDisplay = ({projects}: { projects: Project[] }) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [expandedProjects, setExpandedProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

    React.useEffect(() => {
        projects.forEach((project: Project) => {
            setExpandedProjects(prev => new Map(prev).set(project.name, false));
        })
    }, [])

    const onProjectSelectedIndexChanged = (selectedIndex: number) => {
        projects.forEach((project: Project, index: number) => {
            if (selectedIndex === index) {
                return;
            }

            if (expandedProjects.get(project.name)) {
                setExpandedProjects(prev => new Map(prev).set(project.name, false));
            }
        })
    }

    const toggleProjectExpanded = (name: string, expanded: boolean) => {
        setExpandedProjects(prev => new Map(prev).set(name, expanded));
    }

    return (<EmblaCarousel className={styles.project_container}
                           slides={projects.map((project: Project, idx: number) => {
                               return (
                                   <ProjectDisplay key={`project-${idx}-${project.name}`}
                                                   project={project}
                                                   is_xs={mq_xs || mq_sm || mq_md}
                                                   toggleExpansion={toggleProjectExpanded}
                                                   expanded={expandedProjects.get(project.name) || false}
                                   />
                               );
                           })}
                           autoplayEnabled={true}
                           onSelectedIndexChanged={onProjectSelectedIndexChanged}
                           options={{
                               loop: true,
                           }}
    />);
}

const GridProjectsDisplay = ({projects}: { projects: Project[] }) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [expandedProjects, setExpandedProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

    React.useEffect(() => {
        projects.forEach((project: Project) => {
            setExpandedProjects(prev => new Map(prev).set(project.name, false));
        })
    }, [])

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

    const toggleProjectExpanded = (name: string, expanded: boolean) => {
        setExpandedProjects(prev => new Map(prev).set(name, expanded));
    }

    if (mq_xs || mq_sm) {
        return (<Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                       className={styles.project_container}>
            {projects.map((project: Project) => (
                <ProjectDisplay
                    toggleExpansion={toggleProjectExpanded}
                    expanded={expandedProjects.get(project.name) || false}
                    project={project}
                    is_xs={mq_xs}
                />
            ))}
        </Grid2>)
    }

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
                                    toggleExpansion={toggleProjectExpanded}
                                    expanded={expandedProjects.get(project.name) || false}
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

            {/*{getCurrentProjectsAsCarousel()}*/}
        </Stack>
    )
});

export default Projects;