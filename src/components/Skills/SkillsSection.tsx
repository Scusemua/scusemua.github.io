"use client";
import {Skills, SkillsData} from "@data/SkillsData";
import {Variants, motion} from "framer-motion";
import React, {forwardRef} from "react";
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

interface SkillsSectionProps { }

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
));
export default SkillsSection;