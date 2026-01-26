"use client";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
    children,
    className = "",
    containerClassName = "",
    colors,
    waveWidth,
    backgroundFill,
    blur = 10,
    speed = "fast",
    waveOpacity = 0.5,
    ...props
}) => {
    const noise = createNoise3D();
    const canvasRef = useRef(null);
    const animationIdRef = useRef(null);

    const getSpeed = () => {
        switch (speed) {
            case "slow":
                return 0.001;
            case "fast":
                return 0.002;
            default:
                return 0.001;
        }
    };

    const waveColors = colors ?? [
        "#38bdf8",
        "#818cf8",
        "#c084fc",
        "#e879f9",
        "#22d3ee",
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w, h, nt;

        const init = () => {
            w = ctx.canvas.width = window.innerWidth;
            h = ctx.canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
            nt = 0;
        };

        const drawWave = (n) => {
            nt += getSpeed();
            for (let i = 0; i < n; i++) {
                ctx.beginPath();
                ctx.lineWidth = waveWidth || 50;
                ctx.strokeStyle = waveColors[i % waveColors.length];
                for (let x = 0; x < w; x += 5) {
                    const y = noise(x / 800, 0.3 * i, nt) * 100;
                    ctx.lineTo(x, y + h * 0.5);
                }
                ctx.stroke();
                ctx.closePath();
            }
        };

        const render = () => {
            ctx.fillStyle = backgroundFill || "#000000";
            ctx.globalAlpha = waveOpacity;
            ctx.fillRect(0, 0, w, h);
            drawWave(5);
            animationIdRef.current = requestAnimationFrame(render);
        };

        init();
        render();

        const handleResize = () => {
            init();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, [blur, waveColors, waveWidth, backgroundFill, waveOpacity, speed]);

    return (
        <div
            className={`wavy-background-container ${containerClassName}`}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                overflow: "hidden",
            }}
            {...props}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
            <div
                className={className}
                style={{
                    position: "relative",
                    zIndex: 10,
                }}
            >
                {children}
            </div>
        </div>
    );
};
