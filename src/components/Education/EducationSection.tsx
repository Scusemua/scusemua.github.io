"use client";
import React from "react";
import styles from "@src/styles/components/Education.module.scss";
import Typography from "@mui/material/Typography";
import {AllDegreeInfo, DegreeInfo} from "@data/EducationData";
import DegreeDisplay from "@src/components/Education/DegreeDisplay";
import {Grid2} from "@mui/material";
import {motion} from "framer-motion";

const degreeVariant = {
    hidden: {y: 20, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

const EducationSection: React.FunctionComponent = () => {
    return (
        <div className={`${styles.education}`} id="skills">
            <Typography variant={"h2"} className={styles.education_header_text}>Education</Typography>

            <motion.div
                variants={degreeVariant}
                initial="hidden"
                animate="visible"
            >
                <Grid2 container rowSpacing={4} columnSpacing={8} sx={{
                    'padding': '3rem',
                }}>
                    {AllDegreeInfo.map((degree: DegreeInfo, index: number) => (
                        <Grid2 key={index} size={4}>
                            <DegreeDisplay degree={degree}/>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>
        </div>
    );
};
export default EducationSection;