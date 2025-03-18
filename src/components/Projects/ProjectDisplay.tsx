import styles from "@src/styles/components/Projects.module.scss";

import React, {ReactElement, ReactNode} from "react";

import {
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
    Tooltip
} from "@mui/material";

import Typography from '@mui/material/Typography';
import {Project} from "@data/ProjectsData";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from '@mui/icons-material/Article';
import WebIcon from '@mui/icons-material/Web';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TerminalIcon from '@mui/icons-material/Terminal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "next/image";
import PresentationIcon from "@icons/presentation";
import Link from "next/link";

interface ProjectProps {
    project: Project;
    is_xs: boolean;
}

const openInNewTab = (url: string | URL | undefined) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

// To match the red/blue and sort of the original
// const badgeColors: string[] = ["#E22753", "#3f5efb"]
const badgeColors: string[] = ["#A4243B", "#1c40c4"]

function isString(value: any): boolean {
    return typeof value === "string" || value instanceof String;
}

const ProjectDisplay: React.FunctionComponent<ProjectProps> = (props: ProjectProps) => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const getLearnMore = () => {
        return (<Button variant={"text"} aria-label={"Learn More about Wukong Button"} style={{
            margin: "0.5rem auto auto auto",
            color: (props.project.learnMoreEnabled ? "#292cc1" : "white")
        }} color={"info"}
                        onClick={(evt) => {
                            evt.stopPropagation();
                        }} component={Link} href={props.project.learnMoreUrl || ""}
                        disabled={!props.project.learnMoreEnabled}>
            {props.project.learnMoreEnabled ? "Learn More" : ""}
        </Button>)
    }

    const getIconSize = (): "medium" | "large" => {
        if (props.is_xs) {
            return "medium";
        }

        return "large";
    }

    const getPaperLinks = () => {
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
                    <IconButton size={getIconSize()}
                                onClick={() => openInNewTab(arxiv_url)}>
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

    const getArchitectureDiagram = () => {
        if (props.project.architectureDiagramPath) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    height: `${props.project.architectureDiagramHeight || "512"}px`,
                    width: "100%",
                    position: "relative",
                }}>
                    <Image
                        src={props.project.architectureDiagramPath}
                        alt={`${props.project.name} Architecture}`}
                        fill={true}
                    />
                </div>
            )
        }

        if (props.project.architectureDiagram) {
            return (
                <div style={{
                    // border: "1px solid red",
                    // backgroundColor: "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    height: `${props.project.architectureDiagramHeight || "525"}px`,
                    marginBottom: props.is_xs ? "1rem" : "2rem",
                    width: "100%",
                }}>
                    <Stack spacing={props.is_xs ? 3 : 4} direction={'column'}>
                        {props.project.architectureDiagramIsInteractive && <Typography variant="caption" gutterBottom>
                            {"The diagram shown below is interactive! Click on each component to learn more about it."}
                        </Typography>}
                        {props.project.architectureDiagram}
                    </Stack>
                </div>
            )
        }

        return <div/>
    };

    /**
     * Always expand the card if it isn't already expanded.
     */
    const onClickCardActionArea = () => {
        if (!expanded) {
            setExpanded(true);
        }
    }

    const onClickCard = () => {
        setExpanded(!expanded);
    }

    const cardActions = (<CardActions>
        {props.project.repo_url !== "" && <Tooltip title={"GitHub"} arrow>
            <IconButton aria-label={"GitHub Repo"} size={getIconSize()}
                        onClick={() => openInNewTab(props.project.repo_url)}
                        color={"default"}>
                <GitHubIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>}
        {!props.is_xs && props.project.project_website_url !== "" && <Tooltip title={`Project Website`} arrow>
            <IconButton size={getIconSize()} aria-label={"Project Website Button"}
                        onClick={() => openInNewTab(props.project.project_website_url)}>
                <WebIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>}
        {props.project.presentation_url && props.project.presentation_url !== "" &&
            <Tooltip title={`Paper Presentation (${props.project.presentation_venue})`} arrow>
                <IconButton size={getIconSize()} aria-label={"Paper Presentation Button"}
                            onClick={() => openInNewTab(props.project.presentation_url)}>
                    <PresentationIcon fill={"#757575"} fontSize="inherit"/>
                </IconButton>
            </Tooltip>}
        {getPaperLinks()}
        <IconButton size={getIconSize()} style={{marginLeft: "auto"}}
                    onClick={() => onClickCard()} aria-label={"Expand Project Card Button"}>
            <ExpandMoreIcon fontSize="inherit" style={{transform: (expanded ? "rotate(180deg)" : "")}}/>
        </IconButton>
    </CardActions>);

    const getExtendedDescription = (extendedDescription: string | string[]): React.JSX.Element => {
        if (!props.project.extendedDescription) {
            return <div/>
        }

        if (isString(props.project.extendedDescription)) {
            return (<Typography
                variant="body1"
                style={{
                    // marginTop: "1rem",
                    fontSize: props.is_xs ? "0.9rem" : "",
                    marginBottom: props.project.architectureDiagram ? "1rem" : "0rem",
                }}
            >
                {props.project.extendedDescription}
            </Typography>);
        }

        const descriptions: string[] = props.project.extendedDescription as string[];

        return (<Stack direction={"column"}>
            {descriptions.map((desc: string, index: number) => {
                return (<Typography
                    key={`project-${props.project.name}-extended-desc-${index}`}
                    variant="body1"
                    style={{
                        // marginTop: "1rem",
                        fontSize: props.is_xs ? "0.9rem" : "",
                        marginBottom: props.project.architectureDiagram ? "1rem" : "0rem",
                    }}
                >
                    {desc}
                </Typography>);
            })}
        </Stack>);
    }

    return (
        <Card
            style={{
                height: (expanded ? "auto" : "100%"),
            }}
            raised={false}
            className={styles.project_section_card}
        >
            <CardActionArea onClick={() => onClickCardActionArea()}>
                <div
                    onClick={() => onClickCard()}
                    className={styles.project_media_background}
                    // style={{background: "#1C192E"}}
                >
                    <CardMedia>
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
                </div>
                {cardHeader}
                <CardContent style={{overflow: "auto", margin: "5px"}}>
                    <Typography
                        onClick={() => onClickCard()}
                        variant="body1"
                        style={{
                            fontSize: props.is_xs ? "0.9rem" : "",
                            marginBottom: props.project.extendedDescription !== undefined ? "1rem" : "-1.5rem",
                        }}
                    >
                        {props.project.description}
                    </Typography>
                    <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                        {props.project.extendedDescription && getExtendedDescription(props.project.extendedDescription)}
                        {getArchitectureDiagram()}
                        {keywords}
                    </Collapse>
                </CardContent>
                {cardActions}
            </CardActionArea>
        </Card>
    );
};
export default ProjectDisplay;