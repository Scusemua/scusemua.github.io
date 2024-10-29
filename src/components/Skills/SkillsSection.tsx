"use client";
import {Skills, SkillsData} from "@data/SkillsData";
import {Variants, motion} from "framer-motion";
import React, {forwardRef, ReactElement} from "react";
import styles from "@src/styles/components/Skills.module.scss";
import SkillDisplay from "./SkillDisplay";
import Typography from "@mui/material/Typography";
import Projects from "@src/components/Projects/Projects";

const skillWrapperVariant: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface SkillsSectionProps {
}

const GetSkill = (skill: string, i: number) => {
    if (skill === "{{break}}") {
        return <div style={{flexBasis: "100%", height: 0}}/>;
    }

    return (
        <div style={{marginTop: "2rem"}}>
            <SkillDisplay key={i} skillName={skill}/>
        </div>
    );
}

const SkillsSection = forwardRef<HTMLInputElement, SkillsSectionProps>((_props: SkillsSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => (
    <div className={`${styles.skills}`} id="skills" ref={ref}>
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
                <Typography variant={"h3"} className={styles.skills_body_category_header}>
                    {skills.icon} {skills.category.toString()}
                </Typography>

                <div className={`${styles.skills_category_container}`}>
                    {skills.skills.map((skill, i) => {
                        return GetSkill(skill, i);
                    })}
                </div>
            </motion.div>
        ))}
    </div>
));
export default SkillsSection;