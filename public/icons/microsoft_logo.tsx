import * as React from "react"
import { SVGProps } from "react"
const MicrosoftLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={"2em"}
        height={"2em"}
        viewBox="0 0 20 20"
        {...props}
    >
        <title>{"microsoft [#150]"}</title>
        <path
            fill="#000"
            fillRule="evenodd"
            d="M10 20h10v-9H10v9ZM0 20h9v-9H0v9Zm10-10h10V0H10v10ZM0 10h9V0H0v10Z"
        />
    </svg>
)
export default MicrosoftLogo
