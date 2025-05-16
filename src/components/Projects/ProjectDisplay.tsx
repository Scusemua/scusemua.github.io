import styles from "@src/styles/components/Projects.module.scss";
import React, {ReactElement, ReactNode} from "react";
import Link from "next/link";
import {styled} from '@mui/material/styles';

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
    Collapse, ListItemIcon, ListItemText, Menu, MenuItem,
    Stack,
    Tooltip, useMediaQuery
} from "@mui/material";

import Typography from '@mui/material/Typography';
import {PresentationSlides, Project, QuestionAndAnswer} from "@data/ProjectsData";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from '@mui/icons-material/Article';
import WebIcon from '@mui/icons-material/Web';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TerminalIcon from '@mui/icons-material/Terminal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import PresentationIcon from "@icons/presentation";
import {FilePresent, OpenInNew, SlideshowRounded} from "@mui/icons-material";

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
import YouTubeIcon from "@mui/icons-material/YouTube";

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

const CustomCardActions = styled(CardActions)(({theme}) => ({
    justifyContent: 'space-between',
    gap: theme.spacing(1),
}));

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

interface SlideOrPaperIconProps {
    is_xs?: boolean;
    idx: number;
    badgeContent: ReactNode;
    href: string;
    variant: "Paper" | "Slides";
    iconVariant: "Badge" | "Chip";
    venue: string;
}

const SlideOrPaperIcon: React.FunctionComponent<SlideOrPaperIconProps> = (props: SlideOrPaperIconProps) => {
    const getTooltipTitle = () => {
        if (props.variant === "Paper") {
            return `View Paper on arXiv`;
        }

        return `View Presentation Slides`;
    }

    const translate_x: string = props.is_xs ? "30%" : "33%";

    if (props.iconVariant === "Badge") {

    } else {
        return (<Tooltip title={getTooltipTitle()} arrow key={`paper-icon-${props.idx}`}>
            <Chip variant={"outlined"} icon={props.variant === "Paper" ? <ArticleIcon/> : <FilePresent/>}
                  label={props.venue} component="a" href={props.href} clickable/>
        </Tooltip>);
    }

    return (<Tooltip title={getTooltipTitle()} arrow key={`paper-icon-${props.idx}`}>
        <IconButton size={getIconSize(props.is_xs || false)}
                    component={Link}
                    href={props.href}>
            <Badge sx={{
                "& .MuiBadge-badge": {
                    color: "#fff",
                    backgroundColor: badgeColors[props.idx],
                    transform: `translate(${translate_x}, 95%)`, // original is (50%, -50%)
                }
            }} badgeContent={props.badgeContent} anchorOrigin={{
                vertical: 'bottom', horizontal: 'right',
            }}>
                {props.variant === "Paper" && <ArticleIcon/>}
                {props.variant === "Slides" && <FilePresent/>}
            </Badge>
        </IconButton>
    </Tooltip>);
}

interface SlideAndPaperLinksProps {
    project: Project;
    is_xs: boolean;
}

const SlideAndPaperLinksMenu: React.FunctionComponent<SlideAndPaperLinksProps> = (props: SlideAndPaperLinksProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <div>
        <Chip
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            label={"Slides & Papers"}
            variant={"outlined"}
            clickable
        />
        <Menu open={open}
              onClose={handleClose}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}>
            {props.project.arxiv_links.map((arxiv_url: string, idx: number) => {
                let venue: string;
                if (props.project.arxiv_links.length === 1) {
                    venue = props.project.venue as string;
                } else {
                    venue = (props.project.venue as string[])[idx];
                }

                return (<MenuItem key={`paper-menu-link-${idx}`} component="a" href={arxiv_url}>
                    <ListItemIcon>
                        <ArticleIcon/>
                    </ListItemIcon>
                    <ListItemText>{venue}</ListItemText>
                </MenuItem>);
            })}
        </Menu>
    </div>
}

