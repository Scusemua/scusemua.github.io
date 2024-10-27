import styles from "@src/styles/components/Skills.module.scss";
import {Variants, motion} from "framer-motion";

import React from "react";
import Typography from "@mui/material/Typography";

interface SkillProps {
    skillName: string;
}

const SkillAnimationVariant: Variants = {
    initial: {
        opacity: 0,
        x: "-50%",
    },
    animate: {
        opacity: 1,
        x: "0%",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        },
    },
};

const SkillDisplay: React.FunctionComponent<SkillProps> = (props: SkillProps) => {
    return (
        <motion.div
            variants={SkillAnimationVariant}
            whileHover={{
                scale: 1.08,
            }}
            className={`${styles.skills_category_container_skill}`}
            style={{
                margin: "0 auto",
            }}
        >
            <Typography variant={"h5"}>{props.skillName}</Typography>
        </motion.div>
    );
};
export default SkillDisplay;