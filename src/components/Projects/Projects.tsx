import styles from "../../styles/components/Projects.module.scss";

import React from "react";

import {Button, Grid2, Stack, Tooltip} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, ProjectData} from "@data/Projects";
import ProjectDisplay from "@src/components/Projects/Project";

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

                <Grid2 container rowSpacing={4} columnSpacing={8} sx={{
                    'padding': '3rem',
                }}>
                    {ProjectData.map((project: Project) => (
                        <Grid2 size={{'xs': 4, 'sm': 4, 'md': 4, 'lg': 4, 'xl': 3}} key={`project-${project.name}-display`}>
                            <ProjectDisplay project={project}/>
                        </Grid2>
                    ))}
                </Grid2>
            </Stack>
        </div>
    );
};
export default Projects;