"use client";
import {Skills, SkillsData} from "@data/SkillsData";
import {Variants, motion} from "framer-motion";
import React, {forwardRef, ReactElement} from "react";
import styles from "@src/styles/components/Skills.module.scss";
import SkillDisplay from "./SkillDisplay";
import Typography from "@mui/material/Typography";
import Projects from "@src/components/Projects/Projects";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";

const skillWrapperVariant: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface SkillsSectionProps {
    is_xs: boolean;
}

const GetSkill = (skill: string, i: number, isXs: boolean) => {
    if (skill === "{{break}}") {
        return <div key={`skill-line-break-${i}`} style={{flexBasis: "100%", height: 0}}/>;
    }

    return (
        <div style={{marginTop: "2rem"}} key={`skill-${skill}-idx-${i}_wrapper`}>
            <SkillDisplay key={`skill-${skill}-idx-${i}`} skillName={skill} isXs={isXs}/>
        </div>
    );
}

const SkillsSection = forwardRef<HTMLInputElement, SkillsSectionProps>((props: SkillsSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));

    return (<div className={`${styles.skills}`} id="skills" ref={ref}>
        <Typography key="skills_section_header" variant={mq_xs ? "h2" : "h1"} className={styles.skills_header_text}>Skills</Typography>
        {SkillsData.map((skills: Skills, index: number) => (
            <motion.div
                variants={skillWrapperVariant}
                initial="initial"
                whileInView="animate"
                viewport={{once: true, amount: "some"}}
                className={`${styles.skills_body}`}
                key={`skills-category-${skills.category}-${index}`}
            >
                <Typography key={`skills_category_header_${skills.category}`} variant={"h2"} className={styles.skills_body_category_header}>
                    {skills.icon} {skills.category.toString()}
                </Typography>

                <div
                    key={`skills_category_header_${skills.category}_wrapper`}
                    className={`${styles.skills_category_container}`}
                    style={{
                        maxWidth: props.is_xs ? "90%" : "80%",
                    }}
                >
                    {skills.skills.map((skill, i) => {
                        return GetSkill(skill, i, props.is_xs);
                    })}
                </div>
            </motion.div>
        ))}
    </div>)}
);

export default SkillsSection;