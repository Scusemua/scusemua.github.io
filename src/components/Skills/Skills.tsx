"use client";
import {CloudPlatformSkills, Skills, SkillsData} from "@data/SkillsData";
import {Variants, motion} from "framer-motion";
import React from "react";
import styles from "../../styles/components/Skills.module.scss";
import SkillDisplay from "./SkillDisplay";
import Typography from "@mui/material/Typography";

import CloudIcon from '@mui/icons-material/Cloud';

const skillWrapperVariant: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const Skills: React.FunctionComponent = () => {
    return (
        <div className={`${styles.skills}`} id="skills">
            <Typography variant={"h2"} className={`${styles.skills_header_text}`}>Skills</Typography>

            {SkillsData.map((skills: Skills, index: number) => (
                <motion.div
                    variants={skillWrapperVariant}
                    initial="initial"
                    whileInView="animate"
                    viewport={{once: true, amount: 0.5}}
                    className={`${styles.skills_body}`}
                    key={index}
                >
                    <Typography variant={"h3"}>
                        {skills.icon} {skills.category.toString()}
                    </Typography>

                    <div
                        className={`${styles.skills_body_within_category_container}`}
                    >
                        {skills.skills.map((skill, i) => (
                            <SkillDisplay key={i} skillName={skill}/>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
export default Skills;