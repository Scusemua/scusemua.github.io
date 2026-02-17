import styles from "@src/styles/components/Projects.module.scss";
import React, {ReactElement, ReactNode, Suspense} from "react";
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
import {OpenInNew, WebStories} from "@mui/icons-material";

import {highlightAll} from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import Tiltable from "@src/components/Effects/Tiltable";
import theme from "@src/app/theme";
import {useSettings} from "@src/components/Context/SettingsContext";

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
    dark_card_actions?: boolean;
}

const SlideOrPaperIcon: React.FunctionComponent<SlideOrPaperIconProps> = (props: SlideOrPaperIconProps) => {
    const getTooltipTitle = () => {
        if (props.variant === "Paper") {
            return `View Paper on arXiv`;
        }

        return `View Presentation Slides`;
    }

    const translate_x: string = props.is_xs ? "30%" : "33%";

    if (props.iconVariant === "Chip") {
        return (<Tooltip title={getTooltipTitle()} arrow key={`paper-icon-${props.idx}`}>
            <Chip variant={"outlined"} label={props.venue} component="a" href={props.href} clickable
                  style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}
                  icon={props.variant === "Paper" ?
                      <ArticleIcon
                          style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/> :
                      <WebStories
                          style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/>}/>
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
                {props.variant === "Paper" &&
                    <ArticleIcon
                        style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/>}
                {props.variant === "Slides" &&
                    <WebStories
                        style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/>}
            </Badge>
        </IconButton>
    </Tooltip>);
}

interface SlideAndPaperLinksProps {
    project: Project;
    is_xs: boolean;
    dark_card_actions?: boolean;
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

    const menuId = `slides-papers-menu-${props.project.name.replace(/\s+/g, '-').toLowerCase()}`;

    return <div>
        <Chip
            id={menuId}
            aria-controls={open ? `${menuId}-list` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            label={"Slides & Papers"}
            variant={"outlined"}
            clickable
        />
        <Menu id={`${menuId}-list`}
              open={open}
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

interface PaperPresentationIconProps {
    project: Project;
    is_xs: boolean;
    use_badges: boolean;
    badge_xs_font: string | number;
    dark_card_actions?: boolean;
}

const PaperPresentationIcon: React.FunctionComponent<PaperPresentationIconProps> = (props: PaperPresentationIconProps) => {
    const presentationBadgeContent = (
        <Typography variant={"body2"}
                    style={{
                        fontSize: props.is_xs ? `${props.badge_xs_font}rem` : "",
                    }}
        >
            {props.project.presentation_venue}
        </Typography>
    );

    if (props.use_badges) {
        return (<IconButton size={getIconSize(props.is_xs)}
                            component={Link}
                            aria-label={"Paper Presentation Button"}
                            href={props.project.presentation_url || ""}>
            <Badge
                badgeContent={presentationBadgeContent}
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
                <YouTubeIcon
                    style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/>
            </Badge>
        </IconButton>);
    }

    return (<Chip variant={"outlined"} icon={<YouTubeIcon
        style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}/>}
                  label={props.project.presentation_venue} component="a"
                  style={{color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}}
                  href={props.project.presentation_url} clickable/>);
}

const SlideAndPaperLinks: React.FunctionComponent<SlideAndPaperLinksProps> = (props: SlideAndPaperLinksProps) => {
    const badge_xs_font: number = 0.55;

    const computeShouldUseBadges = React.useCallback((): boolean => {
        if (props.is_xs) {
            return true;
        }

        const num_papers_and_slides: number = props.project.arxiv_links.length + (props.project.presentation_slides?.length || 0);

        return (num_papers_and_slides >= 4 || (num_papers_and_slides >= 3 && props.project.presentation_url !== undefined && props.project.presentation_url !== ""));
    }, [props.is_xs, props.project.arxiv_links.length, props.project.presentation_slides?.length, props.project.presentation_url]);

    const shouldUseBadges = computeShouldUseBadges();

    return <Stack
        className={styles.paper_and_slide_links}
        direction="row"
        spacing={shouldUseBadges ? 3 : 0.75}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
            marginLeft: props.is_xs ? "0rem" : "0.5rem",
        }}
    >
        {props.project.presentation_url && props.project.presentation_url !== "" &&
            <Tooltip key={`presentation-icon-${props.project.name}`}
                     title={`Paper Presentation (${props.project.presentation_venue})`} arrow>
                <PaperPresentationIcon is_xs={props.is_xs}
                                       project={props.project}
                                       badge_xs_font={badge_xs_font}
                                       use_badges={shouldUseBadges}
                                       dark_card_actions={props.dark_card_actions}/>
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

            return (<SlideOrPaperIcon key={`paper-icon-${idx}-${props.project.name}`} idx={idx} is_xs={props.is_xs}
                                      href={arxiv_url} badgeContent={badgeContent}
                                      variant={"Paper"} iconVariant={shouldUseBadges ? "Badge" : "Chip"}
                                      venue={venue} dark_card_actions={props.dark_card_actions}/>);
        })}
        {props.project.presentation_slides?.map((slides: PresentationSlides, idx: number) => {
            const badgeContent: ReactNode = (<Typography variant={"body2"}
                                                         style={{
                                                             fontSize: props.is_xs ? `${badge_xs_font}rem` : ""
                                                         }}>
                {slides.venue as string}
            </Typography>);

            return (<SlideOrPaperIcon key={`slides-icon-${idx}-${props.project.name}`} idx={idx} is_xs={props.is_xs}
                                      href={slides.path} badgeContent={badgeContent}
                                      variant={"Slides"} iconVariant={shouldUseBadges ? "Badge" : "Chip"}
                                      venue={slides.venue} dark_card_actions={props.dark_card_actions}/>);
        })}
    </Stack>
}

