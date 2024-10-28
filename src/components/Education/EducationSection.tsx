"use client";
import React from "react";
import styles from "@src/styles/components/Education.module.scss";
import Typography from "@mui/material/Typography";
import {AllDegreeInfo, DegreeInfo} from "@data/EducationData";
import DegreeDisplay from "@src/components/Education/DegreeDisplay";
import {Card, Grid2} from "@mui/material";
import {motion, Variants} from "framer-motion";

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

const degreeCardAnimationVariant: Variants = {
    initial: {
        opacity: 0,
        x: "-50%",
    },
    animate: {
        opacity: 1,
        x: "0%",
        transition: {
            type: 'spring',
            stiffness: 25,
            damping: 100,
            mass: 100,
            delay: 0.5,
        },
    },
};

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
                }} alignItems="stretch">
                    {AllDegreeInfo.map((degree: DegreeInfo, index: number) => (
                        <Grid2 component={Card} key={index} size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 4}}
                        >
                            <DegreeDisplay degree={degree}/>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>
        </div>
    );
};
export default EducationSection;