"use client";
import React, {forwardRef} from "react";
import styles from "@src/styles/components/Education.module.scss";
import Typography from "@mui/material/Typography";
import {AllDegreeInfo, DegreeInfo} from "@data/EducationData";
import DegreeDisplay from "@src/components/Education/DegreeDisplay";
import {Card, Grid2, Stack} from "@mui/material";
import {motion, Variants} from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";

const degreeContainerVariant = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.35
        }
    }
}

const degreeVariant = {
    hidden: {y: 50, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

interface EducationSectionProps {}

// const EducationSection: React.FunctionComponent<EducationSectionProps> = (props: EducationSectionProps) => {
const EducationSection = forwardRef<HTMLInputElement, EducationSectionProps>((_props: EducationSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => (
    <div className={`${styles.education}`} id="skills" ref={ref}>
        <Typography variant={"h2"} className={styles.education_header_text}>Education</Typography>
        <motion.div variants={degreeContainerVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.25, margin: "475px"}}
                    onViewportEnter={() => console.log("Education Section has entered viewport")}
        >
            <Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                   className={styles.education_degree_container}>
                {AllDegreeInfo.map((degree: DegreeInfo) => (
                    <Grid2 key={`degree-card-${degree.degree}`} style={{display: 'flex', justifyContent: 'center'}}
                           size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 4}}
                           component={motion.div} variants={degreeVariant}
                           whileHover={{
                               scale: 1.05,
                           }}
                    >
                        <DegreeDisplay degree={degree}/>
                    </Grid2>
                ))}
            </Grid2>
        </motion.div>
    </div>
));

export default EducationSection;