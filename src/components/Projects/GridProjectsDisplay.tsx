import {Project} from "@data/ProjectsData";
import {Grid2, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import React from "react";
import styles from "@styles/components/Projects.module.scss";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {motion} from "framer-motion";

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
                       className={styles.projects_container}>
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
                className={styles.projects_container}
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
                            <ProjectDisplay
                                toggleExpansion={toggleProjectExpanded}
                                expanded={expandedProjects.get(project.name) || false}
                                project={project}
                                is_xs={mq_xs}
                            />
                        </Grid2>
                    );
                })}
            </Grid2>
        </motion.div>
    );
}

export default GridProjectsDisplay;