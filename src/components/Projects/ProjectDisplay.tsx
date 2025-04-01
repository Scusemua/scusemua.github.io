import styles from "@src/styles/components/Projects.module.scss";
import React, {ReactElement, ReactNode} from "react";
import Link from "next/link";

import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Badge,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Collapse,
    Stack,
    Tooltip, useMediaQuery
} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project, QuestionAndAnswer} from "@data/ProjectsData";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from '@mui/icons-material/Article';
import WebIcon from '@mui/icons-material/Web';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TerminalIcon from '@mui/icons-material/Terminal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import PresentationIcon from "@icons/presentation";
import {OpenInNew} from "@mui/icons-material";

import Prism, {highlightAll} from 'prismjs';

import 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import Tiltable from "@src/components/Effects/Tiltable";
import theme from "@src/app/theme";
import {useSettings} from "@src/components/Context/SettingsContext";
import FlippableCard from "@src/components/Effects/FlippableCard";

interface ProjectProps {
    project: Project;
    expanded: boolean;
    toggleExpansion: (name: string, expanded: boolean) => void;
    is_xs: boolean;
}

// To match the red/blue and sort of the original
// const badgeColors: string[] = ["#E22753", "#3f5efb"]
const badgeColors: string[] = ["#A4243B", "#1c40c4"]

function isString(value: any): boolean {
    return typeof value === "string" || value instanceof String;
}

function getIconSize(is_xs: boolean): 'small' | 'medium' | 'large' {
    if (is_xs) {
        return "medium";
    }

    return "large";
}

interface DescriptionProps {
    project: Project;
    is_xs: boolean;
    expanded: boolean;
    isPreview: boolean;
    onClickCard: () => void;
}

const ProjectDescription: React.FunctionComponent<DescriptionProps> = (props: DescriptionProps) => {
    let descriptions: string[];

    if (isString(props.project.description)) {
        descriptions = [props.project.description as string];
    } else {
        descriptions = props.project.description as string[];
    }

    const getClassName = (): string => {
        let className: string = "";

        if (props.isPreview) {
            className += styles.project_description_preview + " ";

            if (props.expanded) {
                className += styles.project_description_hidden + " ";
            }
        } else {
            if (props.expanded) {
                className += styles.project_description_full + " ";
            } else {
                className += styles.project_description_full_collapsed + " ";
            }
        }

        return className;
    }

    return <Typography
        onClick={() => props.onClickCard()}
        variant="body1"
        component={"div"}
        className={styles.project_description + " " + getClassName()}
        // className={props.expanded ? "" : styles.project_description_collapsed}
        style={{
            // marginTop: "1rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            fontSize: props.is_xs ? "0.9rem" : "",
            marginBottom: props.project.architectureDiagram ? "1rem" : "0rem",
        }}
    >
        {/*{descriptions.join(' ')}*/}
        {descriptions.map((line: string, idx: number) => {
            if (idx > 0) {
                return (<div key={`project-${props.project.name}-desc-line-${idx}`}><br/>{line}</div>);
            }

            return <div key={`project-${props.project.name}-desc-line-${idx}`}>{line}</div>;
        })}
    </Typography>
}

interface PaperLinksProps {
    project: Project;
    is_xs: boolean;
}

