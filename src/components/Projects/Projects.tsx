import styles from "@src/styles/components/Projects.module.scss";

import React, {forwardRef} from "react";

import {Button, Card, Grid2, Stack, Tooltip, useMediaQuery} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, PastProjects, CurrentProjects} from "@data/ProjectsData";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {Variant, motion, Variants, useInView} from "framer-motion";
import theme from "@src/app/theme";

const cardContainerVariant = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.125,
            staggerChildren: 0.35,
            bounce: 0.4,
        }
    }
}

const cardVariant = {
    hidden: {y: 300, opacity: 0},
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

    const getPastProjects = (projects: Project[]) => {
        if (mq_xs || mq_sm) {
            return (<Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                           className={styles.project_container}>
                {projects.map((project: Project) => (
                    <Grid2 style={{display: 'flex'}} size={{'xs': 12, 'sm': 12, 'md': 6, 'lg': 4, 'xl': 4}}
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
            return (<motion.div variants={cardContainerVariant}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true, amount: 0, margin: "500px"}}
                                onViewportEnter={() => console.log("Project Section has entered viewport")}>
                <Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                       className={styles.project_container}>
                    {projects.map((project: Project) => (
                        <Grid2 style={{display: 'flex'}} size={{'xs': 12, 'sm': 12, 'md': 6, 'lg': 4, 'xl': 4}}
                               component={motion.div} variants={cardVariant} sx={{justifyContent: 'center'}}
                               whileHover={{
                                   scale: 1.05,
                               }}
                               key={`project-${project.name}-display`}>
                            <ProjectDisplay project={project}/>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>);
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
                Previous Research Projects
            </Typography>

            {getPastProjects(PastProjects)}

            <Typography variant={"h3"}
                        className={styles.project_section_subheader_text}>
                Ongoing Research Projects
            </Typography>

            {getPastProjects(CurrentProjects)}
        </Stack>
    </div>)
});

export default Projects;