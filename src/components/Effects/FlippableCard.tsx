import React, {ReactNode} from "react";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import {useSettings} from "@src/components/Context/SettingsContext";
import {motion} from "framer-motion";
import styles from "@styles/components/Education.module.scss";
import Tiltable from "@src/components/Effects/Tiltable";

interface FlippableCardProps {
    height: string | number;
    front: ReactNode;
    back: ReactNode;
}

//Spring animation parameters
const spring = {
    type: "spring",
    stiffness: 75,
    damping: 13,
}

const FlippableCard: React.FunctionComponent<FlippableCardProps> = (props: FlippableCardProps) => {
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));

    const [isFlipped, setIsFlipped] = React.useState<boolean>(false);

    const { rotationMultiplier } = useSettings();

    const cardContent = (<div
        style={{
            perspective: "1800px",
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            margin: "0 auto",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
    >
        <motion.div
            animate={{rotateY: isFlipped ? -180 : 0}}
            transition={spring}
            style={{
                width: "100%",
                zIndex: isFlipped ? 0 : 1,
                backfaceVisibility: "hidden",
                position: "absolute",
                height: "100%",
                margin: "0 auto",
            }}
        >
            {props.front}
        </motion.div>
        <motion.div
            initial={{rotateY: 180}}
            animate={{rotateY: isFlipped ? 0 : 180}}
            transition={spring}
            style={{
                width: "100%",
                zIndex: isFlipped ? 1 : 0,
                backfaceVisibility: "hidden",
                position: "absolute",
                height: "100%",
                margin: "0 auto",
            }}
        >
            {props.back}
        </motion.div>
    </div>);

    const getRotationFactor = (): number => {
        if (mq_md_or_less) {
            return 4;
        }

        if (mq_lg) {
            return 6;
        }

        return rotationMultiplier;
    }

    return (
        <Tiltable height={props.height || 500} hoverScale={!mq_md_or_less ? 1.0325 : 1}
                  rotationFactor={getRotationFactor()} children={cardContent}/>
    )
};

export default FlippableCard;