const SlideAndPaperLinks: React.FunctionComponent<SlideAndPaperLinksProps> = (props: SlideAndPaperLinksProps) => {
    const badge_xs_font: number = 0.55;

    const useBadges = () => {
        if (props.is_xs) {
            return true;
        }

        const num_papers_and_slides: number = props.project.arxiv_links.length + (props.project.presentation_slides?.length || 0);

        return (num_papers_and_slides >= 4 || (num_papers_and_slides >= 3 && props.project.presentation_url));
    }

    const presentationBadegContent = (
        <Typography variant={"body2"}
                    style={{
                        fontSize: props.is_xs ? `${badge_xs_font}rem` : "",
                    }}
        >
            {props.project.presentation_venue}
        </Typography>
    );

    return <Stack
        className={styles.paper_and_slide_links}
        direction="row"
        spacing={useBadges() ? 3 : 0.75}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
            marginLeft: props.is_xs ? "0rem" : "0.5rem",
        }}
    >
        {props.project.presentation_url && props.project.presentation_url !== "" &&
            <Tooltip title={`Paper Presentation (${props.project.presentation_venue})`} arrow>
                {useBadges() ? <IconButton size={getIconSize(props.is_xs || false)}
                                           component={Link}
                                           aria-label={"Paper Presentation Button"}
                                           href={props.project.presentation_url}>
                    <Badge
                        badgeContent={presentationBadegContent}
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right',
                        }}
                        sx={{
                            "& .MuiBadge-badge": {
                                color: "#fff",
                                backgroundColor: badgeColors[1],
                                transform: `translate(30%, 95%)`, // original is (50%, -50%)
                            }
                        }}>
                        <YouTubeIcon/>
                    </Badge>
                </IconButton> : <Chip variant={"outlined"} icon={<YouTubeIcon/>}
                                      label={props.project.presentation_venue} component="a"
                                      href={props.project.presentation_url} clickable/>}
            </Tooltip>}
        {props.project.arxiv_links.map((arxiv_url: string, idx: number) => {
            let venue: string;
            if (props.project.arxiv_links.length === 1) {
                venue = props.project.venue as string;
            } else {
                venue = (props.project.venue as string[])[idx];
            }

            const badgeContent: ReactNode = (<Typography variant={"body2"}
                                                         style={{
                                                             fontSize: props.is_xs ? `${badge_xs_font}rem` : "",
                                                         }}>
                {venue}
            </Typography>);

            return (<SlideOrPaperIcon idx={idx} is_xs={props.is_xs} href={arxiv_url} badgeContent={badgeContent}
                                      variant={"Paper"} iconVariant={useBadges() ? "Badge" : "Chip"} venue={venue}/>);
        })}
        {props.project.presentation_slides?.map((slides: PresentationSlides, idx: number) => {
            const badgeContent: ReactNode = (<Typography variant={"body2"}
                                                         style={{
                                                             fontSize: props.is_xs ? `${badge_xs_font}rem` : ""
                                                         }}>
                {slides.venue as string}
            </Typography>);

            return (<SlideOrPaperIcon idx={idx} is_xs={props.is_xs} href={slides.path} badgeContent={badgeContent}
                                      variant={"Slides"} iconVariant={useBadges() ? "Badge" : "Chip"}
                                      venue={slides.venue}/>);
        })}
    </Stack>
}

interface SlideLinkProps {
    project: Project;
    is_xs: boolean;
}

const SlideLinks: React.FunctionComponent<SlideLinkProps> = (props: SlideLinkProps) => {
    return <Stack
        direction="row"
        spacing={{xs: 3, sm: 3, md: 3, lg: 3, xl: 4}}
        justifyContent={"center"}
        alignItems={"center"}
    >
        {props.project.presentation_slides?.map((slides: PresentationSlides, idx: number) => {
            const badgeContent: ReactNode = (<Typography variant={"body2"}
                                                         style={{
                                                             fontSize: props.is_xs ? `$0.55rem` : ""
                                                         }}>
                {slides.venue as string}
            </Typography>);

            return (<Tooltip title={`View Paper on arXiv`} arrow key={`paper-icon-${idx}`}>
                <IconButton size={getIconSize(props.is_xs)}
                            component={Link}
                            href={slides.path}>
                    <Badge sx={{
                        "& .MuiBadge-badge": {
                            color: "#fff",
                            backgroundColor: badgeColors[idx],
                            transform: 'translate(35%, 95%)', // original is (50%, -50%)
                        }
                    }} badgeContent={badgeContent} anchorOrigin={{
                        vertical: 'bottom', horizontal: 'right',
                    }}>
                        <FilePresent/>
                    </Badge>
                </IconButton>
            </Tooltip>);
        })}
    </Stack>
}

interface ProjectProps {
    project: Project;
    expanded: boolean;
    toggleExpansion: (name: string, expanded: boolean) => void;
    is_xs: boolean;
    is_xl: boolean;
}

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));

    const {rotationMultiplier} = useSettings();

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

    const useMenuForPapersAndSlides = (): boolean => {
        if (!props.is_xs) {
            return false;
        }

        return (props.project.arxiv_links.length + (props.project.presentation_slides?.length || 0) > 3);
    }

    const cardActions = (<CustomCardActions disableSpacing={true}>
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
        {useMenuForPapersAndSlides() ? <SlideAndPaperLinksMenu project={props.project} is_xs={props.is_xs}/> :
            <SlideAndPaperLinks project={props.project} is_xs={props.is_xs}/>}
        <Button size={getIconSize(props.is_xs)} style={{marginLeft: "auto", color: "#333333"}}
                endIcon={<ExpandMoreIcon fontSize="inherit"
                                         style={{transform: (props.expanded ? "rotate(180deg)" : "")}}/>}
                onClick={() => onClickCard()} aria-label={"Expand Project Card Button"}>
            {props.expanded ? "Less" : "More"}
        </Button>
    </CustomCardActions>);

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
                    paddingBottom: props.is_xs ? "10px" : "5px",
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