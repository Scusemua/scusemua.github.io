"use client";
import React from "react";
import styles from "@src/styles/components/Education.module.scss";
import Typography from "@mui/material/Typography";
import {AllDegreeInfo, DegreeInfo} from "@data/EducationData";
import DegreeDisplay from "@src/components/Education/DegreeDisplay";
import {Card, Grid2} from "@mui/material";
import {motion, Variants} from "framer-motion";

const degreeContainerVariant = {
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
            <Typography
                variant={"h2"} className={styles.education_header_text}>Education</Typography>

            <motion.div variants={degreeContainerVariant}
                        initial="hidden"
                        whileInView="visible"
                viewport={{once: true, amount: 0.5}}
                onViewportEnter={() => console.log("Education Section has entered viewport")}
            >
                <Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch" sx={{
                    'padding': '3rem',
                }}>
                    {AllDegreeInfo.map((degree: DegreeInfo, index: number) => (
                        <Grid2 key={`degree-card-${degree.degree}`} style={{display: 'flex'}}
                               size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 4}}
                               component={motion.div} className="item" variants={degreeVariant}
                               whileHover={{
                                   scale: 1.05,
                               }}
                        >
                            <Card style={{width: "100%"}}>
                                <DegreeDisplay degree={degree}/>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>
        </div>
    )
        ;
};
export default EducationSection;