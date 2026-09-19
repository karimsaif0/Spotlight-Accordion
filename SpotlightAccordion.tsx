/**
 * Made with 💛 by Karim Saif
 * Created and customized for Framer by Karim Saif
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

type AccordionItem = { question: string; answer: string }

type Props = {
    items: AccordionItem[]
    backgroundColor: string
    textColor: string
    secondaryColor: string
    borderColor: string
    borderRadius: number
    borderWidth: number
    rowGap: number
    padding: number
    questionSize: number
    answerSize: number
    questionWeight: number
    answerLineHeight: number
    spotlightSize: number
    spotlightIntensity: number
    spotlightBlur: number
    spotlightColor: string
    glowColor: string
    glowIntensity: number
    dimOpacity: number
    hoverScale: number
    activeScale: number
    openWidth: number
    animationDuration: number
    openMode: "single" | "multiple"
    cursorEnabled: boolean
    clickToOpen: boolean
    showNumber: boolean
    numberColor: string
    numberSize: number
    plusColor: string
    plusSize: number
}

const defaultItems: AccordionItem[] = [
    { question: "What is your design process?", answer: "I focus on clarity, interaction, and visual hierarchy. Every detail is designed to feel intentional while keeping the experience simple." },
    { question: "Do you create custom websites?", answer: "Yes. Components can be adapted and combined into complete Framer websites tailored to a specific visual direction or brand." },
    { question: "Can I customize the components?", answer: "Yes. Colors, spacing, typography, animation, spotlight behavior, borders, radius, and other visual details can be customized directly in Framer." },
    { question: "Are the components responsive?", answer: "Yes. The accordion adapts to its container and also provides a touch-friendly fallback for mobile devices." },
]

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

function hexToRgb(color: string) {
    const value = String(color || "").trim()
    const hex = value.replace(/^#/, "")
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
        }
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
        }
    }
    const match = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (match) {
        return {
            r: clamp(Number(match[1]), 0, 255),
            g: clamp(Number(match[2]), 0, 255),
            b: clamp(Number(match[3]), 0, 255),
        }
    }
    return { r: 255, g: 255, b: 255 }
}

function rgba(color: string, opacity: number) {
    const rgb = hexToRgb(color)
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + clamp(opacity, 0, 1) + ")"
}

function PlusIcon({ open, color, size, reducedMotion }: {
    open: boolean
    color: string
    size: number
    reducedMotion: boolean
}) {
    return (
        <motion.div
            aria-hidden="true"
            animate={reducedMotion ? {} : { rotate: open ? 45 : 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
        >
            <span style={{
                position: "absolute", left: "50%", top: "50%", width: "100%", height: 1.5,
                transform: "translate(-50%, -50%)", borderRadius: 999, background: color,
            }} />
            <span style={{
                position: "absolute", left: "50%", top: "50%", width: 1.5, height: "100%",
                transform: "translate(-50%, -50%)", borderRadius: 999, background: color,
            }} />
        </motion.div>
    )
}

export default function SpotlightAccordion(props: Props) {
    const {
        items = defaultItems,
        backgroundColor = "#090909",
        textColor = "#FFFFFF",
        secondaryColor = "#8A8A8A",
        borderColor = "#FFFFFF",
        borderRadius = 18,
        borderWidth = 1,
        rowGap = 10,
        padding = 22,
        questionSize = 18,
        answerSize = 15,
        questionWeight = 500,
        answerLineHeight = 1.6,
        spotlightSize = 260,
        spotlightIntensity = 1,
        spotlightBlur = 0,
        spotlightColor = "#FFFFFF",
        glowColor = "#FFFFFF",
        glowIntensity = 0.08,
        dimOpacity = 0.42,
        hoverScale = 1.015,
        activeScale = 1.02,
        openWidth = 24,
        animationDuration = 0.35,
        openMode = "single",
        cursorEnabled = true,
        clickToOpen = true,
        showNumber = true,
        numberColor = "#777777",
        numberSize = 12,
        plusColor = "#FFFFFF",
        plusSize = 18,
    } = props

    const isStatic = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const rowRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const frameRef = React.useRef<number | null>(null)
    const pointerTarget = React.useRef({ x: 0, y: 0 })

    const [pointer, setPointer] = React.useState({ x: 0, y: 0 })
    const [pointerInside, setPointerInside] = React.useState(false)
    const [touchDevice, setTouchDevice] = React.useState(false)
    const [openItems, setOpenItems] = React.useState<number[]>([])
    const [containerWidth, setContainerWidth] = React.useState(0)

    React.useEffect(() => {
        if (typeof window === "undefined") return
        const media = window.matchMedia("(pointer: coarse)")
        const update = () => setTouchDevice(media.matches)
        update()
        media.addEventListener?.("change", update)
        return () => media.removeEventListener?.("change", update)
    }, [])

    React.useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const updateSize = () => setContainerWidth(Math.max(0, container.clientWidth))
        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    React.useEffect(() => () => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current)
            frameRef.current = null
        }
    }, [])

    const spotlightActive =
        !isStatic && !reducedMotion && !touchDevice && cursorEnabled && pointerInside

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (isStatic || reducedMotion || touchDevice || !cursorEnabled) return
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        pointerTarget.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
        if (frameRef.current !== null) return
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null
            setPointer({ x: pointerTarget.current.x, y: pointerTarget.current.y })
        })
    }

    const nearestIndex = React.useMemo(() => {
        if (!spotlightActive) return -1
        const container = containerRef.current
        if (!container) return -1
        const containerRect = container.getBoundingClientRect()
        let nearest = -1
        let nearestDistance = Infinity

        rowRefs.current.forEach((row, index) => {
            if (!row) return
            const rect = row.getBoundingClientRect()
            const centerX = rect.left - containerRect.left + rect.width / 2
            const centerY = rect.top - containerRect.top + rect.height / 2
            const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY)
            if (distance < nearestDistance) {
                nearestDistance = distance
                nearest = index
            }
        })
        return nearest
    }, [pointer.x, pointer.y, spotlightActive])

    const toggleItem = (
        index: number,
        event?: React.MouseEvent | React.KeyboardEvent
    ) => {
        event?.preventDefault()
        event?.stopPropagation()
        if (!clickToOpen) return

        setOpenItems((current) => {
            if (current.includes(index)) return current.filter((item) => item !== index)
            if (openMode === "single") return [index]
            return [...current, index]
        })
    }

    const radius = Math.max(1, spotlightSize / 2)

    const spotlightBackground = spotlightActive
        ? "radial-gradient(circle " + radius + "px at " + pointer.x + "px " + pointer.y + "px, " +
          rgba(spotlightColor, spotlightIntensity * 0.14) + " 0%, " +
          rgba(spotlightColor, spotlightIntensity * 0.055) + " 28%, transparent 72%)"
        : "none"

    const glowBackground = spotlightActive
        ? "radial-gradient(circle " + radius * 1.7 + "px at " + pointer.x + "px " + pointer.y + "px, " +
          rgba(glowColor, glowIntensity) + " 0%, transparent 68%)"
        : "none"

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => {
                if (!touchDevice && cursorEnabled) setPointerInside(true)
            }}
            onPointerLeave={() => setPointerInside(false)}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 100,
                overflow: "hidden",
                background: backgroundColor,
                borderRadius,
                boxSizing: "border-box",
            }}
        >
            <div aria-hidden="true" style={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                background: spotlightBackground,
                filter: spotlightBlur > 0 ? "blur(" + spotlightBlur + "px)" : undefined,
            }} />

            <div aria-hidden="true" style={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                background: glowBackground,
            }} />

            {spotlightActive && (
                <div aria-hidden="true" style={{
                    position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                    background: "rgba(0, 0, 0, " + clamp(dimOpacity, 0, 0.9) + ")",
                    maskImage: "radial-gradient(circle " + radius + "px at " + pointer.x + "px " + pointer.y + "px, transparent 0%, black 72%)",
                    WebkitMaskImage: "radial-gradient(circle " + radius + "px at " + pointer.x + "px " + pointer.y + "px, transparent 0%, black 72%)",
                }} />
            )}

            <div style={{
                position: "relative", zIndex: 2, width: "100%", height: "100%",
                overflowY: "auto", padding, boxSizing: "border-box",
            }}>
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "stretch",
                    gap: rowGap, width: "100%", boxSizing: "border-box",
                }}>
                    {items.map((item, index) => {
                        const open = openItems.includes(index)
                        const focused = nearestIndex === index
                        const rowOpacity = spotlightActive
                            ? focused ? 1 : 1 - dimOpacity * 0.72
                            : 1
                        const openScaleX =
                            open && containerWidth > 0
                                ? 1 + openWidth / containerWidth
                                : 1
                        const answerId = "spotlight-accordion-answer-" + index

                        return (
                            <motion.div
                                key={index + "-" + item.question}
                                ref={(element) => { rowRefs.current[index] = element }}
                                initial={false}
                                animate={{
                                    scaleX: open ? openScaleX : focused ? hoverScale : 1,
                                    scaleY: focused ? activeScale : 1,
                                    opacity: rowOpacity,
                                    filter: spotlightActive && !focused ? "blur(1.5px)" : "blur(0px)",
                                }}
                                transition={{
                                    scaleX: { duration: reducedMotion ? 0 : animationDuration, ease: [0.22, 1, 0.36, 1] },
                                    scaleY: { duration: reducedMotion ? 0 : animationDuration, ease: [0.22, 1, 0.36, 1] },
                                    opacity: { duration: reducedMotion ? 0 : animationDuration },
                                    filter: { duration: reducedMotion ? 0 : animationDuration },
                                }}
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    alignSelf: "stretch",
                                    flexShrink: 0,
                                    overflow: "hidden",
                                    border: borderWidth + "px solid " + rgba(borderColor, focused || open ? 0.65 : 0.16),
                                    borderRadius,
                                    background: rgba("#FFFFFF", focused ? 0.055 : open ? 0.035 : 0.012),
                                    boxSizing: "border-box",
                                    transformOrigin: "center center",
                                    boxShadow: focused
                                        ? "0 0 " + Math.max(10, spotlightSize * 0.08) + "px " + rgba(spotlightColor, 0.09)
                                        : "none",
                                }}
                            >
                                <div
                                    role={clickToOpen ? "button" : undefined}
                                    tabIndex={clickToOpen ? 0 : undefined}
                                    aria-expanded={clickToOpen ? open : undefined}
                                    aria-controls={clickToOpen ? answerId : undefined}
                                    onClick={(event) => toggleItem(index, event)}
                                    onKeyDown={(event) => {
                                        if (!clickToOpen) return
                                        if (event.key === "Enter" || event.key === " ") toggleItem(index, event)
                                    }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 16,
                                        width: "100%", padding, color: textColor,
                                        cursor: clickToOpen ? "pointer" : "default",
                                        userSelect: "none", WebkitUserSelect: "none",
                                        boxSizing: "border-box", outline: "none",
                                    }}
                                >
                                    {showNumber && (
                                        <span style={{
                                            flexShrink: 0, color: numberColor, fontSize: numberSize,
                                            lineHeight: 1, fontVariantNumeric: "tabular-nums",
                                            opacity: focused || open ? 1 : 0.65,
                                        }}>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    )}

                                    <span style={{
                                        flex: 1, minWidth: 0, fontSize: questionSize,
                                        lineHeight: 1.25, fontWeight: questionWeight,
                                        letterSpacing: "-0.02em",
                                    }}>
                                        {item.question}
                                    </span>

                                    <PlusIcon
                                        open={open}
                                        color={plusColor}
                                        size={plusSize}
                                        reducedMotion={!!reducedMotion}
                                    />
                                </div>

                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            id={answerId}
                                            key="answer"
                                            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                            transition={{
                                                duration: reducedMotion ? 0 : animationDuration,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div style={{
                                                padding: "0 " + padding + "px " + padding + "px",
                                                paddingLeft: showNumber ? padding + numberSize + 16 : padding,
                                                color: secondaryColor,
                                                fontSize: answerSize,
                                                lineHeight: answerLineHeight,
                                                boxSizing: "border-box",
                                            }}>
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

SpotlightAccordion.defaultProps = {
    items: defaultItems,
    backgroundColor: "#090909",
    textColor: "#FFFFFF",
    secondaryColor: "#8A8A8A",
    borderColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    rowGap: 10,
    padding: 22,
    questionSize: 18,
    answerSize: 15,
    questionWeight: 500,
    answerLineHeight: 1.6,
    spotlightSize: 260,
    spotlightIntensity: 1,
    spotlightBlur: 0,
    spotlightColor: "#FFFFFF",
    glowColor: "#FFFFFF",
    glowIntensity: 0.08,
    dimOpacity: 0.42,
    hoverScale: 1.015,
    activeScale: 1.02,
    openWidth: 24,
    animationDuration: 0.35,
    openMode: "single",
    cursorEnabled: true,
    clickToOpen: true,
    showNumber: true,
    numberColor: "#777777",
    numberSize: 12,
    plusColor: "#FFFFFF",
    plusSize: 18,
}

addPropertyControls(SpotlightAccordion, {
    items: {
        type: ControlType.Array,
        title: "Items",
        maxCount: 20,
        defaultValue: defaultItems,
        description: "Questions and answers displayed in the accordion.",
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, title: "Question", defaultValue: "Question" },
                answer: { type: ControlType.String, title: "Answer", defaultValue: "Answer", displayTextArea: true },
            },
        },
    },
    backgroundColor: { type: ControlType.Color, title: "Background", description: "Background color behind the entire accordion." },
    textColor: { type: ControlType.Color, title: "Text", description: "Color of the accordion questions." },
    secondaryColor: { type: ControlType.Color, title: "Answer", description: "Color of the expanded answer text." },
    borderColor: { type: ControlType.Color, title: "Border", description: "Color used around each accordion row." },
    borderRadius: { type: ControlType.Number, title: "Radius", min: 0, max: 100, step: 1, unit: "px", description: "Corner radius of each accordion row." },
    borderWidth: { type: ControlType.Number, title: "Border Width", min: 0, max: 5, step: 0.5, unit: "px", description: "Thickness of each row border." },
    rowGap: { type: ControlType.Number, title: "Row Gap", min: 0, max: 80, step: 1, unit: "px", description: "Space between accordion rows." },
    padding: { type: ControlType.Number, title: "Padding", min: 8, max: 60, step: 1, unit: "px", description: "Internal spacing inside each accordion row." },
    questionSize: { type: ControlType.Number, title: "Question Size", min: 8, max: 64, step: 1, unit: "px", description: "Font size of the question text." },
    answerSize: { type: ControlType.Number, title: "Answer Size", min: 8, max: 40, step: 1, unit: "px", description: "Font size of the answer text." },
    questionWeight: { type: ControlType.Number, title: "Question Weight", min: 100, max: 900, step: 100, description: "Font weight used for questions." },
    answerLineHeight: { type: ControlType.Number, title: "Answer Line Height", min: 1, max: 2.5, step: 0.05, description: "Line height of the answer text." },
    spotlightSize: { type: ControlType.Number, title: "Spotlight Size", min: 80, max: 700, step: 10, unit: "px", description: "Diameter of the cursor-following spotlight." },
    spotlightIntensity: { type: ControlType.Number, title: "Spotlight Intensity", min: 0, max: 2, step: 0.05, description: "Brightness of the cursor spotlight." },
    spotlightBlur: { type: ControlType.Number, title: "Spotlight Blur", min: 0, max: 40, step: 1, unit: "px", description: "Softens the spotlight edge." },
    spotlightColor: { type: ControlType.Color, title: "Spotlight Color", description: "Color of the cursor spotlight." },
    glowColor: { type: ControlType.Color, title: "Glow Color", description: "Color of the ambient cursor glow." },
    glowIntensity: { type: ControlType.Number, title: "Glow Intensity", min: 0, max: 0.5, step: 0.01, description: "Strength of the ambient glow." },
    dimOpacity: { type: ControlType.Number, title: "Dim Opacity", min: 0, max: 0.9, step: 0.01, description: "How strongly rows outside the spotlight are dimmed." },
    hoverScale: { type: ControlType.Number, title: "Hover Scale", min: 1, max: 1.08, step: 0.001, description: "Horizontal scale applied to the focused row." },
    activeScale: { type: ControlType.Number, title: "Active Scale", min: 1, max: 1.1, step: 0.001, description: "Vertical scale applied to the row under the spotlight." },
    openWidth: { type: ControlType.Number, title: "Open Width", min: 0, max: 100, step: 1, unit: "px", description: "Additional visual width given to an open row without changing layout width." },
    animationDuration: { type: ControlType.Number, title: "Animation", min: 0.05, max: 1.5, step: 0.05, unit: "s", description: "Duration of accordion expansion, scaling, opacity, and icon animations." },
    openMode: { type: ControlType.Enum, title: "Open Mode", options: ["single", "multiple"], optionTitles: ["Single", "Multiple"], description: "Choose whether one or multiple answers can remain open." },
    cursorEnabled: { type: ControlType.Boolean, title: "Cursor Spotlight", defaultValue: true, description: "Enables the cursor-following spotlight on pointer devices." },
    clickToOpen: { type: ControlType.Boolean, title: "Click to Open", defaultValue: true, description: "Allows clicking a question to open or close its answer." },
    showNumber: { type: ControlType.Boolean, title: "Show Numbers", defaultValue: true, description: "Displays the numbered index beside each question." },
    numberColor: { type: ControlType.Color, title: "Number Color", description: "Color of the question numbers." },
    numberSize: { type: ControlType.Number, title: "Number Size", min: 8, max: 32, step: 1, unit: "px", description: "Font size of the question numbers." },
    plusColor: { type: ControlType.Color, title: "Icon Color", description: "Color of the plus and minus icon." },
    plusSize: { type: ControlType.Number, title: "Icon Size", min: 8, max: 40, step: 1, unit: "px", description: "Size of the plus and minus icon." },
})