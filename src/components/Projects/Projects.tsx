import styles from "@src/styles/components/Projects.module.scss";

import React from "react";

import {Button, Grid2, Stack, Tooltip} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, ProjectData} from "@data/ProjectsData";
import ProjectDisplay from "@src/components/Projects/ProjectDisplay";
import {Variant, motion} from "framer-motion";

const cardContainerVariant = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.125,
            staggerChildren: 0.5
        }
    }
}

const cardVariant = {
    hidden: {y: 20, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.75,
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

                <motion.div
                    variants={cardContainerVariant}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid2 container rowSpacing={4} columnSpacing={8} sx={{
                        'padding': '3rem',
                    }}>
                        {ProjectData.map((project: Project, index: number) => (
                            <Grid2 size={{'xs': 4, 'sm': 4, 'md': 4, 'lg': 4, 'xl': 3}} component={motion.div}
                                   variants={cardVariant}
                                   key={`project-${project.name}-display`}>
                                <ProjectDisplay project={project}/>
                            </Grid2>
                        ))}
                    </Grid2>
                </motion.div>
            </Stack>
        </div>
    );
};
export default Projects;