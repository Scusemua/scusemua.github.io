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
import IconButton from "@mui/material/IconButton";

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
}

//Spring animation parameters
const spring = {
    type: "spring",
    stiffness: 75,
    damping: 13,
}

const DoctorOfPhilosophy: string = "Doctor of Philosophy";

interface ThesisDisplayProps {
    degree: DegreeInfo;
}

const ThesisDisplay: React.FunctionComponent<ThesisDisplayProps> = (props: ThesisDisplayProps) => {
    return (<Stack direction={"column"} spacing={0} sx={{alignItems: "center", justifyContent: "center"}}>
        <Typography sx={{color: 'text.secondary', width: "75%", marginBottom: "5px"}}
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
            <Typography variant="h6"
                        sx={{color: 'text.secondary'}}>
                May, {props.degree.endDate}, <b>GPA:</b> {props.degree.gpa}.0
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
        if (props.is_xs) {
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
            sx={{height: `${props.height || 550}px`, width: "100%"}}
            className={styles.education_degree_container_card}
        >
            <CardActionArea sx={{display: "grid", height: props.variant === 'front' ? "450px" : "100%",}}>
                <div style={{
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <CardMedia sx={{position: 'relative'}}>
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
                    <CardContent sx={{height: "100%"}}>
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
            {props.variant === 'front' && props.degree.thesisFile && <CardActions sx={{justifyContent: "center"}}>
                <Button size="large" startIcon={<ArticleIcon fontSize="inherit"/>} style={{color: "#292cc1"}}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            downloadThesis(props.degree.thesisFile!);
                        }} aria-label={"Download Thesis Button"}>
                    Download Thesis
                </Button>
                <Tooltip
                    title={"Click to view selected coursework from this degree."}
                    enterNextDelay={500}
                    enterDelay={400}
                    arrow={true}
                    placement={"bottom"}
                >
                    <Button size="large"
                            startIcon={<SchoolIcon fontSize="inherit"/>}
                                style={{color: "info"}}
                                aria-label={"View Selected Coursework Button"}>
                        View Selected Coursework
                    </Button>
                </Tooltip>
            </CardActions>}
        </Card>);
}

const DegreeDisplay: React.FunctionComponent<DegreeDisplayProps> = (props: DegreeDisplayProps) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'))
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));

    const [isFlipped, setIsFlipped] = React.useState<boolean>(false);
    const [rotateXaxis, setRotateXaxis] = React.useState(0)
    const [rotateYaxis, setRotateYaxis] = React.useState(0)
    const ref = React.useRef<HTMLDivElement>(null)

    const handleClick = () => {
        setIsFlipped((prevState) => !prevState)
    }

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
        const element: HTMLDivElement | null = ref.current

        if (!element) {
            return;
        }

        let rotationFactor: number = 10;
        if (mq_lg) {
            rotationFactor = 6;
        } else if (mq_md_or_less) {
            rotationFactor = 4;
        }

        const elementRect = element.getBoundingClientRect()
        const elementWidth = elementRect.width
        const elementHeight = elementRect.height
        const elementCenterX = elementWidth / 2
        const elementCenterY = elementHeight / 2
        const mouseX = event.clientY - elementRect.y - elementCenterY
        const mouseY = event.clientX - elementRect.x - elementCenterX
        const degreeX = (mouseX / elementWidth) * rotationFactor //The number is the rotation factor
        const degreeY = (mouseY / elementHeight) * rotationFactor //The number is the rotation factor
        setRotateXaxis(degreeX)
        setRotateYaxis(degreeY)
    }

    const handleMouseEnd = () => {
        setRotateXaxis(0)
        setRotateYaxis(0)
    }

    const dx = useSpring(0, spring)
    const dy = useSpring(0, spring)

    React.useEffect(() => {
        dx.set(-rotateXaxis)
        dy.set(rotateYaxis)
    }, [rotateXaxis, rotateYaxis])

    // If there's no coursework, then the card will not respond to mouse and will not be clickable.
    if (!props.degree.coursework) {
        return (<DegreeDisplaySide variant={'front'} degree={props.degree}/>);
    }

    return (
        <motion.div
            onClick={handleClick}
            transition={spring}
            style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                width: `100%`,
                height: `${props.height || 550}px`,
                margin: "0 auto",
            }}
        >
            <motion.div
                ref={ref}
                whileHover={{scale: !mq_md_or_less ? 1.0325 : 1}} //Change the scale of zooming in when hovering
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseEnd}
                transition={spring}
                style={{
                    height: "100%",
                    rotateX: dx,
                    rotateY: dy,
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        perspective: "1800px",
                        transformStyle: "preserve-3d",
                        width: "100%",
                        height: "100%",
                        margin: "0 auto",
                    }}
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
                        <DegreeDisplaySide variant={'front'} degree={props.degree} height={props.height} is_xs={mq_xs}/>
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
                        <DegreeDisplaySide variant={'back'} degree={props.degree} height={props.height} is_xs={mq_xs}/>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
};
export default DegreeDisplay;