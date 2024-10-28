"use client";
import {Skills, SkillsData} from "@data/SkillsData";
import {Variants, motion} from "framer-motion";
import React from "react";
import styles from "@src/styles/components/Skills.module.scss";
import SkillDisplay from "./SkillDisplay";
import Typography from "@mui/material/Typography";

const skillWrapperVariant: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const SkillsSection: React.FunctionComponent = () => {
    return (
        <div className={`${styles.skills}`} id="skills">
            <Typography variant={"h2"} className={styles.skills_header_text}>Skills</Typography>
            {SkillsData.map((skills: Skills, index: number) => (
                <motion.div
                    variants={skillWrapperVariant}
                    initial="initial"
                    whileInView="animate"
                    viewport={{once: true, amount: "some"}}
                    className={`${styles.skills_body}`}
                    key={index}
                >
                    <Typography variant={"h3"}>
                        {skills.icon} {skills.category.toString()}
                    </Typography>

                    <div
                        className={`${styles.skills_category_container}`}
                    >
                        {skills.skills.map((skill, i) => (
                            <div key={i}>
                                <SkillDisplay key={i} skillName={skill}/>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
export default SkillsSection;