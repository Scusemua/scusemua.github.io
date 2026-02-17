import {Project} from "@data/ProjectsData";
import {useMediaQuery} from "@mui/material";
import theme from "@src/app/theme";
import React from "react";
import EmblaCarousel from "@src/components/Carousel/EmblaCarousel";
import styles from "@styles/components/Projects.module.scss";
import {motion} from "framer-motion";
import ProjectCard from "@src/components/Projects/ProjectDisplay";

const cardVariant = {
    hidden: {
        y: 10,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    }
}

const CarouselProjectsDisplay = ({projects, dark_card_actions}: { projects: Project[], dark_card_actions?: boolean}) => {
    const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
    const mq_md_or_less = useMediaQuery(theme.breakpoints.down('lg'));
    const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

    const [expandedProjects, setExpandedProjects] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

    React.useEffect(() => {
        setExpandedProjects(new Map(projects.map((p) => [p.name, false])));
    }, [projects])

    const onProjectSelectedIndexChanged = React.useCallback((selectedIndex: number) => {
        setExpandedProjects(prev => {
            const next = new Map(prev);
            projects.forEach((project: Project, index: number) => {
                if (selectedIndex !== index && next.get(project.name)) {
                    next.set(project.name, false);
                }
            });
            return next;
        });
    }, [projects])

    const toggleProjectExpanded = React.useCallback((name: string, expanded: boolean) => {
        setExpandedProjects(prev => new Map(prev).set(name, expanded));
    }, []);

    const hoverScale = React.useMemo(() => {
        if (mq_xs) {
            return {scale: 1.0}
        }

        if (mq_md_or_less) {
            return {scale: 1.025}
        }

        return {scale: 1.05}
    }, [mq_xs, mq_md_or_less]);

    return (
        <EmblaCarousel className={styles.projects_container}
                       slides={projects.map((project: Project, idx: number) => {
                           return (
                               <motion.div
                                   variants={cardVariant}
                                   style={{
                                       width: "100%",
                                   }}
                                   whileHover={!mq_xs ? hoverScale : undefined}
                                   key={`project-${project.name}-display-${idx}`}>
                                   <ProjectCard key={`project-${idx}-${project.name}`}
                                                project={project}
                                                is_xs={mq_md_or_less}
                                                is_xl={mq_xl}
                                                toggleExpansion={toggleProjectExpanded}
                                                expanded={expandedProjects.get(project.name) || false}
                                                dark_card_actions={dark_card_actions}
                                   />
                               </motion.div>
                           );
                       })}
                       autoplayEnabled={true}
                       onSelectedIndexChanged={onProjectSelectedIndexChanged}
                       options={{
                           loop: true,
                       }}
        />
    );
}

export default CarouselProjectsDisplay;