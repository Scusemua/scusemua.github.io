import * as React from "react"
import { SVGProps } from "react"
import LambdaFSArchitecture from "@data/architecture_diagrams/lambda_fs_arch";

interface WukongArchitectureProps {
    width?: number;
    height?: number;
    scale?: number;
}

const WukongArchitecture = (props: WukongArchitectureProps) => (
    <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 5 795 820"
        display={"block"}
        style={{position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "block"}} // , left: "0", top: "0", width: "100%", height: "100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        transform={`scale(${props.scale || 1}, ${props.scale || 1})`}
        xmlSpace="preserve"
        {...props}
    >
        <defs>
            <clipPath id="a">
                <path d="M527 709h31v32h-31Z" />
            </clipPath>
            <clipPath id="b">
                <path d="M613 709h31v32h-31Z" />
            </clipPath>
            <clipPath id="c">
                <path d="M498 619h31v31h-31Z" />
            </clipPath>
            <clipPath id="d">
                <path d="M642 619h31v31h-31Z" />
            </clipPath>
            <clipPath id="e">
                <path d="M570 548h31v32h-31Z" />
            </clipPath>
            <clipPath id="f">
                <path d="M140.254 562.176h58.238v47.203h-58.238Z" />
            </clipPath>
            <clipPath id="g">
                <path d="M0 0h811v828H0Z" />
            </clipPath>
        </defs>
        <path fill="#ededed" d="M43 514h254.516v273.609H43Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M43 514h254.516v273.609H43Z"
        />
        <path
            fill="#d9f0ff"
            d="M422.973 660.434c-71.868-15.879-43.211-149.539 71.433-126.731 10.641-44.457 143.957-37.242 143.082 0 83.594-47.633 190.422 47.344 118.77 94.977 85.98 23.09-1.086 147.515-71.653 126.73-5.644 34.641-131.793 46.766-142.867 0-71.429 49.942-220.379-26.848-118.765-94.976Zm0 0"
        />
        <path
            fill="#fff"
            d="M101.629 63.371c12.496 12.5 12.496 32.758 0 45.258-12.5 12.496-32.758 12.496-45.258 0-12.496-12.5-12.496-32.758 0-45.258 12.5-12.496 32.758-12.496 45.258 0"
        />
        <path
            fill="none"
            stroke="#585858"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M101.629 63.371c12.496 12.5 12.496 32.758 0 45.258-12.5 12.496-32.758 12.496-45.258 0-12.496-12.5-12.496-32.758 0-45.258 12.5-12.496 32.758-12.496 45.258 0"
        />
        <path
            fill="#585858"
            d="M100.332 104.711v2.945H57.668c0-7.504 9.551-13.586 21.332-13.586 11.609.004 21.086 4.731 21.332 10.641Zm0 0"
        />
        <path
            fill="#585858"
            d="M90.82 69.336c6.528 6.656 6.528 17.445 0 24.102a16.49 16.49 0 0 1-23.64 0c-6.528-6.657-6.528-17.446 0-24.102a16.49 16.49 0 0 1 23.64 0"
        />
        <path
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M90.82 69.336c6.528 6.656 6.528 17.445 0 24.102a16.49 16.49 0 0 1-23.64 0c-6.528-6.657-6.528-17.446 0-24.102a16.49 16.49 0 0 1 23.64 0"
        />
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={24}>
            <tspan x="54.2922 71.5962 83.572208 96.460208" y={146.164}>
                {"User"}
            </tspan>
        </text>
        <path fill="#ededed" d="M210 42h567v336H210Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M210 42h567v336H210Z"
        />
        <path fill="#fff" d="M230 63.25h136v68H230Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M230 63.25h136v68H230Z"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="268.412 282.348 288.56199 294.80198 306.81398 319.78797 327.48399"
                y={90.522}
            >
                {"Client "}
            </tspan>
            <tspan
                x="252.04479 258.2588 271.2328 278.9288 290.9668 299.6248 307.32078 319.80076 331.81275"
                y={122.25}
            >
                {"interface"}
            </tspan>
        </text>
        <path fill="#fff" d="M417 63.25h136v68H417Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M417 63.25h136v68H417Z"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan x="463.082 478.00599 492.43598 506.86598" y={90.522}>
                {"DAG "}
            </tspan>
            <tspan
                x="434.9629 447.9369 459.97489 472.94889 484.98689 493.64488 506.12486 513.82089 526.30087"
                y={122.25}
            >
                {"generator"}
            </tspan>
        </text>
        <path fill="#fff" d="M618 63.25h136v148.5H618Z" />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="8,8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M618 63.25h136v148.5H618Z"
        />
        <path
            fill="#0861c1"
            d="M704.867 70.871a8.091 8.091 0 0 1 0 11.449 8.094 8.094 0 1 1-11.445-11.449 8.094 8.094 0 0 1 11.445 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M704.867 70.871a8.091 8.091 0 0 1 0 11.449 8.094 8.094 0 1 1-11.445-11.449 8.094 8.094 0 0 1 11.445 0"
        />
        <path
            fill="#0861c1"
            d="M678.656 114.043a8.098 8.098 0 0 1 0 11.449c-3.16 3.16-8.285 3.16-11.449 0a8.098 8.098 0 0 1 0-11.449c3.164-3.16 8.289-3.16 11.449 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M678.656 114.043a8.098 8.098 0 0 1 0 11.449c-3.16 3.16-8.285 3.16-11.449 0a8.098 8.098 0 0 1 0-11.449c3.164-3.16 8.289-3.16 11.449 0"
        />
        <path
            fill="#0861c1"
            d="M647.82 192.68c3.16 3.164 3.16 8.289 0 11.449-3.164 3.16-8.289 3.16-11.449 0s-3.16-8.285 0-11.449c3.16-3.16 8.285-3.16 11.449 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M647.82 192.68c3.16 3.164 3.16 8.289 0 11.449-3.164 3.16-8.289 3.16-11.449 0s-3.16-8.285 0-11.449c3.16-3.16 8.285-3.16 11.449 0"
        />
        <path
            fill="#0861c1"
            d="M731.082 192.68c3.16 3.164 3.16 8.289 0 11.449s-8.285 3.16-11.449 0c-3.16-3.16-3.16-8.285 0-11.449 3.164-3.16 8.289-3.16 11.449 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M731.082 192.68c3.16 3.164 3.16 8.289 0 11.449s-8.285 3.16-11.449 0c-3.16-3.16-3.16-8.285 0-11.449 3.164-3.16 8.289-3.16 11.449 0"
        />
        <path
            fill="#0861c1"
            d="M704.867 152.59a8.091 8.091 0 0 1 0 11.449 8.094 8.094 0 1 1-11.445-11.449 8.094 8.094 0 0 1 11.445 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M704.867 152.594a8.086 8.086 0 0 1 0 11.445 8.094 8.094 0 1 1 0-11.445"
        />
        <path
            fill="#0861c1"
            d="M731.082 114.043a8.098 8.098 0 0 1 0 11.449c-3.16 3.16-8.285 3.16-11.449 0a8.098 8.098 0 0 1 0-11.449c3.164-3.16 8.289-3.16 11.449 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M731.082 114.043a8.098 8.098 0 0 1 0 11.449c-3.16 3.16-8.285 3.16-11.449 0a8.098 8.098 0 0 1 0-11.449c3.164-3.16 8.289-3.16 11.449 0m-85.668 75.895 24.199-61.7m8.039-16.246 16.774-27.621m26.211 27.621-16.77-27.621m.395 66.422 15.98-23.504m-26.211 23.504-15.984-23.504m42.332 63.504-16.258-24.863"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={32}
            fontWeight="bold"
        >
            <tspan x="668.838 700.838" y={199.164}>
                {"\u2026 "}
            </tspan>
        </text>
        <path fill="#fff" d="M417 252h337v112H417Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M417 252h337v112H417Z"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="435.22 441.928 454.902 461.116 468.812 475.026 487.53199 493.74598 499.98597 507.68196 520.1619 531.7059 544.7059 550.91989 562.9578 574.96987 587.0078 599.01986 611.99386 619.6898 632.1698 640.8278 647.0678 653.28189 666.25588 677.77389 690.25387 703.25387 715.2918 723.9498"
                y={349.136}
            >
                {"Initial task executor invokers"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M475.141 261s-5.789 3.742-5.621 9.309c.168 5.57 6.351 4.191 6.207 10.347-.149 6.153-6.579 5.223-6.723 11.379-.149 6.153 6.207 4.629 6.207 10.344s-6.356 4.555-6.207 9.828c.144 5.273 6.723 8.793 6.723 8.793m56.414-60s-5.789 3.742-5.621 9.309c.168 5.57 6.351 4.191 6.207 10.347-.149 6.153-6.579 5.223-6.723 11.379-.149 6.153 6.207 4.629 6.207 10.344s-6.356 4.555-6.207 9.828c.144 5.273 6.723 8.793 6.723 8.793m56.414-60s-5.789 3.742-5.621 9.309c.168 5.57 6.351 4.191 6.207 10.347-.149 6.153-6.579 5.223-6.723 11.379-.149 6.153 6.207 4.629 6.207 10.344s-6.356 4.555-6.207 9.828c.144 5.273 6.723 8.793 6.723 8.793m117.414-60s-5.789 3.742-5.621 9.309c.168 5.57 6.351 4.191 6.207 10.347-.149 6.153-6.579 5.223-6.723 11.379-.149 6.153 6.203 4.629 6.203 10.344s-6.352 4.555-6.203 9.828c.144 5.273 6.723 8.793 6.723 8.793"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={40}
            fontWeight="bold"
        >
            <tspan x="625.365 665.365" y={304.44}>
                {"\u2026 "}
            </tspan>
        </text>
        <path fill="#fff" d="M230 296h136v68H230Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M230 296h136v68H230Z"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="242.165 255.65898 268.633 281.607 293.151 305.163 313.82099 320.03498 333.00898 345.04698 353.70497"
                y={323.272}
            >
                {"Subscriber "}
            </tspan>
            <tspan
                x="257.349 270.323 278.981 291.461 303.473 315.511 327.055"
                y={355}
            >
                {"process"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m119 97 96.852.137"
        />
        <path d="m225.352 97.148-9.497-3.574-.011 7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m225.352 97.148-9.497-3.574-.011 7.125Zm0 0"
        />
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={24}>
            <tspan
                x="123.756 139.284 152.604 166.83602 187.308 192.612 200.172"
                y={91.578}
            >
                {"Submit "}
            </tspan>
            <tspan x="139.30818 144.63617 158.38817 172.62018" y={120.25}>
                {"jobs"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M367 97.25h35.852"
        />
        <path d="m412.352 97.25-9.5-3.562v7.124Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m412.352 97.25-9.5-3.562v7.124Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m554 97.637 51.852.289"
        />
        <path d="m615.352 97.98-9.481-3.617-.043 7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m615.352 97.98-9.481-3.617-.043 7.125Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M485 221v17.852"
        />
        <path d="m485 248.352 3.562-9.5h-7.124Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m485 248.352 3.562-9.5h-7.124Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M298 295V186h104.852"
        />
        <path d="m412.352 186-9.5-3.562v7.124Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m412.352 186-9.5-3.562v7.124Zm0 0"
        />
        <path fill="#fff" d="M417 152h136v68H417Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M417 152h136v68H417Z"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="437.576 451.06999 463.08198 476.05598 488.09397 501.06797 514.04196 520.256 532.29397"
                y={179.272}
            >
                {"Schedule "}
            </tspan>
            <tspan
                x="434.9627 447.9367 459.9747 472.9487 484.9867 493.64469 506.12467 513.8207 526.30068"
                y={211}
            >
                {"generator"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m618 187-50.852-.383"
        />
        <path d="m557.648 186.547 9.473 3.633.055-7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m557.648 186.547 9.473 3.633.055-7.125Zm0 0"
        />
        <path
            fill="#0861c1"
            d="M516.184 394.77a6.04 6.04 0 0 1 0 8.542 6.037 6.037 0 0 1-8.547 0 6.038 6.038 0 0 1 0-8.542 6.044 6.044 0 0 1 8.547 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M516.184 394.77a6.04 6.04 0 0 1 0 8.542 6.037 6.037 0 0 1-8.547 0 6.038 6.038 0 0 1 0-8.542 6.044 6.044 0 0 1 8.547 0"
        />
        <path
            fill="#0861c1"
            d="M496.617 426.992a6.04 6.04 0 0 1 0 8.543 6.034 6.034 0 0 1-8.543 0 6.041 6.041 0 0 1 8.543-8.543"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M496.617 426.992a6.04 6.04 0 0 1 0 8.543 6.034 6.034 0 0 1-8.543 0 6.041 6.041 0 0 1 8.543-8.543"
        />
        <path
            fill="#0861c1"
            d="M473.602 485.688a6.04 6.04 0 0 1 0 8.542 6.04 6.04 0 0 1-8.543 0 6.038 6.038 0 0 1 0-8.542 6.032 6.032 0 0 1 8.543 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M473.602 485.688a6.04 6.04 0 0 1 0 8.542 6.04 6.04 0 0 1-8.543 0 6.038 6.038 0 0 1 0-8.542 6.032 6.032 0 0 1 8.543 0m-1.7-2.286 17.871-45.578m6.231-12.578 12.25-20.184"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={45}
            fontWeight="bold"
        >
            <tspan x="566.536 611.536" y={457.62}>
                {"\u2026 "}
            </tspan>
        </text>
        <path
            fill="#00bfc0"
            d="M698.449 482.98a5.958 5.958 0 0 1 0 8.422 5.951 5.951 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M698.449 482.98a5.958 5.958 0 0 1 0 8.422 5.951 5.951 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0"
        />
        <path
            fill="#00bfc0"
            d="M679.164 453.488a5.951 5.951 0 0 1 0 8.422 5.951 5.951 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M679.164 453.488a5.951 5.951 0 0 1 0 8.422 5.951 5.951 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0"
        />
        <path
            fill="#00bfc0"
            d="M698.449 425.133a5.958 5.958 0 0 1 0 8.422 5.958 5.958 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M698.449 425.133a5.958 5.958 0 0 1 0 8.422 5.958 5.958 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.958 5.958 0 0 1 8.422 0m-19.582 26.816 11.457-16.851m.106 46.273-11.668-17.848"
        />
        <path
            fill="#00bfc0"
            d="M679.164 392.098a5.951 5.951 0 0 1 0 8.422 5.958 5.958 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.951 5.951 0 0 1 8.422 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M679.164 392.098a5.951 5.951 0 0 1 0 8.422 5.958 5.958 0 0 1-8.422 0 5.958 5.958 0 0 1 0-8.422 5.951 5.951 0 0 1 8.422 0m11.566 31.238-12.269-21.02"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="9,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M490.121 364v37"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="2.25,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M685.5 496.75v23.852"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m685.5 530.102 3.562-9.5h-7.124Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="9,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M685.5 364v37"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="2.25,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M490.121 469.75v50.852"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m490.121 530.102 3.563-9.5h-7.125Zm0 0"
        />
        <path fill="#fff" d="M562.359 540.648h46.281v46.277h-46.281Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M562.359 540.648h46.281v46.277h-46.281Z"
        />
        <path fill="#fff" d="M490.121 611.395h46.277v46.281h-46.277Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M490.121 611.395h46.277v46.281h-46.277Z"
        />
        <path fill="#fff" d="M634.602 611.395h46.277v46.281h-46.277Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M634.602 611.395h46.277v46.281h-46.277Z"
        />
        <path fill="#fff" d="M519 701.648h46.277v46.277H519Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M519 701.648h46.277v46.277H519Z"
        />
        <path fill="#fff" d="M605 701.648h46.277v46.277H605Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M605 701.648h46.277v46.277H605Z"
        />
        <g clipPath="url(#a)">
            <image
                xlinkHref="data:image/png;base64, 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 xWT7msvQ9n963GjW8SLMOAAAAABJRU5ErkJggg=="
                width={93}
                height={96}
                transform="translate(527 709) scale(.33333)"
            />
        </g>
        <g clipPath="url(#b)">
            <image
                xlinkHref="data:image/png;base64, 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 xWT7msvQ9n963GjW8SLMOAAAAABJRU5ErkJggg=="
                width={93}
                height={96}
                transform="translate(613 709) scale(.33333)"
            />
        </g>
        <g clipPath="url(#c)">
            <image
                xlinkHref="data:image/png;base64, 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"
                width={93}
                height={93}
                transform="translate(498 619) scale(.33333)"
            />
        </g>
        <g clipPath="url(#d)">
            <image
                xlinkHref="data:image/png;base64, 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"
                width={93}
                height={93}
                transform="translate(642 619) scale(.33333)"
            />
        </g>
        <g clipPath="url(#e)">
            <image
                xlinkHref="data:image/png;base64, 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"
                width={93}
                height={96}
                transform="translate(570 548) scale(.33333)"
            />
        </g>
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m534.254 700.148-9.77-30.535"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m521.938 661.648-.442 8.918 5.973-1.91Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m636.219 700.148 10.023-30.558"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m648.848 661.645-5.582 6.964 5.957 1.957Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m566.777 705.551 57.688-45.035"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m631.055 655.371-8.52 2.676 3.856 4.941Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m603.5 705.43-56.984-44.77"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m539.941 655.496 4.637 7.633 3.875-4.934Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m633.102 610.406-15.133-14.82"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m611.996 589.734 3.781 8.09 4.387-4.48Zm0 0"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="1.5,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m537.898 610.406 15.133-14.82"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m559.004 589.734-8.164 3.61 4.383 4.48Zm0 0"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={32}
            fontWeight="bold"
        >
            <tspan x="570.226 602.226" y={657.338}>
                {"\u2026 "}
            </tspan>
            <tspan x="570.4526 602.4526" y={736.338}>
                {"\u2026 "}
            </tspan>
        </text>
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={20}>
            <tspan
                x="468.293 482.013 492.733 503.453 514.91299 531.97299"
                y={591.867}
            >
                {"Become"}
            </tspan>
            <tspan
                x="453.875 459.035 470.135 480.11503 491.59504 501.975 664.93508 678.655 689.375 700.095 711.55496 728.6149"
                y={696.367}
            >
                {"InvokeBecome"}
            </tspan>
            <tspan
                x="636.243 641.403 652.503 662.483 673.96298 684.34298"
                y={591.867}
            >
                {"Invoke"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="430.111 443.60499 455.64299 464.74299 476.287 488.29899 496.95698 503.17097 515.2089 526.75289 538.2968 544.5368 552.2328 564.71279 576.2567 589.2567 595.4707 607.50869 619.5207 631.55868 643.5707 656.5447 664.24069 670.4547 682.9347 695.9087 702.1487 714.65469 727.62869 740.60269"
                y={782.633}
            >
                {"Serverless task execution and "}
            </tspan>
            <tspan
                x="445.893 459.127 470.64503 483.61903 496.125 515.807 522.02108 534.0331 540.2731 551.817 563.82907 576.80307 588.841 601.815 614.789 621.00308 627.2431 640.2171 653.1911 659.4311 667.12716 679.6331 685.8471 698.3271 704.5411 716.99508"
                y={814.361}
            >
                {"dynamic scheduling (\xA7 3.3)"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={22}
            fontWeight="bold"
        >
            <tspan
                x="619.389 629.57498 640.13497 656.78897 667.7669 678.7449 689.3269 694.5849 704.77096 714.93496 725.121 735.285 746.263 752.77499 763.33499"
                y={559.964}
            >
                {"Lambda executor"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="263.887 270.595 283.569 291.265 303.303 311.961 319.65699 332.13697 344.14897 356.18696 367.73097 373.94496 386.45094 399.42494 412.39894 418.63893 430.15693 437.85295 450.35893 458.05494 464.26893 476.2809 482.5209 494.0649 506.0769 519.0509 531.08889 544.06289 557.03689 563.2509 575.2889 583.9469 590.1869 597.88296 610.3889 616.6289 629.0829 635.2969 647.75088 653.00289 659.24288 671.74887 677.98886 690.4428 696.6568 709.1108"
                y={30.136}
            >
                {"Interfaces and static scheduler (\xA7 3.2, \xA7 3.5)"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="9,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M587.809 364v37"
        />
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="2.25,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M587.809 475.57v40.852"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m587.809 525.922 3.562-9.5h-7.125Zm0 0"
        />
        <path fill="#affaac" d="M94.875 551.824h145.793v68H94.875Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M94.875 551.824h145.793v68H94.875Z"
        />
        <path fill="#fff" d="M143.902 565.996h50.941v38.629h-50.941Z" />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M143.902 565.996h50.941v38.629h-50.941Z"
        />
        <g clipPath="url(#f)">
            <g clipPath="url(#g)">
                <path fill="#4c4e52" d="M151.062 578.473h36.445v5.523h-36.445Z" />
                <path
                    fill="#4c4e52"
                    fillRule="evenodd"
                    d="M198.402 565.895c0-1.938-1.574-3.629-3.636-3.629h-50.774a3.65 3.65 0 0 0-3.648 3.629v39.777c0 2.047 1.586 3.617 3.648 3.617h50.774c2.062 0 3.636-1.57 3.636-3.617Zm-28.168 0h14.09v1.816h-14.09Zm24.532 39.777h-50.774V571.34h50.774Zm0-37.961h-6.801v-1.816h6.801v1.816"
                />
                <path
                    fill="none"
                    stroke="#000"
                    strokeMiterlimit={10}
                    strokeWidth={0.011}
                    d="M198.402 567.561c0-1.943-1.574-3.639-3.636-3.639h-50.77c-2.066 0-3.652 1.696-3.652 3.639v39.895c0 2.053 1.586 3.628 3.652 3.628h50.77c2.062 0 3.636-1.575 3.636-3.628Zm-28.168 0h14.09v1.822h-14.09Zm24.532 39.895h-50.77v-34.437h50.77Zm0-38.073h-6.801v-1.822h6.801Zm0 0"
                    transform="scale(1 .99706)"
                />
                <path
                    fill="#4c4e52"
                    fillRule="evenodd"
                    d="M151.062 589.52h36.445v5.344h-36.445Z"
                />
            </g>
        </g>
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="91.0926 110.3326 122.370609 130.0666 142.5466 155.5206 168.0006 175.6966 188.17659 194.4166 205.9606 213.6566 226.1366 234.79459"
                y={547.171}
            >
                {"Metadata store"}
            </tspan>
        </text>
        <path
            fill="#fbe5d6"
            d="M94.516 768.148v-68.882c0-4.754 32.656-8.61 72.898-8.61 40.238 0 72.895 3.856 72.895 8.61v68.882c0 4.754-32.657 8.61-72.895 8.61-40.242 0-72.898-3.856-72.898-8.61"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M94.516 768.148v-68.882c0-4.754 32.656-8.61 72.898-8.61 40.238 0 72.895 3.856 72.895 8.61v68.882c0 4.754-32.657 8.61-72.895 8.61-40.242 0-72.898-3.856-72.898-8.61m0-68.882c0 4.754 32.656 8.609 72.898 8.609 40.238 0 72.895-3.855 72.895-8.609"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={26}
            fontWeight="bold"
        >
            <tspan
                x="58.4184 65.1264 78.1004 85.7964 97.834407 106.4924 126.17439 138.1864 151.1864 157.4004 169.8804 177.5764 189.61441 195.85442 209.79042 223.25843 229.49843 241.01644 248.71244 261.19245 269.85044"
                y={682.497}
            >
                {"Intermediate KV store"}
            </tspan>
            <tspan
                x="45.704298 59.198297 66.894298 79.3743 88.0323 100.51231 113.48631 125.52432 131.76433 151.44632 163.92632 176.90033 189.38033 202.35433 214.39234 223.05033 229.29033 236.98633 249.49233 255.73232 268.1863 274.4003 286.8543"
                y={814.497}
            >
                {"Storage manager (\xA7 3.4)"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m387.414 733.039-132.453.402"
        />
        <path d="m245.461 733.469 9.512 3.535-.024-7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m245.461 733.469 9.512 3.535-.024-7.125Zm0 0"
        />
        <path d="m396.914 733.012-9.508-3.535.02 7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m396.914 733.012-9.508-3.535.02 7.125Zm0 0"
        />
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={20}>
            <tspan
                x="310 323.68 334.41999 345.13999 356.96 363.62 378.78 385.42 389.86003 396.16"
                y={725.807}
            >
                {"Read/write"}
            </tspan>
            <tspan
                x="302.93009 307.3501 318.4501 324.7501 335.49009 342.1501 359.21009 369.95008 381.79008 386.21009 396.93009 403.23008 413.97007"
                y={749.367}
            >
                {"intermediate "}
            </tspan>
            <tspan x="338.68009 350.52009 361.24009 367.54008" y={772.927}>
                {"data"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m378.852 586.828-123.532-.894"
        />
        <path d="m245.82 585.863 9.473 3.633.051-7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m245.82 585.863 9.473 3.633.051-7.125Zm0 0"
        />
        <path d="m388.352 586.898-9.477-3.632-.051 7.125Zm0 0" />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m388.352 586.898-9.477-3.632-.051 7.125Zm0 0"
        />
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={18}>
            <tspan
                x="302.414 314.078 323.72599 329.72 339.36799 343.34599 347.34199 356.99 360.986 364.964 373.586 383.252 388.238 393.566 403.214 413.204 420.18803 430.502 440.51005 446.18006 451.16606"
                y={558.639}
            >
                {"Parallelize fan-out, "}
            </tspan>
            <tspan
                x="309.87495 313.85295 323.84297 333.50895 339.16096 348.82698 364.18098 373.847 383.837 389.489 395.48304 405.131 415.12104 424.78706 434.43504 443.77705"
                y={580.143}
            >
                {"increment/check "}
            </tspan>
            <tspan
                x="327.04685 337.70283 347.36885 358.0248 367.69084 377.68086 388.33683 398.00285 407.99287 417.65885 426.64085"
                y={601.647}
            >
                {"dependency "}
            </tspan>
            <tspan
                x="321.71913 331.3671 341.6811 351.68913 361.67915 367.34916 376.99717 382.99119 391.9732 396.9592 401.9632 411.6112 417.28123 426.9292"
                y={623.151}
            >
                {"counters, etc."}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#000"
            strokeDasharray="2.25,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="M169.008 520.535 169 486l261 1v34.852"
        />
        <path
            fill="none"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m430 531.352 3.562-9.5h-7.124Zm0 0"
        />
        <text xmlSpace="preserve" fontFamily="DejaVuSans" fontSize={22}>
            <tspan
                x="265.60499 271.28099 283.49098 294.469 307.097 318.51499"
                y={477.192}
            >
                {"Invoke"}
            </tspan>
            <tspan
                x="554.9409 560.61697 572.82699 583.805 596.433 607.85098"
                y={427.016}
            >
                {"Invoke"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={22}
            fontWeight="bold"
        >
            <tspan
                x="378.94593 390.36393 401.34193 412.31993 423.2979 430.62394 441.18394 452.16194 463.16194"
                y={432.192}
            >
                {"Subgraphs"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fill="#656565"
            fontFamily="DejaVuSans"
            fontSize={24}
        >
            <tspan
                x="5.88008 12.072079 25.392079 37.368078 51.144075 64.00808 76.87208 84.432079 89.73608 103.488079"
                y={389.164}
            >
                {"Invocation"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#656565"
            strokeDasharray="2.25,9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m130.5 383.176 28.352.5"
        />
        <path
            fill="none"
            stroke="#656565"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m168.852 383.852-9.934-3.926-.133 7.5Zm0 0"
        />
        <text
            xmlSpace="preserve"
            fill="#656565"
            fontFamily="DejaVuSans"
            fontSize={24}
        >
            <tspan x="15.6961 32.592103 45.4561 53.0161 65.880107" y={433.148}>
                {"Data "}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fill="#656565"
            fontFamily="DejaVuSans"
            fontSize={24}
        >
            <tspan x={72.528} y={433.148}>
                {"\uFB02"}
            </tspan>
        </text>
        <text
            xmlSpace="preserve"
            fill="#656565"
            fontFamily="DejaVuSans"
            fontSize={24}
        >
            <tspan x="84.960109 98.712108" y={433.148}>
                {"ow"}
            </tspan>
        </text>
        <path
            fill="none"
            stroke="#656565"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            d="m130.5 427.676 28.016.09"
        />
        <path fill="#656565" d="m168.516 427.801-9.989-3.785-.023 7.5Zm0 0" />
        <path
            fill="none"
            stroke="#656565"
            strokeMiterlimit={10}
            strokeWidth={2.25}
            d="m168.516 427.801-9.989-3.785-.023 7.5Zm0 0"
        />
        <text
            xmlSpace="preserve"
            fontFamily="DejaVuSans"
            fontSize={22}
            fontWeight="bold"
        >
            <tspan x="667.454 680.082 692.29196" y={232.192}>
                {"DAG"}
            </tspan>
        </text>
    </svg>
)

export default WukongArchitecture;
