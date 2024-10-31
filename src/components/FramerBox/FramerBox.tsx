
import React from "react";
import { motion } from "framer-motion";

import MuiBox, { BoxProps } from "@mui/material/Box";

const FramerBoxComponent = React.forwardRef((props: BoxProps, ref) => (
    <MuiBox {...props} ref={ref} />
));

const FramerBox = motion(FramerBoxComponent);

export default FramerBox;