import * as React from "react"
import { SVGProps } from "react"

const MetaLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width="2em"
        height="2em"
        viewBox="0 0 32 32"
        {...props}
    >
        <path d="M5 19.5c0-4.6 2.3-9.4 5-9.4 1.5 0 2.7.9 4.6 3.6-1.8 2.8-2.9 4.5-2.9 4.5-2.4 3.8-3.2 4.6-4.5 4.6-1.3.1-2.2-1.1-2.2-3.3m15.7-1.7L19 15c-.4-.7-.9-1.4-1.3-2 1.5-2.3 2.7-3.5 4.2-3.5 3 0 5.4 4.5 5.4 10.1 0 2.1-.7 3.3-2.1 3.3s-1.9-.9-4.5-5.1M16.4 11c-2.2-2.9-4.1-4-6.3-4C5.5 7 2 13.1 2 19.5c0 4 1.9 6.5 5.1 6.5 2.3 0 3.9-1.1 6.9-6.3 0 0 1.2-2.2 2.1-3.7.3.5.6 1 .9 1.6l1.4 2.4c2.7 4.6 4.2 6.1 6.9 6.1 3.1 0 4.8-2.6 4.8-6.7C30 12.6 26.4 7 22.1 7c-2.3 0-4.1 1.8-5.7 4" />
    </svg>
)

export default MetaLogo
