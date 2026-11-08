import React, {ReactNode} from "react";
import {motion, useSpring} from "framer-motion";

const isString = (value: unknown): value is string =>
    typeof value === "string" || value instanceof String;

const spring = {
    type: "spring",
    stiffness: 75,
    damping: 13,
}

interface TiltableCardProps {
    height: number | string;
    width?: number | string;
    hoverScale: number;
    children: ReactNode | undefined;
    rotationFactor: number;
}

// The outer wrapper sets pointerEvents:"none" to avoid intercepting clicks
// meant for the card content. Children must set "pointer-events: auto" to
// remain interactive inside the tilt container.
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
        // clientY drives X-axis rotation (pitch) and clientX drives Y-axis
        // rotation (yaw) so the card tilts toward the cursor intuitively.
        const mouseX = event.clientY - elementRect.y - elementCenterY
        const mouseY = event.clientX - elementRect.x - elementCenterX
        const degreeX = (mouseX / elementWidth) * props.rotationFactor
        const degreeY = (mouseY / elementHeight) * props.rotationFactor
        setRotateXaxis(degreeX)
        setRotateYaxis(degreeY)
    }

    const handleMouseEnd = () => {
        setRotateXaxis(0)
        setRotateYaxis(0)
    }

    // Pipe rotation state through Framer Motion springs so the tilt eases
    // smoothly rather than snapping to the cursor position each frame.
    const dx = useSpring(0, spring)
    const dy = useSpring(0, spring)

    React.useEffect(() => {
        dx.set(-rotateXaxis)
        dy.set(rotateYaxis)
    }, [dx, dy, rotateXaxis, rotateYaxis])

    const getWidth = (): string => {
        if (props.width === undefined) {
            return "100%";
        }

        if (isString(props.width)) {
            return props.width;
        }

        return `${props.width}px`;
    }

    return (
        <motion.div
            transition={spring}
            style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                width: getWidth(),
                height: isString(props.height) ? props.height : `${props.height}px`,
                margin: "0 auto",
                pointerEvents: "none",
            }}
        >
            <motion.div
                ref={ref}
                whileHover={{scale: props.hoverScale}}
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