import * as React from "react"
import { SVGProps } from "react"
const PresentationIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="current"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M12.958 1.713a1 1 0 0 0-1.916 0L10.656 3H4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h1.856l-.814 2.713a1 1 0 1 0 1.916.574L7.944 19h8.112l.986 3.287a1 1 0 0 0 1.916-.574L18.144 19H20a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-6.656l-.386-1.287ZM3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Zm7.894.83A2 2 0 0 0 8 8.617v4.764a2 2 0 0 0 2.894 1.789l4.764-2.382c1.475-.737 1.475-2.84 0-3.578L10.894 6.83ZM10 8.617 14.764 11 10 13.382V8.618Z"
            clipRule="evenodd"
        />
    </svg>
)
export default PresentationIcon
