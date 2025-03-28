"use client";
import React, {forwardRef} from "react";
import styles from "@src/styles/components/Education.module.scss";
import Typography from "@mui/material/Typography";
import {AllDegreeInfo, DegreeInfo} from "@data/EducationData";
import DegreeDisplay from "@src/components/Education/DegreeDisplay";
import {Grid2, useMediaQuery} from "@mui/material";
import {motion} from "framer-motion";
import theme from "@src/app/theme";
import EmblaCarousel from "@src/components/Carousel/EmblaCarousel";

const degreeContainerVariant = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.5,
            staggerChildren: 0.35,
            duration: 0.75
        }
    }
}

const degreeVariant = {
    hidden: {y: 50, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.75,
        },
    }
}

interface EducationSectionProps {
}

const DEGREE_CARD_HEIGHT: number = 525;

const EducationContent: React.FunctionComponent = () => {
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const coreContent = (<Grid2 container rowSpacing={4} columnSpacing={8} alignItems="stretch"
                                className={styles.education_degree_container}>
        {AllDegreeInfo.map((degree: DegreeInfo) => (
            <Grid2 key={`degree-card-${degree.degree}`}
                   style={{display: 'flex', textAlign: "center", justifyContent: 'center', margin: "0 auto"}}
                   size={{'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 4}}
                   component={motion.div}
                   variants={degreeVariant}
            >
                <DegreeDisplay degree={degree} height={DEGREE_CARD_HEIGHT}/>
            </Grid2>
        ))}
    </Grid2>);

    const getSlides = (degrees: DegreeInfo[]): React.JSX.Element[] => {
        return degrees.map((degree: DegreeInfo, idx: number) => {
            return (
                <DegreeDisplay key={`degree-${idx}-${degree.degree}`} degree={degree} height={DEGREE_CARD_HEIGHT}/>
            );
        });
    }

    if (mq_md_or_less || mq_lg) {
        return <EmblaCarousel className={styles.education_degree_container}
                              slides={getSlides(AllDegreeInfo)}
                              flippableSlides={true}
                              autoplayEnabled={false}
                              options={{loop: true}}/>
    } else {
        return (<motion.div variants={degreeContainerVariant}
                            initial="hidden"
                            whileInView="visible"
                            style={{
                                width: mq_xl ? "95%" : "90%",
                                margin: "0 auto",
                                textAlign: "center",
                                justifyContent: "center",
                            }}
                            viewport={{once: true, amount: 0.25}}
            // onViewportEnter={() => console.log("Education Section has entered viewport")}
        >
            {coreContent}
        </motion.div>);
    }
}

// const EducationSection: React.FunctionComponent<EducationSectionProps> = (props: EducationSectionProps) => {
const EducationSection = forwardRef<HTMLInputElement, EducationSectionProps>((_props: EducationSectionProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (<div className={`${styles.education}`} id="education" ref={ref}>
        <Typography variant={"h2"} className={styles.education_header_text}>Education</Typography>
        <div style={{
            width: "90%",
            margin: "0 auto",
        }}>
            <EducationContent/>
        </div>
    </div>);
});

export default EducationSection;