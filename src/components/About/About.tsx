import React, {forwardRef, ReactElement} from "react";
import styles from "@styles/components/About.module.scss";
import Typography from "@mui/material/Typography";
import Wave from "@src/components/Effects/Wave";
import {TypeAnimation} from "react-type-animation";
import {motion} from "framer-motion";
import {Stack, useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";

const bioTextAnimationVariant = {
    hidden: {y: -10, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.75,
        },
    }
}

interface BioTextProps {
    projectSectionRef: React.RefObject<HTMLDivElement> | undefined;
}

const BioText: React.FunctionComponent<BioTextProps> = (props: BioTextProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
    const mq_md = useMediaQuery(theme.breakpoints.only('md'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const getIdentityTextSize = () => {
        if (mq_xl || mq_lg) {
            return "6rem";
        }

        if (mq_md) {
            return "3.5rem";
        }

        if (mq_sm) {
            return "2rem";
        }

        return "1.75rem";
    }

    const getBioTextSize = () => {
        if (mq_xl) {
            return "2.1rem";
        }

        if (mq_lg) {
            return "2.1rem";
        }

        if (mq_md) {
            return "1.4rem";
        }

        return "1.2rem";
    }

    const getBioContainerWidth = () => {
        if (mq_xs) {
            return "100%";
        }

        return "75%";
    }

    const scrollToProjects = () => {
        if (props.projectSectionRef?.current) {
            props.projectSectionRef?.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }

    const bioText: ReactElement[] = [
        <Typography variant={"h5"} sx={{fontSize: getBioTextSize()}}>
            I'm passionate about building large-scale distributed systems that power today's most demanding
            applications.
        </Typography>,
        <Typography variant={"h5"} sx={{fontSize: getBioTextSize()}}>
            I recently completed my PhD at George Mason University, where I designed and developed several open-source systems in cloud and serverless computing. You can read more about them <button onClick={scrollToProjects} style={{background: "none", border: "none", cursor: "pointer", font: "inherit", color: "inherit", padding: 0, textDecoration: "underline"}} aria-label="Scroll to projects section"><strong>below</strong></button>.
        </Typography>,
        <Typography variant={"h5"} sx={{fontSize: getBioTextSize()}}>
            During my academic research career, I worked under <a href={"https://tddg.github.io/"}>Dr. Yue
            Cheng</a> and
            was a member of the <a href={"https://ds2-lab.github.io/"}>DS<sup>2</sup> lab</a> at the University
            of Virginia.
        </Typography>,
        <Typography variant={"h5"} sx={{fontSize: getBioTextSize(), fontWeight: "bold"}}>
            I'm now a Research Scientist at Meta working on cutting-edge networking infrastructure for
            next-generation AI.
        </Typography>
    ];

    return (<div
        className={styles.about_bio_container}
        style={{width: getBioContainerWidth()}}
    >
        <TypeAnimation
            preRenderFirstString={true}
            sequence={[
                "I'm a computer scientist.",
                1000,
                "I'm a software engineer.",
                1000,
                "I'm a research scientist.",
                1000,
                "I'm a software developer.",
                1000
            ]}
            className={styles.identity_text}
            speed={35}
            style={{
                fontSize: getIdentityTextSize(),
                marginBottom: mq_xs ? "1rem" : "0rem",
            }}
            repeat={Infinity}
        />

        <div className={styles.about_bio_text}>
            <Stack direction={"column"} spacing={3}>
                {bioText.map((content: ReactElement, i: number) => (
                    <motion.div variants={bioTextAnimationVariant}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true, amount: 0.25}}
                                key={`bio_text_content_${i}`}
                    >
                        {content}
                    </motion.div>
                ))}
            </Stack>
        </div>
    </div>);
}

interface AboutSectionProps {
    projectSectionRef: React.RefObject<HTMLDivElement> | undefined;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>((_props: AboutSectionProps, ref) => {
    return (
        <div style={{position: "relative"}}>
            <Wave variant={"bottom"}/>
            <div className={styles.about}>
                <BioText projectSectionRef={_props.projectSectionRef}/>
            </div>
            <Wave variant={"top"}/>
        </div>
    )
});

AboutSection.displayName = "AboutSection";

export default AboutSection;