import styles from "@src/styles/components/Skills.module.scss";
import {Variants, motion} from "framer-motion";

import React from "react";
import Typography from "@mui/material/Typography";
import {DegreeInfo} from "@data/EducationData";
import {
    Avatar,
    Badge,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Stack,
    Tooltip
} from "@mui/material";

import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import ArticleIcon from "@mui/icons-material/Article";

interface DegreeDisplay {
    degree: DegreeInfo;
}

const degreeCardAnimationVariant: Variants = {
    initial: {
        opacity: 0,
        x: "-50%",
    },
    animate: {
        opacity: 1,
        x: "0%",
        transition: {
            type: 'spring',
            stiffness: 25,
            damping: 100,
            mass: 100,
            delay: 0.5,
        },
    },
};

const downloadThesis = (filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = "portfolio/" + filename;
    link.click();
}

const DegreeDisplay: React.FunctionComponent<DegreeDisplay> = (props: DegreeDisplay) => {
    const getThesis = () => {
        return (<Stack direction={"row"} spacing={1}>
            <Typography sx={{color: 'text.secondary'}} variant={"h6"}><b>Thesis: </b>
                <i>{props.degree.thesisTitle}</i></Typography>
            <Tooltip title={`Download Thesis: "${props.degree.thesisTitle}"`}>
                <IconButton size="large"
                            onClick={() => downloadThesis(props.degree.thesisFile!)}>
                    <ArticleIcon fontSize="inherit"/>
                </IconButton>
            </Tooltip>
        </Stack>)
    }

    return (
        <motion.div
            variants={degreeCardAnimationVariant}
            whileHover={{
                scale: 1.08,
            }}
            className={styles.education_degree_container}
            style={{
                margin: "0 auto",
            }}
        >
            <Card>
                <CardMedia sx={{position: 'relative', marginTop: "5px"}}>
                    <Image
                        src={"portfolio/images/GMU_Logo.svg"}
                        width={225}
                        height={150}
                        alt="School Logo"
                        style={{objectFit: 'cover'}}
                    />
                </CardMedia>
                <CardContent>
                    <Stack direction={"column"} spacing={0.125} sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Typography gutterBottom variant="h4" component="div">{props.degree.degree}</Typography>
                        <Typography gutterBottom variant="h5" component="div"
                                    sx={{color: 'text.secondary', mb: 1.5}}>{props.degree.subject}</Typography>
                    </Stack>
                    <Typography className={styles.project_description} variant="h6"
                                sx={{color: 'text.secondary'}}>
                        {props.degree.institution}
                    </Typography>
                    <Typography className={styles.project_description} variant="h6"
                                sx={{color: 'text.secondary'}}>
                        May, {props.degree.endDate}
                    </Typography>
                    <Typography className={styles.project_description} variant="h6"
                                sx={{color: 'text.secondary'}}>
                        <b>GPA:</b> {props.degree.gpa}.0
                    </Typography>

                    {props.degree.hasThesis && getThesis()}
                </CardContent>
            </Card>
        </motion.div>
    );
};
export default DegreeDisplay;