import * as React from "react"
import {SVGProps} from "react"

const WukongScheduling = (props: SVGProps<SVGSVGElement>) => {
    return (
            <svg
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 1240 970"
                display={"block"}
                style={{
                    position: "absolute",
                    display: "block",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "100%",
                    // outline: "1px red solid"
                }} // , left: "0", top: "0", width: "100%", height: "100%"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                transform={`scale(${props.scale || 1}, ${props.scale || 1})`}
                xmlSpace="preserve"
                {...props}
            >
                <path
                    d="m5606.37 6757.88 1392.94 452.59c105.05 34.13 217.88-23.36 252.01-128.41l1921.62-5914.13c34.13-105.05-23.36-217.879-128.41-252.012l-1392.94-452.59c-105.05-34.137-217.88 23.356-252.01 128.406L5477.96 6505.86c-34.13 105.05 23.36 217.88 128.41 252.02z"
                    style={{
                        fill: "#d9fcc8",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6072.43 7144.93 1224.07-374.24c105.63-32.3 165.08-144.1 132.79-249.74L5602.47 545.711c-32.29-105.633-144.1-165.082-249.73-132.789L4128.67 787.16c-105.63 32.293-165.08 144.102-132.79 249.73L5822.7 7012.14c32.29 105.63 144.1 165.08 249.73 132.79z"
                    style={{
                        fill: "#b1d8fc",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <image
                    xlinkHref="data:image/png;base64,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"
                    width={1}
                    height={1}
                    preserveAspectRatio="none"
                    transform="matrix(230.66666 0 0 391.99999 698.667 41.333)"
                />
                <path
                    d="M5240 4030h1730v2940H5240Z"
                    style={{
                        fill: "none",
                        stroke: "#b8351a",
                        strokeWidth: 25,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "100,100",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M2366.97 6119.81c106.92-106.92 106.92-280.28 0-387.2-106.92-106.92-280.27-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.93 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M2366.97 6119.81c106.92-106.92 106.92-280.28 0-387.2-106.92-106.92-280.27-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.93 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 271.703 192.057)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T6"}
                    </tspan>
                </text>
                <path
                    d="M1557.39 4609.81c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M1557.39 4609.81c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 163.759 393.39)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T4"}
                    </tspan>
                </text>
                <path
                    d="M777.391 1999.89c106.925-106.92 106.925-280.28 0-387.2-106.922-106.92-280.278-106.92-387.2 0-106.921 106.92-106.921 280.28 0 387.2 106.922 106.93 280.278 106.93 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M777.391 1999.89c106.925-106.92 106.925-280.28 0-387.2-106.922-106.92-280.278-106.92-387.2 0-106.921 106.92-106.921 280.28 0 387.2 106.922 106.93 280.278 106.93 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 59.759 741.38)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T1"}
                    </tspan>
                </text>
                <path
                    d="M3277.39 1999.89c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.93 280.28 106.93 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M3277.39 1999.89c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.93 280.28 106.93 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 393.092 741.38)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T2"}
                    </tspan>
                </text>
                <path
                    d="M2366.97 3355.81c106.92-106.92 106.92-280.27 0-387.2-106.92-106.92-280.27-106.92-387.2 0-106.92 106.93-106.92 280.28 0 387.2 106.93 106.93 280.28 106.93 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M2366.97 3355.81c106.92-106.92 106.92-280.27 0-387.2-106.92-106.92-280.27-106.92-387.2 0-106.92 106.93-106.92 280.28 0 387.2 106.93 106.93 280.28 106.93 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 271.703 560.59)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T3"}
                    </tspan>
                </text>
                <path
                    d="M3157.39 4609.81c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M3157.39 4609.81c106.93-106.92 106.93-280.28 0-387.2-106.92-106.92-280.28-106.92-387.2 0-106.92 106.92-106.92 280.28 0 387.2 106.92 106.92 280.28 106.92 387.2 0"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 377.092 393.39)"
                >
                    <tspan x="0 13.776" y={0}>
                        {"T5"}
                    </tspan>
                </text>
                <path
                    d="m665.07 2078.25 580.5 1942.4"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m1273.06 4112.63-61.98-81.67 68.99-20.62z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m1273.06 4112.63-61.98-81.67 68.99-20.62z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m1497.93 4666.39 480.36 895.95"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2023.65 5646.95-77.09-67.6 63.46-34.02z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2023.65 5646.95-77.09-67.6 63.46-34.02z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2832.14 4667.7-467.3 892.73"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2320.32 5645.48 12.63-101.75 63.79 33.39z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2320.32 5645.48 12.63-101.75 63.79 33.39z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2324.73 3402.34 418.91 664.61"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2794.84 4148.16-81.65-62.02 60.91-38.39z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2794.84 4148.16-81.65-62.02 60.91-38.39z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2019.41 3400.68-431.69 668.68"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m1535.65 4150.01 21.82-100.17 60.49 39.05z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m1535.65 4150.01 21.82-100.17 60.49 39.05z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2925.57 2041.95-522.06 777.51"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2350 2899.16 23.62-99.77 59.78 40.14z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m2350 2899.16 23.62-99.77 59.78 40.14z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M4410 960.082h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M4410 960.082h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 609.747 835.504)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T1"}
                    </tspan>
                </text>
                <path
                    d="M7695 960.082h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M7695 960.082h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 1047.747 835.504)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T2"}
                    </tspan>
                </text>
                <path
                    d="M7240 2600.63h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M7240 2600.63h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 987.08 616.764)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T3"}
                    </tspan>
                </text>
                <path
                    d="m7370 2150 415-547.58L8200 2150Z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7370 2150 415-547.58L8200 2150Z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 16,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 1020.219 701.307)"
                >
                    <tspan x="0 9.184 17.775999" y={0}>
                        {"Fan"}
                    </tspan>
                    <tspan x="-1.33594 4.8880601 14.07206 22.96806" y={18.448}>
                        {"-out"}
                    </tspan>
                </text>
                <path
                    d="m6920 3709.11 415-547.59 415 547.59z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6920 3709.11 415-547.59 415 547.59z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 16,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 960.219 493.425)"
                >
                    <tspan x="0 9.184 17.775999" y={0}>
                        {"Fan"}
                    </tspan>
                    <tspan x="-1.33594 4.8880601 14.07206 22.96806" y={18.448}>
                        {"-out"}
                    </tspan>
                </text>
                <path
                    d="M7050 4860h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M7050 4860h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 961.747 315.515)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T5"}
                    </tspan>
                </text>
                <path
                    d="M6195 6572.42h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M6195 6572.42h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 847.747 87.192)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T6"}
                    </tspan>
                </text>
                <path
                    d="M5700 4990h620v290h-620z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M5700 4990h620v290h-620z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 26,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 781.747 298.181)"
                >
                    <tspan x="0 14.924" y={0}>
                        {"T4"}
                    </tspan>
                </text>
                <path
                    d="M6160 4112.42 5745 4660l-415-547.58Z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M6160 4112.42 5745 4660l-415-547.58Z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 16,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 735.77 408.712)"
                >
                    <tspan x="0 9.184 17.775999 26.672001 32.896 36.448002" y={0}>
                        {"Fan-in"}
                    </tspan>
                </text>
                <path
                    d="m4768.42 1260.08 849.46 2719.21"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m5646.5 4070.92-62.98-80.9 68.72-21.47z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m5646.5 4070.92-62.98-80.9 68.72-21.47z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7960.78 1260.08-80.21 281.14"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7854.23 1633.54-8.28-102.2 69.24 19.75z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7854.23 1633.54-8.28-102.2 69.24 19.75z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7708.29 2160-82.74 306.09"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7600.51 2558.77-9.71-102.07 69.51 18.79z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7600.51 2558.77-9.71-102.07 69.51 18.79z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7501.68 2900.63-64.16 205.8"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7408.95 3198.08-5.79-102.36 68.73 21.42z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7408.95 3198.08-5.79-102.36 68.73 21.42z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7339.52 3719.11 15.96 1001.91"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7357.01 4817-37.53-95.41 71.99-1.14z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7357.01 4817-37.53-95.41 71.99-1.14z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6932.54 3676-674.37 403.3"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6175.78 4128.58 63.92-80.17 36.95 61.79z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6175.78 4128.58 63.92-80.17 36.95 61.79z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m5815.05 4584.13 97.06 274.26"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m5944.14 4948.89-65.97-78.49 67.87-24.02z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m5944.14 4948.89-65.97-78.49 67.87-24.02z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6114.93 5290 125.64 185.59"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6294.38 5555.09-83.62-59.32 59.62-40.36z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6294.38 5555.09-83.62-59.32 59.62-40.36z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M6920 5592.42 6505 6140l-415-547.58Z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M6920 5592.42 6505 6140l-415-547.58Z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 16,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 837.104 211.379)"
                >
                    <tspan x="0 9.184 17.775999 26.672001 32.896 36.448002" y={0}>
                        {"Fan-in"}
                    </tspan>
                </text>
                <path
                    d="M6505 6156.55v276.87"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6505 6529.42-36-96h72z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6505 6529.42-36-96h72z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m7206.12 5160-328.49 330.87"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6810 5559 42.09-93.49 51.09 50.72z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m6810 5559 42.09-93.49 51.09 50.72z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 20,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 1028.36 660.308)"
                >
                    <tspan x="0 13.7 24.440001 35.18 46.66 63.720001 74.459999" y={0}>
                        {"Becomes"}
                    </tspan>
                    <tspan
                        x="-35 -21.299999 -10.56 0.18000001 11.66 28.719999 39.459999"
                        y={-160.341}
                    >
                        {"Becomes"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 20,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="scale(1.33333) rotate(32 -287.648 1236.924)"
                >
                    <tspan
                        x="0 12.219997 23.339994 28.899994 33.339993 44.459991 54.459988 65.939987 76.319984 87.059982 97.059982"
                        y={0}
                    >
                        {"E2 invokes "}
                    </tspan>
                    <tspan x="36.860092 49.08009" y={23.56}>
                        {"E3"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 400,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 610.661 874.885)"
                >
                    <tspan x="0 14.664 328.5 343.164" y={0}>
                        {"E1E2"}
                    </tspan>
                    <tspan x="92 106.664" y={-394}>
                        {"E3"}
                    </tspan>
                    <tspan x="125 139.664" y={-467.5}>
                        {"E3"}
                    </tspan>
                    <tspan x="157 171.664" y={-542}>
                        {"E3"}
                    </tspan>
                    <tspan x="256 270.664" y={-464.5}>
                        {"E2"}
                    </tspan>
                    <tspan x="68 82.664001" y={-163}>
                        {"E1"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 700,
                        fontSize: 20,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 712.533 73.92)"
                >
                    <tspan
                        x="0 11.48 20.360001 30.360001 39.98 55.139999 59.939999 69.199997"
                        y={0}
                    >
                        {"Dynamic "}
                    </tspan>
                    <tspan
                        x="-8.8999996 -0.02 9.2399998 19.24 28.5 38.5 48.5 53.299999 58.099998 68.099998"
                        y={23.56}
                    >
                        {"scheduling"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 700,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 683.28 751.094)"
                >
                    <tspan x="0 12.456 19.559999 31.104 38.208 43.967999 55.080002" y={0}>
                        {"Static "}
                    </tspan>
                    <tspan
                        x="-23.9762 -13.3202 -2.2082 9.7917995 20.903799 32.903801 44.903801 50.663799 61.775799 67.535797"
                        y={28.672}
                    >
                        {"schedule 1"}
                    </tspan>
                    <tspan
                        x="330.55981 343.01581 350.11981 361.66379 368.76779 374.5278 385.6398"
                        y={-2.236}
                    >
                        {"Static "}
                    </tspan>
                    <tspan
                        x="306.58401 317.23999 328.35199 340.35199 351.46399 363.46399 375.46399 381.224 392.336 398.09601"
                        y={26.436}
                    >
                        {"schedule 2"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 700,
                        fontSize: 30,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 168.652 953.44)"
                >
                    <tspan
                        x="0 8.8800001 23.309999 32.189999 39.389999 54.959999 63.84 78.269997 87.150002 94.349998 108.24 115.44 132.66 149.34 369.28021 378.16019 393.16019 402.04019 409.2402 426.46021 439.78021 454.78021 469.21021 491.9502 499.15021 513.04022 520.24017 533.56018 547.4502 562.4502 576.34021 591.34021 606.34021 613.54022 620.74017 635.74017"
                        y={0}
                    >
                        {"(a) Static DAG(b) Dynamic scheduling"}
                    </tspan>
                </text>
                <path
                    d="M3620 3866.4v273.79h640v136.9l190-273.8-190-273.79v136.9z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="M3620 3866.4v273.79h640v136.9l190-273.8-190-273.79v136.9z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 20,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <text
                    xmlSpace="preserve"
                    style={{
                        fontVariant: "normal",
                        fontWeight: 700,
                        fontSize: 24,
                        fontFamily: "HelveticaNeue",
                        writingMode: "horizontal-tb",
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(1.33333 0 0 1.33333 15.663 867.552)"
                >
                    <tspan
                        x="0 11.112 22.224001 33.768002 40.872002 46.632 58.632 70.152 82.152 250.00008 261.11209 272.22409 283.76807 290.87207 296.63208 308.63208 320.15207 332.15207"
                        y={0}
                    >
                        {"Leaf nodeLeaf node"}
                    </tspan>
                </text>
                <path
                    d="m585.895 1060 2.906 276.01"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 15,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "60,60",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m589.727 1424-33.926-87.64 65.996-.7z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m589.727 1424-33.926-87.64 65.996-.7z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 15,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m3082.48 1060-1.73 266"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 15,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                        strokeDasharray: "60,60",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m3080.17 1414-32.42-88.21 66 .43z"
                    style={{
                        fill: "#000",
                        fillOpacity: 1,
                        fillRule: "nonzero",
                        stroke: "none",
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
                <path
                    d="m3080.17 1414-32.42-88.21 66 .43z"
                    style={{
                        fill: "none",
                        stroke: "#000",
                        strokeWidth: 15,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.13333 0 0 -.13333 0 970.667)"
                />
            </svg>
    );
}
export default WukongScheduling;
