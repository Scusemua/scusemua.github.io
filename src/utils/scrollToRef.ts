import React from "react";

/** Smoothly scroll the viewport so the referenced element is at the top. */
export function scrollToRef(ref: React.RefObject<HTMLElement> | undefined) {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}
