import styles from "@src/styles/components/Skills.module.scss";
import {Variants, motion} from "framer-motion";

import React from "react";
import Typography from "@mui/material/Typography";

interface SkillProps {
    skillName: string;
    isXs: boolean;
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

const SkillDisplay: React.FunctionComponent<SkillProps> = React.memo((props: SkillProps) => {
    return (
        <motion.div
            variants={SkillAnimationVariant}
            whileHover={{
                scale: 1.05,
            }}
            className={`${styles.skills_category_container_skill}`}
            style={{
                margin: "0 auto",
                padding: props.isXs ? "0.75rem 0.75rem" : "1rem 2rem"
            }}
        >
            <Typography sx={{typography: {xs: 'body1', sm: 'h6', md: "h6", lg: "h5", xl: "h5"}}}>
                {props.skillName}
            </Typography>
        </motion.div>
    );
});

SkillDisplay.displayName = "SkillDisplay";

export default SkillDisplay;