interface ProjectProps {
    project: Project;
    expanded: boolean;
    toggleExpansion: (name: string, expanded: boolean) => void;
    is_xs: boolean;
    is_xl: boolean;
    dark_card_actions?: boolean;
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
        />
    );

    const ArchDiagramComponent = props.project.architectureDiagram;

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
                {ArchDiagramComponent && (
                    <Suspense fallback={<div style={{textAlign: "center", padding: "2rem"}}>Loading diagram...</div>}>
                        <ArchDiagramComponent />
                    </Suspense>
                )}
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

    const cardActions = (
        <CustomCardActions
            disableSpacing={true}
            sx={{
                background: props.dark_card_actions ? "#1c192f" : "#ffffff",
                marginBottom: props.is_xs ? "10px" : "0px",
            }}
        >
            {props.project.repo_url !== "" && <Tooltip title={"GitHub"} arrow>
                {/*<Chip variant={"outlined"} icon={<GitHubIcon/>}*/}
                {/*       label={"Code"} component="a"*/}
                {/*       href={props.project.repo_url} clickable/>*/}
                <IconButton aria-label={"GitHub Repo"} size={getIconSize(props.is_xs)} component={Link}
                            href={props.project.repo_url}
                            color={"default"}>
                    <GitHubIcon fontSize="inherit"
                                htmlColor={props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}/>
                </IconButton>
            </Tooltip>}
            {!props.is_xs && props.project.project_website_url !== "" && <Tooltip title={`Project Website`} arrow>
                <IconButton size={getIconSize(props.is_xs)}
                            aria-label={"Project Website Button"}
                            component={Link}
                            href={props.project.project_website_url}>
                    <WebIcon fontSize="inherit"
                             htmlColor={props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}/>
                </IconButton>
            </Tooltip>}
            {useMenuForPapersAndSlides() ? <SlideAndPaperLinksMenu project={props.project} is_xs={props.is_xs}/> :
                <SlideAndPaperLinks project={props.project} is_xs={props.is_xs}
                                    dark_card_actions={props.dark_card_actions}/>}
            <Button
                size={getIconSize(props.is_xs)}
                style={{
                    marginLeft: "auto",
                    color: props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main,
                }}
                endIcon={<ExpandMoreIcon fontSize="inherit"
                                         htmlColor={props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}
                                         style={{transform: (props.expanded ? "rotate(180deg)" : "")}}/>}
                onClick={() => onClickCard()} aria-label={"Expand Project Card Button"}>
                {props.expanded ? "Less" : "More"}
            </Button>
        </CustomCardActions>
    );

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
                                <Button style={{color: "#2424ea"}} endIcon={<OpenInNew
                                    htmlColor={props.dark_card_actions ? "#ffffff" : theme.palette.darkProjectActionIconColor.main}/>}
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
        if (!props.project.architectureDiagram && (!props.project.questionsAndAnswers || props.project.questionsAndAnswers.length === 0)) {
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
                    background: props.dark_card_actions ? theme.palette.darkProjectActionIconColor.main : "#ffffff",
                }}
                raised={true}
                className={styles.project_section_card}
            >
                <CardActionArea onClick={() => onClickCardActionArea()} sx={{
                    width: "100%",
                    background: "#ffffff",
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