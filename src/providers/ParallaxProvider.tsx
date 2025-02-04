'use client';

import { ParallaxProvider } from 'react-scroll-parallax';

export function ParallaxProviders({ children }: { children: React.ReactNode }) {
    return <ParallaxProvider>{children}</ParallaxProvider>;
}