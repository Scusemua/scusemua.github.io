import React from "react";
import { motion } from "framer-motion";

import {TimelineItemProps} from "@mui/lab";
import TimelineItem from "@mui/lab/TimelineItem";

const FramerTimelineItemComponent = React.forwardRef((props: TimelineItemProps, ref) => (
    <TimelineItem {...props} ref={ref} />
));

const FramerTimelineItem = motion.create(FramerTimelineItemComponent);

export default FramerTimelineItem;