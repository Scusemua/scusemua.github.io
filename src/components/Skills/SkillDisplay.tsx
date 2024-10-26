import styles from "../../styles/components/Skills.module.scss";
import {Variants, motion} from "framer-motion";

import React from "react";

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
                scale: 1.12,
            }}
            className={`${styles.skills_body_within_category_container_skill}`}
        >
            {props.skillName}
        </motion.div>
    );
};
export default SkillDisplay;