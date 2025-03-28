import styles from "@src/styles/components/Education.module.scss";
import GMU_Logo from "@images/GMU_Logo.svg";

import React from "react";
import Typography from "@mui/material/Typography";
import {CourseInfo, DegreeInfo} from "@data/EducationData";
import {
    Avatar,
    Button,
    Card,
    CardActionArea, CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    List,
    ListItem, ListItemAvatar, ListItemText,
    Stack,
    Tooltip, useMediaQuery
} from "@mui/material";
import {motion, useSpring} from "framer-motion";

import Image from "next/image";
import ArticleIcon from "@mui/icons-material/Article";
import {LibraryBooks} from "@mui/icons-material";
import theme from "@src/app/theme";
import SchoolIcon from "@mui/icons-material/School";
import Tiltable from "@src/components/Effects/Tiltable";
import {useSettings} from "@src/components/Context/SettingsContext";

interface DegreeDisplayProps {
    degree: DegreeInfo;
    height?: number;
}

const downloadThesis = (filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = filename;
    link.click();
}

interface DegreeDisplaySideProps {
    degree: DegreeInfo;
    height?: number;
    variant: 'front' | 'back';
    is_xs?: boolean;
    is_xl?: boolean;
    handleClick: () => void;
}

const DoctorOfPhilosophy: string = "Doctor of Philosophy";

interface ThesisDisplayProps {
    degree: DegreeInfo;
}

const ThesisDisplay: React.FunctionComponent<ThesisDisplayProps> = (props: ThesisDisplayProps) => {
    return (<Stack direction={"column"} spacing={0} sx={{alignItems: "center", justifyContent: "center"}}>
        <Typography sx={{color: 'text.secondary', width: "90%", marginBottom: "5px"}}
                    variant={"h6"}><b>{props.degree.thesisKind}: </b>
            <i>{props.degree.thesisTitle}</i></Typography>
    </Stack>);
}

interface DegreeSubHeaderProps {
    degree: DegreeInfo;
    variant: 'front' | 'back';
}

const DegreeSubHeader: React.FunctionComponent<DegreeSubHeaderProps> = (props: DegreeSubHeaderProps) => {
    if (props.variant === "front") {
        return (<Stack direction={'column'}>
            <Typography gutterBottom variant="h5" component="div"
                        sx={{color: 'text.secondary'}}>{props.degree.subject}</Typography>
            <Typography variant="h6"
                        sx={{color: 'text.secondary'}}>
                {props.degree.institution}
            </Typography>
            <Typography variant="subtitle1"
                        sx={{color: 'text.secondary'}}>
                {props.degree.endDate}, <b>GPA:</b> {props.degree.gpa}.0
            </Typography>
        </Stack>);
    }

    return (<Typography variant="h6"
                        sx={{color: 'text.secondary'}}>
        {"Selected Coursework"}
    </Typography>);
}

const DegreeDisplaySide: React.FunctionComponent<DegreeDisplaySideProps> = (props: DegreeDisplaySideProps) => {
    const getDegreeText = (): string => {
        if (!props.is_xl) {
            return props.degree.degree;
        }

        if (props.degree.degree === DoctorOfPhilosophy) {
            return DoctorOfPhilosophy + " (PhD)";
        }

        return props.degree.degree;
    }

    const courseList = (
        <List sx={{
            overflow: "auto",
            width: "100%",
            bgcolor: 'background.paper',
            maxHeight: '250px',
            marginTop: "-1rem",
        }}>
            {props.degree.coursework?.map((course: CourseInfo, index: number) => {
                return (<ListItem key={`course-${course.name}-term-${course.term}-${index}`}>
                    <ListItemAvatar>
                        <Avatar>
                            {course.icon ? course.icon : <LibraryBooks/>}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={course.name} secondary={`Grade: ${course.grade}, Term: ${course.term}`}/>
                </ListItem>);
            })}
        </List>
    );

    return (
        <Card
            sx={{height: `${props.height || 550}px`, width: "100%", position: "relative"}}
            className={styles.education_degree_container_card}
        >
            <CardActionArea onClick={props.handleClick} sx={{
                height: props.variant === "front" ? "87.5%" : "100%", position: 'relative', width: "100%"
            }}>
                <div style={{
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "auto",
                    position: "absolute",
                    top: 0,
                }}>
                    <CardMedia>
                        <div style={{
                            position: 'relative',
                            width: '150px',
                            height: '100px',
                            margin: '0.5rem auto 0 auto',
                            display: "inline-block",
                        }}>
                            <Image
                                src={GMU_Logo}
                                fill
                                alt="Project Logo"
                                style={{objectFit: 'cover'}}
                            />
                        </div>
                    </CardMedia>
                    <CardContent sx={{height: "100%", width: "100%"}}>
                        <CardHeader
                            title={
                                <Typography gutterBottom variant="h4" component="div">
                                    {getDegreeText()}
                                </Typography>
                            }
                            subheader={<DegreeSubHeader variant={props.variant} degree={props.degree}/>}
                        >
                        </CardHeader>
                        {props.variant === 'front' && props.degree.hasThesis && <ThesisDisplay degree={props.degree}/>}
                        {props.variant === 'back' && courseList}
                    </CardContent>
                </div>
            </CardActionArea>
            {props.variant === 'front' &&
                <CardActions sx={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}>
                    {props.degree.thesisFile &&
                        <Button size="large"
                                startIcon={<ArticleIcon fontSize="inherit"/>}
                                style={{color: "#292cc1", width: "50%"}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    downloadThesis(props.degree.thesisFile!);
                                }}
                                aria-label={"Download Thesis Button"}>
                            Download Thesis
                        </Button>}
                    <Tooltip
                        title={"Click to view selected coursework from this degree."}
                        enterNextDelay={500}
                        enterDelay={400}
                        arrow={true}
                        placement={"bottom"}
                    >
                        <Button size="large"
                                startIcon={<SchoolIcon fontSize="inherit"/>}
                                style={{color: "info", width: props.degree.thesisFile ? "50%" : "100%"}}
                                aria-label={"View Selected Coursework Button"}
                                onClick={props.handleClick}
                        >
                            View Selected Coursework
                        </Button>
                    </Tooltip>
                </CardActions>}
        </Card>);
}

//Spring animation parameters
const spring = {
    type: "spring",
    stiffness: 75,
    damping: 13,
}

const DegreeDisplay: React.FunctionComponent<DegreeDisplayProps> = (props: DegreeDisplayProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'))
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'))

    const [isFlipped, setIsFlipped] = React.useState<boolean>(false);

    const { rotationMultiplier } = useSettings();

    // If there's no coursework, then the card will not respond to mouse and will not be clickable.
    if (!props.degree.coursework) {
        return (<DegreeDisplaySide variant={'front'} degree={props.degree} handleClick={() => {
        }}
                                   is_xs={mq_xs} is_xl={mq_xl}/>);
    }

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
            className={styles.education_degree_container_card}
        >
            <DegreeDisplaySide variant={'front'}
                               degree={props.degree}
                               height={props.height}
                               is_xs={mq_xs}
                               is_xl={mq_xl}
                               handleClick={() => {
                               }}/>
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
            className={styles.education_degree_container_card}
        >
            <DegreeDisplaySide variant={'back'}
                               degree={props.degree}
                               height={props.height}
                               is_xs={mq_xs}
                               is_xl={mq_xl}
                               handleClick={() => {
                               }}/>
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
export default DegreeDisplay;