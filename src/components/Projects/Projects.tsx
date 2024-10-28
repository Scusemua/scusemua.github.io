import styles from "@src/styles/components/Projects.module.scss";

import React from "react";

import {Button, Card, Grid2, Stack, Tooltip} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, ProjectData} from "@data/ProjectsData";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {Variant, motion, Variants} from "framer-motion";

const cardContainerVariant = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.125,
            staggerChildren: 0.35
        }
    }
}

const cardVariant = {
    hidden: {y: 20, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delayChildren: 0.125,
            staggerChildren: 0.35,
            duration: 0.5,
        },
    }
}

const Projects: React.FunctionComponent = () => {
    return (
        <div className={styles.project_section}>
            <Stack
                direction={"column"}
                spacing={2} sx={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Typography variant={"h2"} className={styles.project_section_header_text}>Research Projects</Typography>

                <motion.div variants={cardContainerVariant}
                            initial="hidden"
                            animate="visible">
                    <Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch" sx={{
                        'padding': '3rem',
                    }}>
                        {ProjectData.map((project: Project, index: number) => (
                            <Grid2 style={{display: 'flex'}} size={{'xs': 12, 'sm': 12, 'md': 6, 'lg': 4, 'xl': 3}}
                                   component={motion.div} className="item" variants={cardVariant}
                                   whileHover={{
                                       scale: 1.05,
                                   }}
                                   key={`project-${project.name}-display`}>
                                <Card>
                                    <ProjectDisplay project={project}/>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </motion.div>
            </Stack>
        </div>
    );
};
export default Projects;