const PaperLinks: React.FunctionComponent<PaperLinksProps> = (props: PaperLinksProps) => {
    return <Stack
        direction="row"
        spacing={{xs: 3, sm: 3, md: 3, lg: 3, xl: 3}}
        justifyContent={"center"}
        alignItems={"center"}
    >
        {props.project.arxiv_links.map((arxiv_url: string, idx: number) => {
            let badgeContent: ReactNode;
            if (props.project.arxiv_links.length === 1) {
                badgeContent = (<Typography variant={"body2"}
                                            style={{
                                                fontSize: props.is_xs ? "" : "",
                                            }}>
                    {props.project.venue as string}
                </Typography>);
            } else {
                badgeContent = (<Typography variant={"body2"}
                                            style={{
                                                fontSize: props.is_xs ? "0.6rem" : "",
                                            }}>
                    {(props.project.venue as string[])[idx]}
                </Typography>);
            }

            return (<Tooltip title={`View Paper on arXiv`} arrow key={`paper-icon-${idx}`}>
                <IconButton size={getIconSize(props.is_xs)}
                            component={Link}
                            href={arxiv_url}>
                    <Badge sx={{
                        "& .MuiBadge-badge": {
                            color: "#fff",
                            backgroundColor: badgeColors[idx],
                        }
                    }} badgeContent={badgeContent} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'right',
                    }}>
                        <ArticleIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>);
        })}
    </Stack>
}

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));

    const { rotationMultiplier } = useSettings();

    React.useEffect(() => {
        highlightAll();
    }, []);

    const getStatusIcon = (): ReactElement => {
        if (props.project.status === 'ongoing') {
            return <TerminalIcon/>
        } else {
            return <BedtimeIcon/>
        }
    }

    const getStatusColor = (): "info" | "default" => {
        if (props.project.status === 'ongoing') {
            return "info"
        } else {
            return "default"
        }
    }

    const keywords = (
        <div className={styles.project_keywords} onClick={() => onClickCard()}>
            {props.project.keywords.map((keyword: string) => (
                <Chip key={`project-${props.project.name}-keyword-${keyword}`} className={styles.project_keyword}
                      label={keyword} size={'small'}/>
            ))}
            {props.project.builtWith?.map((keyword: string) => (
                <Chip key={`project-${props.project.name}-keyword-${keyword}`} className={styles.project_keyword}
                      label={keyword} size={'small'} variant={'outlined'}/>
            ))}
        </div>
    );

    const cardHeader = (
        <CardHeader
            onClick={() => onClickCard()}
            title={
                <Stack direction={{xs: "row", sm: "row"}}
                       className={styles.project_section_card_header}
                       spacing={1}
                >
                    <Typography gutterBottom sx={{typography: {xs: 'h5', sm: 'h5', md: "h4", lg: "h4", xl: "h4"}}}
                                component="div">{props.project.name}</Typography>
                    <Chip label={props.project.status} icon={getStatusIcon()} color={getStatusColor()}/>
                </Stack>}
        >
        </CardHeader>
    );

    const architectureDiagram = (<div style={{
        justifyContent: "center",
        textAlign: "center",
        marginBottom: props.is_xs ? "1rem" : "0rem",
        width: "100%",
    }}>
        <Stack spacing={props.is_xs ? 2 : 1} direction={'column'}>
            {props.project.architectureDiagramIsInteractive &&
                <Typography align={'center'} variant="caption" gutterBottom>
                    {"The diagram shown below is interactive! Click each component to learn more about it."}
                </Typography>}
            <div style={{
                width: "100%",
            }}>
                {props.project.architectureDiagram}
            </div>
        </Stack>
    </div>);

    /**
     * Always expand the card if it isn't already expanded.
     */
    const onClickCardActionArea = () => {
        if (!props.expanded) {
            props.toggleExpansion(props.project.name, true);
        }
    }

    const onClickCard = () => {
        props.toggleExpansion(props.project.name, !props.expanded);
    }

    const cardActions = (<CardActions>
        {props.project.repo_url !== "" && <Tooltip title={"GitHub"} arrow>
            <IconButton aria-label={"GitHub Repo"} size={getIconSize(props.is_xs)} component={Link}
                        href={props.project.repo_url}
                        color={"default"}>
                <GitHubIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>}
        {!props.is_xs && props.project.project_website_url !== "" && <Tooltip title={`Project Website`} arrow>
            <IconButton size={getIconSize(props.is_xs)} aria-label={"Project Website Button"} component={Link}
                        href={props.project.repo_url}>
                <WebIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>}
        {props.project.presentation_url && props.project.presentation_url !== "" &&
            <Tooltip title={`Paper Presentation (${props.project.presentation_venue})`} arrow>
                <IconButton size={getIconSize(props.is_xs)} aria-label={"Paper Presentation Button"} component={Link}
                            href={props.project.repo_url}>
                    <PresentationIcon fill={"#757575"} fontSize="inherit"/>
                </IconButton>
            </Tooltip>}
        {<PaperLinks project={props.project} is_xs={props.is_xs}/>}
        <Button size={getIconSize(props.is_xs)} style={{marginLeft: "auto", color: "#333333"}}
                endIcon={<ExpandMoreIcon fontSize="inherit"
                                         style={{transform: (props.expanded ? "rotate(180deg)" : "")}}/>}
                onClick={() => onClickCard()} aria-label={"Expand Project Card Button"}>
            {props.expanded ? "Less" : "More"}
        </Button>
    </CardActions>);

    const getAnswer = (questionAndAnswer: QuestionAndAnswer): React.JSX.Element => {
        if (isString(questionAndAnswer.answer)) {
            return (<Typography component="span">{questionAndAnswer.answer}</Typography>)
        }

        return questionAndAnswer.answer as React.JSX.Element;
    }

    const questionsAndAnswers = (
        <div className={styles.project_faq}>
            <Stack direction={"column"}>
                <Typography align={'left'} variant={'h5'} sx={{paddingBottom: "1rem"}}><b>Frequently Asked Questions</b></Typography>
                <div>
                    {props.project.questionsAndAnswers?.map((questionAndAnswer: QuestionAndAnswer, index: number) => (
                        <Accordion key={`project-${props.project.name}-faq-${index}`} onChange={() => highlightAll()}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                              aria-controls={`Project ${props.project.name} FAQ Question #${index}`}
                                              id={`project-${props.project.name}-faq-${index}`}>
                                <Typography align={'left'} component="span"
                                            variant={'h6'}>{questionAndAnswer.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {getAnswer(questionAndAnswer)}
                            </AccordionDetails>
                            {questionAndAnswer.read_more_url && <AccordionActions>
                                <Button style={{color: "#2424ea"}} endIcon={<OpenInNew/>}
                                        href={questionAndAnswer.read_more_url}
                                        component={Link}>
                                    Learn More
                                </Button>
                            </AccordionActions>}
                        </Accordion>
                    ))}
                </div>
            </Stack>
        </div>
    );

    const getExpandedHeight = (): string => {
        if (!props.project.architectureDiagram && (!props.project.questionsAndAnswers || props.project.questionsAndAnswers.length == 0)) {
            return "auto";
        }

        let height: number = 20;

        if (props.project.questionsAndAnswers && props.project.questionsAndAnswers.length > 0) {
            height += 7;
        }

        if (props.project.architectureDiagram) {
            height += 7;
        }

        return `${height}rem`;
    }

    const getRotationFactor = (): number => {
        if (mq_md_or_less) {
            return 3;
        }

        if (mq_lg) {
            return 4;
        }

        return rotationMultiplier;
    }

    return (
        <Tiltable height={'auto'} hoverScale={1} rotationFactor={getRotationFactor()}>
            <Card
                sx={{
                    boxShadow: 3,
                    width: props.is_xs ? "95%" : "100%",
                }}
                raised={true}
                className={styles.project_section_card}
            >
                <CardActionArea onClick={() => onClickCardActionArea()} sx={{
                    width: "100%",
                }}>
                    <CardMedia className={styles.project_media_background} onClick={() => onClickCard()}>
                        <div style={{
                            position: 'relative',
                            margin: "0 auto",
                            height: '150px',
                            zIndex: 5,
                        }}>
                            <Image
                                src={props.project.image}
                                fill
                                alt="Project Logo"
                                style={{objectFit: 'contain'}}
                            />
                        </div>
                    </CardMedia>
                    {cardHeader}
                    <CardContent
                        style={{
                            height: (props.expanded ? getExpandedHeight() : "6rem"),
                            transition: "height 0.25s ease-in-out",
                            scrollbarGutter: "stable",
                            overflow: "auto",
                        }}
                    >
                        <div style={{position: "relative"}}>
                            <ProjectDescription project={props.project} is_xs={props.is_xs} isPreview={true}
                                                onClickCard={onClickCard} expanded={props.expanded}
                            />
                            <Collapse
                                in={props.expanded}
                                unmountOnExit
                                timeout={"auto"}
                                sx={{
                                    marginBottom: "-1rem",
                                    position: "relative",
                                }}
                            >
                                <ProjectDescription project={props.project} is_xs={props.is_xs} isPreview={false}
                                                    onClickCard={onClickCard} expanded={props.expanded}/>
                                <Stack direction={"column"}
                                       spacing={1}
                                       justifyContent={"center"}
                                       alignItems={"center"}
                                       alignContent={"center"}>
                                    {props.project.architectureDiagram && architectureDiagram}
                                    {props.project.questionsAndAnswers && questionsAndAnswers}
                                    {keywords}
                                </Stack>
                            </Collapse>
                        </div>
                    </CardContent>
                </CardActionArea>
                {cardActions}
            </Card>
        </Tiltable>
    );
};
export default ProjectDisplay;