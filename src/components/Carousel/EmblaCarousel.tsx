import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

type PropType = {
    slides: React.JSX.Element[]
    options?: EmblaOptionsType
    className?: string
    is_xs?: boolean;
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options, className } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className={className ? `${className} embla` : "embla"} style={{
            maxWidth: props.is_xs ? "100%" : "90%",
        }}>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((element: React.JSX.Element, index: number) => (
                        <div className="embla__slide" key={index} style={{
                            flex: `0 0 ${props.is_xs ? "100" : "34"}%`
                        }}>
                            <div className="embla__slide__number">{element}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'embla__dot'.concat(
                                index === selectedIndex ? ' embla__dot--selected' : ''
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
