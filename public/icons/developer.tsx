import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width="2em"
        height="2em"
        fill="current"
        stroke="current"
        viewBox="0 0 256 165"
        {...props}
    >
        <path d="m240.4 72.5-25.9 76.1h-39.3c0-9.8-7.4-17.1-17.7-17.1h-61S82.6 84.3 75.2 72.3C70.4 64.5 63 59.6 53.3 59.6c-15 0-26.3 12.4-34.5 30.3C8.8 111.7 3.1 137.6 2 163h217.5c3.1 0 5.9-2 6.9-5L254 77.1l-13.6-4.6zM128 34.6c0 18-14.6 32.6-32.6 32.6S62.8 52.6 62.8 34.6 77.4 2 95.4 2c2.1 0 4.1.2 6 .6L94 18.5c-.3 0-.7-.1-1-.1-7.6 0-13.8 6.2-13.8 13.8S85.4 46 93 46s13.8-6.2 13.8-13.8c0-3.7-1.5-7.1-3.9-9.6l7.9-16.8C121 11.4 128 22.2 128 34.6z" />
    </svg>
)
export default SvgComponent
