import styles from "@src/styles/components/Education.module.scss";
import GMU_Logo from "@images/GMU_Logo.svg";

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

const downloadThesis = (filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = filename;
    link.click();
}

const DegreeDisplay: React.FunctionComponent<DegreeDisplay> = (props: DegreeDisplay) => {
    const getThesis = () => {
        return (<Stack direction={"row"} spacing={1}>
            <Typography sx={{color: 'text.secondary'}} variant={"h6"}><b>Thesis: </b></Typography>
            <Typography sx={{color: 'text.secondary'}} variant={"h6"}><i>{props.degree.thesisTitle}</i></Typography>
            <Tooltip title={`Download Thesis: "${props.degree.thesisTitle}"`}>
                <IconButton size="large"
                            onClick={() => downloadThesis(props.degree.thesisFile!)}>
                    <ArticleIcon fontSize="inherit"/>
                </IconButton>
            </Tooltip>
        </Stack>)
    }

    const cardHeader = (
        <CardHeader
            title={
                <Typography gutterBottom variant="h4" component="div">{props.degree.degree}</Typography>
        }
            subheader={
                <Stack direction={'column'}>
                    <Typography gutterBottom variant="h5" component="div"
                                sx={{color: 'text.secondary'}}>{props.degree.subject}</Typography>
                    <Typography className={styles.project_description} variant="h6"
                                sx={{color: 'text.secondary'}}>
                        {props.degree.institution}
                    </Typography>
                    <Stack direction={'row'} sx={{justifyContent: 'center'}} spacing={2}>
                        <Typography className={styles.project_description} variant="h6"
                                    sx={{color: 'text.secondary'}}>
                            <b>Graduated:</b> May, {props.degree.endDate}
                        </Typography>
                        <Typography className={styles.project_description} variant="h6"
                                    sx={{color: 'text.secondary'}}>
                            <b>GPA:</b> {props.degree.gpa}.0
                        </Typography>
                    </Stack>
                </Stack>
            }
            sx = {{
                marginBottom: 'auto',
            }}
        >
        </CardHeader>
    );

    return (
        <Card className={styles.education_card}>
            <CardMedia sx={{position: 'relative'}}>
                <div style={{position: 'relative', width: '300px', height: '200px', margin: '0 auto'}}>
                    <Image
                        src={GMU_Logo}
                        fill
                        alt="Project Logo"
                        style={{objectFit: 'cover'}}
                    />
                </div>
            </CardMedia>
            {cardHeader}
            <CardContent>
                {props.degree.hasThesis && getThesis()}
            </CardContent>
        </Card>
    );
};
export default DegreeDisplay;