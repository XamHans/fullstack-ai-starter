"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PixelatedCanvasProps {
  src: string;
  width: number;
  height: number;
  cellSize?: number;
  dotScale?: number;
  shape?: "circle" | "square";
  backgroundColor?: string;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "push" | "swirl";
  followSpeed?: number;
  jitterStrength?: number;
  jitterSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  className?: string;
}

export const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({
  src,
  width,
  height,
  cellSize = 4,
  dotScale = 1,
  shape = "circle",
  backgroundColor = "#000000",
  dropoutStrength = 0,
  interactive = false,
  distortionStrength = 0,
  distortionRadius = 50,
  distortionMode = "push",
  followSpeed = 0.1,
  jitterStrength = 0,
  jitterSpeed = 1,
  sampleAverage = false,
  tintColor = "#FFFFFF",
  tintStrength = 0,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    if (!img || !isLoaded) return;

    const pixelate = () => {
      canvas.width = width;
      canvas.height = height;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Create off-screen canvas for image processing
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCanvas.width = Math.ceil(width / cellSize);
      tempCanvas.height = Math.ceil(height / cellSize);

      // Draw scaled down image
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw pixelated version
      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const index = (y * tempCanvas.width + x) * 4;
          let r = imageData.data[index];
          let g = imageData.data[index + 1];
          let b = imageData.data[index + 2];
          const a = imageData.data[index + 3] / 255;

          // Apply tint
          if (tintStrength > 0) {
            const tintR = parseInt(tintColor.slice(1, 3), 16);
            const tintG = parseInt(tintColor.slice(3, 5), 16);
            const tintB = parseInt(tintColor.slice(5, 7), 16);

            r = Math.round(r * (1 - tintStrength) + tintR * tintStrength);
            g = Math.round(g * (1 - tintStrength) + tintG * tintStrength);
            b = Math.round(b * (1 - tintStrength) + tintB * tintStrength);
          }

          // Apply dropout
          if (dropoutStrength > 0 && Math.random() < dropoutStrength) {
            continue;
          }

          const pixelX = x * cellSize + cellSize / 2;
          const pixelY = y * cellSize + cellSize / 2;

          let finalX = pixelX;
          let finalY = pixelY;

          // Apply jitter
          if (jitterStrength > 0) {
            const jitterTime = Date.now() * 0.001 * jitterSpeed;
            finalX += Math.sin(jitterTime + x * 0.5) * jitterStrength;
            finalY += Math.cos(jitterTime + y * 0.5) * jitterStrength;
          }

          // Apply interactive distortion
          if (interactive && distortionStrength > 0) {
            const dx = finalX - mouseRef.current.x;
            const dy = finalY - mouseRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < distortionRadius) {
              const force = (1 - distance / distortionRadius) * distortionStrength;

              if (distortionMode === "push") {
                finalX += (dx / distance) * force;
                finalY += (dy / distance) * force;
              } else if (distortionMode === "swirl") {
                const angle = Math.atan2(dy, dx) + force * 0.1;
                const newDistance = distance + force * 0.5;
                finalX = mouseRef.current.x + Math.cos(angle) * newDistance;
                finalY = mouseRef.current.y + Math.sin(angle) * newDistance;
              }
            }
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

          const size = cellSize * dotScale;

          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(finalX, finalY, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(finalX - size / 2, finalY - size / 2, size, size);
          }
        }
      }
    };

    pixelate();

    // Animation loop for interactive effects
    if (interactive || jitterStrength > 0) {
      const animate = () => {
        // Smooth mouse following
        if (interactive && followSpeed > 0) {
          mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * followSpeed;
          mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * followSpeed;
        }

        pixelate();
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [isLoaded, width, height, cellSize, dotScale, shape, backgroundColor, dropoutStrength,
      interactive, distortionStrength, distortionRadius, distortionMode, followSpeed,
      jitterStrength, jitterSpeed, tintColor, tintStrength]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    targetMouseRef.current.x = e.clientX - rect.left;
    targetMouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className={cn("relative", className)}>
      <img
        ref={imgRef}
        src={src}
        alt=""
        style={{ display: "none" }}
        onLoad={() => setIsLoaded(true)}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        className="max-w-full h-auto cursor-none"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};