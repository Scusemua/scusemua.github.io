import * as React from "react"
import {SVGProps} from "react"

interface InfiniStoreArchitectureProps {
    width?: number;
    height?: number;
    scale?: number;
}

const InfiniStoreArchitecture = (props: InfiniStoreArchitectureProps) => (
    <svg
        // style={{"width": "800", "height": "555"}}
        width={"100%"}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 701 560"
        display={"block"}
        style={{position: "absolute", display: "block", left: "0", top: "0" }} // , left: "0", top: "0", width: "100%", height: "100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        transform={`scale(${props.scale || 1}, ${props.scale || 1})`}
        xmlSpace="preserve"
        {...props}
    >
        <defs>
            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                <path d="M272 235h31v30h-31z"/>
            </clipPath>
        </defs>
        <path
            d="M197.082-4.273 512-78.168"
            style={{
                fill: "none",
                stroke: "#656565",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "4,4",
                strokeDashoffset: 0,
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M2-191h521.5v-223.273H2Z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "8,8",
                strokeDashoffset: 0,
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M13.5-321h500"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "8,8",
                strokeDashoffset: 0,
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M12-349.047h500v-37.344H12Z"
            style={{
                fill: "#db5040",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "24.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 22.667 501.825)"
        >
            <tspan
                x="0 13.4 19.375 31.374998 43.849998 56.349998 62.324997 76.224998 88.699997 94.674995 106.27499 117.825 125.225 131.22499 144.17499 151.575 163.575 171.89999"
                y={0}
            >
                {"Cloud Object Store"}
            </tspan>
        </text>
        <path
            d="M12-226.5h500v-70H12Z"
            style={{
                fill: "#f39747",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "24.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 22.667 360.2)"
        >
            <tspan
                x="0 12.974999 24.549999 33.299999 44.399998 55.949997 64.274994 70.25 81.824997 92.924995 104.02499 122.52499 134.075 153 165 173.77499 190.84999 203.825 211.22499 223.22499 231.54999"
                y={0}
            >
                {"ServerlessMemoryStore"}
            </tspan>
        </text>
        <path
            d="M272.5-275h50v-15h-50zM332.5-275h50v-15h-50zM392.5-275h50v-15h-50zM452.5-275h50v-15h-50z"
            style={{
                fill: "none",
                stroke: "#fff",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <g clipPath="url(#a)" transform="matrix(1.33333 0 0 1.33333 0 0)">
            <image
                xlinkHref="data:image/png;base64,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"
                width={1}
                height={1}
                preserveAspectRatio="none"
                transform="matrix(31 0 0 30 272 235)"
            />
        </g>
        <path
            d="m299.5-299 19-12H309v-42h9.5l-19-12-19 12h9.5v42h-9.5z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#f27a08",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M12-78h500v-100.5H12Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "29.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 22.667 185.107)"
        >
            <tspan
                x="0 16.949999 31.919998 46.889999 54.089996 61.259998 75.119995 89.519997 98.399994 105.6 119.96999 134.97 141.03 156.59999"
                y={0}
            >
                {"Application VM"}
            </tspan>
        </text>
        <path
            d="M222-132.715h280.5v-37.348H222Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#fff",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "24.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 302.667 213.383)"
        >
            <tspan
                x="0 13.4 19.375 25.374998 36.924999 49.399998 56.799999 62.799999 77.149994 89.149994 100.725 119.64999 131.64999"
                y={0}
            >
                {"Client Daemon"}
            </tspan>
        </text>
        <path
            d="M222-85.715h280.5v-44H222Z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "24.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 302.667 155.152)"
        >
            <tspan
                x="0 14.124999 26.599998 39.074997 45.074997 51.049999 62.599998 74.599998 82 88 99.974998"
                y={0}
            >
                {"Application"}
            </tspan>
        </text>
        <path
            d="M354-91.215h143.562v-33H354Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#fff",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "24.99999809px",
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 478.908 155.619)"
        >
            <tspan
                x="0 13.4 19.375 25.374998 36.924999 49.399998 56.799999 62.799999 74.375 80.349998 92.824997 101.14999 113.14999 121.925"
                y={0}
            >
                {"Client Library"}
            </tspan>
        </text>
        <path
            d="m431-120.746 7.5-12h-3.75v-6h3.75l-7.5-12-7.5 12h3.75v6h-3.75z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#fff",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m299.5-172.5 19-12H309v-38h9.5l-19-12-19 12h9.5v38h-9.5z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#3f90cc",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 19,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 19.028 418.06)"
        >
            <tspan
                x="0 9.8610001 18.658001 25.308001 33.743999 42.521999 48.848999 53.389999 62.187 70.623001 79.058998 93.119003 101.897 116.28 125.4 132.069 140.48599 145.04601 153.48199 159.106 168.226 174.55299 183.35001 187.89101 192.451 201.571 209.98801 218.785"
                y={0}
            >
                {"ServerlessMemory store layer"}
            </tspan>
            <tspan
                x="-0.0101563 9.4898434 18.286844 24.613844 33.030842 37.590843 46.007843 51.631844 60.428844 69.909843 75.533844 80.093842 88.529846 94.153847 103.27384 109.60085 118.39784 122.93884 127.49884 136.61885 145.03584 153.83284"
                y={90.462}
            >
                {"Persistent store layer"}
            </tspan>
        </text>
        <path
            d="M332.5-255h50v-15h-50z"
            style={{
                fill: "#f38a2b",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#fff",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M332.5-235h50v-15h-50zM392.5-255h50v-15h-50zM452.5-255h50v-15h-50zM452.5-235h50v-15h-50z"
            style={{
                fill: "none",
                stroke: "#fff",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 16,
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 406.15 354.667)"
        >
            <tspan x={0} y={0}>
                {"s"}
            </tspan>
        </text>
        <path
            d="M335.5 278h9v9h-9zM347.984 257.516l10-.032.032 10-10 .032z"
            style={{
                fill: "#69bc30",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <path
            d="M335.5 238h9v9h-9z"
            style={{
                fill: "#ffff7c",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <path
            d="M276.5 278h9v9h-9z"
            style={{
                fill: "#69bc30",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <path
            d="M335.5 258h9v9h-9zM348.984 278h9v9h-9z"
            style={{
                fill: "#ffff7c",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <path
            d="M362.469 278.336h9v9h-9zM362.5 258h9v9h-9zM396.742 278h9v9h-9z"
            style={{
                fill: "#7271e8",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <path
            d="M409.434 278h9v9h-9zM396.742 258h9v9h-9zM456.402 278h9v8h-9z"
            style={{
                fill: "#656565",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: "30px",
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            // transform="matrix(1.33333 0 0 1.33333 472 284.604)"
            transform="matrix(1.33333 0 0 1.33333 20.333 293.905)"
        >
            {"InfiniStore"}
        </text>
        <path
            d="M58-51h140v-24H58Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 93.707 91.92)"
        >
            <tspan
                x="0 10.72 15.5 20.299999 29.540001 39.52 45.439999 50.240002 61.720001 71.32 80.580002 95.720001 105.32"
                y={0}
            >
                {"Client Daemon"}
            </tspan>
        </text>
        <path
            d="M58-1h140v-33H58Z"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 110.586 26.667)"
        >
            <tspan
                x="0 11.3 21.280001 31.26 36.060001 40.84 50.080002 59.68 65.599998 70.400002 79.980003"
                y={0}
            >
                {"Application"}
            </tspan>
        </text>
        <path
            d="M88-30h110v-18H88Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 130.283 58.699)"
        >
            <tspan
                x="0 9.1120005 13.175 17.254999 25.108999 33.591999 38.624001 42.703999 50.575001 54.638 63.120998 68.781998 76.942001 82.908997"
                y={0}
            >
                {"Client Library"}
            </tspan>
        </text>
        <path
            d="M57.324-5.227 11-78.168"
            style={{
                fill: "none",
                stroke: "#656565",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "4,4",
                strokeDashoffset: 0,
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m206.789-37.461 102-20.293"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m316.637-59.312-7.262 4.503-1.172-5.886zM198.945-35.902l7.262-4.5 1.172 5.882z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m206.512-57.883 102.293 21.192"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m316.641-35.07-8.446 1.316 1.219-5.875zM198.68-59.508l8.441-1.312-1.219 5.875z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m359.5-172.5 19-12H369v-38h9.5l-19-12-19 12h9.5v38h-9.5zM419.5-172l19-12H429v-38.5h9.5l-19-12-19 12h9.5v38.5h-9.5zM479.5-170.586l19-12H489V-222.5h9.5l-19-12-19 12h9.5v39.914h-9.5z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#3f90cc",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m359.5-299 19-12H369v-42h9.5l-19-12-19 12h9.5v42h-9.5zM419.5-299l19-12H429v-42h9.5l-19-12-19 12h9.5v42h-9.5zM478.562-299l19-12h-9.5v-42h9.5l-19-12-19 12h9.5v42h-9.5z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#f27a08",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M354 194.781h71v24h-71z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 472 284.604)"
        >
            <tspan x="0 11.12 23.32 35.52 47.720001 58.84" y={0}>
                {"chunks"}
            </tspan>
        </text>
        <path
            d="M269 322.766h251v24H269Z"
            style={{
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 358.667 455.25)"
        >
            <tspan
                x="0 11.12 23.32 35.52 47.720001 58.84 69.959999 75.5 89.940002 95.480003 101.02 113.22 124.34 135.46001 143.24001 149.89999 155.44 167.64 179.84 185.38 197.58 209.78 221.98 233.10001 244.22"
                y={0}
            >
                {"chunks & insertion nodes "}
            </tspan>
        </text>
        <path
            d="m453-120.746 7.5-12h-3.75v-6h3.75l-7.5-12-7.5 12h3.75v6h-3.75zM475-120.746l7.5-12h-3.75v-6h3.75l-7.5-12-7.5 12h3.75v6h-3.75zM409-120.746l7.5-12h-3.75v-6h3.75l-7.5-12-7.5 12h3.75v6h-3.75z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#fff",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 545.912 217.893)"
        >
            <tspan x="0 10.008 20.988001 31.968 42.948002 52.956001" y={0}>
                {"chunks"}
            </tspan>
        </text>
        <path
            d="M318-51h140v-24H318Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 440.373 91.92)"
        >
            <tspan
                x="0 10.72 15.5 20.299999 29.540001 39.52 45.439999 50.240002 61.720001 71.32 80.580002 95.720001 105.32"
                y={0}
            >
                {"Client Daemon"}
            </tspan>
        </text>
        <path
            d="M318-1h140v-33H318Z"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 20,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 457.253 26.667)"
        >
            <tspan
                x="0 11.3 21.280001 31.26 36.060001 40.84 50.080002 59.68 65.599998 70.400002 79.980003"
                y={0}
            >
                {"Application"}
            </tspan>
        </text>
        <path
            d="M318-30h110v-18H318Z"
            style={{
                fill: "#3f90cc",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "&quot",
                writingMode: "horizontal-tb",
                fill: "#fff",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 436.95 59.683)"
        >
            <tspan
                x="0 9.1120005 13.175 17.254999 25.108999 33.591999 38.624001 42.703999 50.575001 54.638 63.120998 68.781998 76.942001 82.908997"
                y={0}
            >
                {"Client Library"}
            </tspan>
        </text>
        <path
            d="M77.102-39H44.609v-24h2.493"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m55.102-63-8 3v-6zM85.102-39l-8 3v-6z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="M438.898-39H482.5v-24h-13.602"
            style={{
                fill: "none",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <path
            d="m460.898-63 8-3v6zM430.898-39l8-3v6z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="matrix(1.33333 0 0 -1.33333 0 0)"
        />
        <text
            style={{
                fontVariant: "normal",
                fontWeight: 700,
                fontSize: 16,
                fontFamily: "Arial",
                writingMode: "horizontal-tb",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                stroke: "none",
            }}
            transform="matrix(1.33333 0 0 1.33333 288.17 51.383)"
        >
            <tspan
                x="0 11.552 21.312 31.072001 39.967999 44.400002 53.296001 58.624001 67.519997 77.279999"
                y={0}
            >
                {"Consistent"}
            </tspan>
            <tspan
                x="12.975008 24.527008 33.423008 42.319008 52.079006 60.975006"
                y={27.051}
            >
                {"Hashed"}
            </tspan>
        </text>
    </svg>
)

export default InfiniStoreArchitecture;
