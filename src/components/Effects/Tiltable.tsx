import React, {ReactNode} from "react";
import {motion, useSpring} from "framer-motion";
import {isString} from "next/dist/build/webpack/plugins/jsconfig-paths-plugin";

//Spring animation parameters
const spring = {
    type: "spring",
    stiffness: 75,
    damping: 13,
}

interface TiltableCardProps {
    height: number | string;
    hoverScale: number;
    children: ReactNode | undefined;
    rotationFactor: number;
}

// NOTE: You will likely need to set "pointer-events: auto" on the child.
const Tiltable: React.FunctionComponent<TiltableCardProps> = (props: TiltableCardProps) => {
    const [rotateXaxis, setRotateXaxis] = React.useState(0)
    const [rotateYaxis, setRotateYaxis] = React.useState(0)
    const ref = React.useRef<HTMLDivElement>(null)

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
        const element: HTMLDivElement | null = ref.current

        if (!element) {
            return;
        }

        const elementRect = element.getBoundingClientRect()
        const elementWidth = elementRect.width
        const elementHeight = elementRect.height
        const elementCenterX = elementWidth / 2
        const elementCenterY = elementHeight / 2
        const mouseX = event.clientY - elementRect.y - elementCenterY
        const mouseY = event.clientX - elementRect.x - elementCenterX
        const degreeX = (mouseX / elementWidth) * props.rotationFactor //The number is the rotation factor
        const degreeY = (mouseY / elementHeight) * props.rotationFactor //The number is the rotation factor
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

    return (
        <motion.div
            transition={spring}
            style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                width: `100%`,
                height: isString(props.height) ? props.height : `${props.height}px`,
                margin: "0 auto",
                pointerEvents: "none",
            }}
        >
            <motion.div
                ref={ref}
                whileHover={{scale: props.hoverScale}} //Change the scale of zooming in when hovering
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseEnd}
                transition={spring}
                style={{
                    height: "100%",
                    width: "100%",
                    rotateX: dx,
                    rotateY: dy,
                    margin: "0 auto",
                }}
            >
                {props.children}
            </motion.div>
        </motion.div>
    )
};

export default Tiltable;