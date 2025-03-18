import * as React from "react"
import {SVGProps} from "react"

const TreeReductionDAG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 10 10"
        display={"block"}
        style={{
            position: "absolute",
            display: "block",
            left: "0",
            top: "0",
            // outline: "1px red solid"
        }} // , left: "0", top: "0", width: "100%", height: "100%"
        width={350} height={516}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        {...props}
    >
        <defs>
            <clipPath id="a">
                <path d="M36 480.187h278V35.999H36Z"/>
            </clipPath>
        </defs>
        <g clipPath="url(#a)">
            <path fill="#fff" d="M36 480.187V36h278v444.187Zm0 0"/>
            <path fill="none" d="M36 480.187V36h278v444.187Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M202 40h-54v36h54Zm-2.102 96.699c0 13.75-11.148 24.895-24.898 24.895s-24.898-11.145-24.898-24.895S161.25 111.801 175 111.801s24.898 11.148 24.898 24.898"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="164 169.99199 177.482" y={-375.602}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M175 111.852V86.098"
            />
            <path d="m171.5 86.016 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m171.5 86.016 3.5-10 3.5 10ZM166 197.395h-54v36h54Zm-19.012-.02c3.989-8.496 8.938-19.039 13.559-28.887"
            />
            <path d="m157.422 166.91 7.418-7.562-1.082 10.539Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m157.422 166.91 7.418-7.562-1.082 10.539ZM238 197.395h-54v36h54Zm-34.988-.02c-3.989-8.496-8.938-19.039-13.559-28.887"
            />
            <path d="m186.242 169.887-1.082-10.539 7.418 7.562Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m186.242 169.887-1.082-10.539 7.418 7.562Zm-22.344 124.207c0 13.75-11.148 24.898-24.898 24.898s-24.898-11.148-24.898-24.898S125.25 269.195 139 269.195s24.898 11.149 24.898 24.899"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="128 133.99199 141.482" y={-218.207}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M139 269.246v-25.754"
            />
            <path d="m135.5 243.41 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m135.5 243.41 3.5-10 3.5 10ZM94 354.793H40v36h54Zm-11.02-.023a753040.91 753040.91 0 0 1 32.532-34.657"
            />
            <path d="m113.172 317.496 9.394-4.898-4.293 9.687Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m113.172 317.496 9.394-4.898-4.293 9.687ZM166 354.793h-54v36h54Zm-27-.023v-25.575"
            />
            <path d="m135.5 329.051 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m135.5 329.051 3.5-10 3.5 10Zm28.398 122.437c0 13.75-11.148 24.899-24.898 24.899s-24.898-11.149-24.898-24.899c0-13.75 11.148-24.894 24.898-24.894s24.898 11.144 24.898 24.894"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="128 133.99199 141.482" y={-60.813}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M139 426.641v-25.754"
            />
            <path d="m135.5 400.809 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m135.5 400.809 3.5-10 3.5 10Zm-43.602 50.679c0 13.75-11.148 24.899-24.898 24.899s-24.898-11.149-24.898-24.899c0-13.75 11.148-24.894 24.898-24.894s24.898 11.144 24.898 24.894"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="56 61.992 69.482" y={-60.813}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M67 426.641v-25.754"
            />
            <path d="m63.5 400.809 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m63.5 400.809 3.5-10 3.5 10Zm172.398-106.715c0 13.75-11.148 24.898-24.898 24.898s-24.898-11.148-24.898-24.898S197.25 269.195 211 269.195s24.898 11.149 24.898 24.899"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="200 205.99199 213.482" y={-218.207}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M211 269.246v-25.754"
            />
            <path d="m207.5 243.41 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m207.5 243.41 3.5-10 3.5 10ZM238 354.793h-54v36h54Zm-27-.023v-25.575"
            />
            <path d="m207.5 329.051 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m207.5 329.051 3.5-10 3.5 10ZM310 354.793h-54v36h54Zm-42.98-.023a753040.91 753040.91 0 0 0-32.532-34.657"
            />
            <path d="m231.727 322.285-4.293-9.687 9.394 4.898Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m231.727 322.285-4.293-9.687 9.394 4.898Zm76.171 129.203c0 13.75-11.148 24.899-24.898 24.899s-24.898-11.149-24.898-24.899c0-13.75 11.148-24.894 24.898-24.894s24.898 11.144 24.898 24.894"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="272 277.992 285.482" y={-60.813}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M283 426.641v-25.754"
            />
            <path d="m279.5 400.809 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m279.5 400.809 3.5-10 3.5 10Zm-43.602 50.679c0 13.75-11.148 24.899-24.898 24.899s-24.898-11.149-24.898-24.899c0-13.75 11.148-24.894 24.898-24.894s24.898 11.144 24.898 24.894"
            />
            <text
                xmlSpace="preserve"
                fontFamily="TimesNewRoman"
                fontSize={14}
                transform="translate(0 516)"
            >
                <tspan x="200 205.99199 213.482" y={-60.813}>
                    {"add"}
                </tspan>
            </text>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="M211 426.641v-25.754"
            />
            <path d="m207.5 400.809 3.5-10 3.5 10Zm0 0"/>
            <path
                fill="none"
                stroke="#000"
                strokeLinejoin="round"
                d="m207.5 400.809 3.5-10 3.5 10Zm0 0"
            />
        </g>
    </svg>
)
export default TreeReductionDAG;
