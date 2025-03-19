import React from 'react'
import {EmblaCarouselType, EmblaEventType, EmblaOptionsType} from 'embla-carousel'
import {useDotButton} from './EmblaCarouselDotButton'
import {usePrevNextButtons} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

import Autoplay from 'embla-carousel-autoplay'
import {useAutoplay} from "@src/components/Carousel/EmblaCarouselAutoplay";
import {Stack, Tooltip} from "@mui/material";
import {ArrowBack, ArrowForward, Lens, PanoramaFishEye, PlayArrowRounded, StopRounded} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

type PropType = {
    slides: React.JSX.Element[]
    onSelectedIndexChanged?: (selectedIndex: number) => void;
    options?: EmblaOptionsType
    autoplayEnabled?: boolean;
    className?: string
    is_md_or_less?: boolean;
    is_lg?: boolean;
}

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max)

const TWEEN_FACTOR_BASE: number = 0.54

const DEFAULT_AUTOPLAY_DELAY: number = 10000;

const EmblaCarousel: React.FC<PropType> = (props) => {
    const {slides, options, className} = props
    // @ts-ignore
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({
        playOnInit: props.autoplayEnabled,
        delay: DEFAULT_AUTOPLAY_DELAY,
        stopOnInteraction: true
    })])

    const tweenFactor = React.useRef<number>(0);

    const {autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick} =
        useAutoplay(emblaApi)

    const {selectedIndex, scrollSnaps, onDotButtonClick} =
        useDotButton(emblaApi)

    React.useEffect(() => {
        if (props.onSelectedIndexChanged) {
            props.onSelectedIndexChanged(selectedIndex);
        }
    }, [selectedIndex])

    const {
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const setTweenFactor = React.useCallback((emblaApi: EmblaCarouselType) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, [])

    const tweenOpacity = React.useCallback(
        (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
            const engine = emblaApi.internalEngine()
            const scrollProgress = emblaApi.scrollProgress()
            const slidesInView = emblaApi.slidesInView()
            const isScrollEvent = eventName === 'scroll'

            emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress
                const slidesInSnap = engine.slideRegistry[snapIndex]

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex)) return

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target()

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target)

                                if (sign === -1) {
                                    diffToTarget = scrollSnap - (1 + scrollProgress)
                                }
                                if (sign === 1) {
                                    diffToTarget = scrollSnap + (1 - scrollProgress)
                                }
                            }
                        })
                    }

                    const tweenValue: number = 1 - Math.abs(diffToTarget * tweenFactor.current)
                    emblaApi.slideNodes()[slideIndex].style.opacity = numberWithinRange(tweenValue, 0, 1).toString()
                })
            })
        },
        []
    )

    React.useEffect(() => {
        if (!emblaApi) return

        setTweenFactor(emblaApi)
        tweenOpacity(emblaApi)
        emblaApi
            .on('reInit', setTweenFactor)
            .on('reInit', tweenOpacity)
            .on('scroll', tweenOpacity)
            .on('slideFocus', tweenOpacity)
    }, [emblaApi, tweenOpacity])

    const getFlexPercent = () => {
        if (props.is_lg) {
            return "75";
        }

        if (props.is_md_or_less) {
            return "100";
        }

        return "33.35";
    }

    const getSlideClassname = (index: number) => {
        if (index === selectedIndex) {
            return "embla__slide"
        }

        if (selectedIndex === 0) {
            if (index === slides.length - 1) {
                return "embla__slide embla__slide_inactive_right"
            }

            return "embla__slide embla__slide_inactive_left"
        }

        if (index > selectedIndex || (selectedIndex === slides.length - 1 && index === 0)) {
            return "embla__slide embla__slide_inactive_left"
        }

        return "embla__slide embla__slide_inactive_right"
    }

    return (
        <section className={className ? `${className} embla` : "embla"}
                 style={{
                     maxWidth: props.is_md_or_less ? "100%" : "90%",
                 }}
        >
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((element: React.JSX.Element, index: number) => (
                        <div className={getSlideClassname(index)} key={index} style={{
                            flex: `0 0 ${getFlexPercent()}%`
                        }}>
                            <div className="embla__slide__number">{element}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <Stack direction={"row"} spacing={2}>
                    <Tooltip title={"Previous project"}>
                        <IconButton size={"large"}
                                    onClick={() => onAutoplayButtonClick(onPrevButtonClick)}>
                            {<ArrowBack sx={{color: "#DEDEDEFF"}}/>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Next project"}>
                        <IconButton size={"large"}
                                    onClick={() => onAutoplayButtonClick(onNextButtonClick)}>
                            {<ArrowForward sx={{color: "#DEDEDEFF"}}/>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={autoplayIsPlaying ? "Pause auto-scrolling" : "Resume auto-scrolling"}>
                        <IconButton size={"large"}
                                    onClick={toggleAutoplay}>
                            {autoplayIsPlaying ? <StopRounded sx={{color: "#DEDEDEFF"}}/> :
                                <PlayArrowRounded sx={{color: "#DEDEDEFF"}}/>}
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/*<div*/}
                {/*    className={`embla__progress`.concat(*/}
                {/*        showAutoplayProgress ? '' : ' embla__progress--hidden'*/}
                {/*    )}*/}
                {/*>*/}
                {/*    <div className="embla__progress__bar" ref={progressNode}/>*/}
                {/*</div>*/}

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <IconButton
                            key={index}
                            size={"medium"}
                            sx={{borderColor: "#DEDEDEFF"}}
                            onClick={() => onDotButtonClick(index)}
                        >
                            {index === selectedIndex ? <Lens sx={{color: "#DEDEDEFF"}}/> :
                                <PanoramaFishEye sx={{color: "#DEDEDEFF"}}/>}
                        </IconButton>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
