'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

type Shape =
  | {
      type: 'rectangle';
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
    }
  | {
      type: 'circle';
      x: number;
      y: number;
      radius: number;
      color?: string;
    }
  | {
      type: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color?: string;
    };

const CanvasBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [mode, setMode] = useState<'rectangle' | 'circle' | 'line'>(
    'rectangle'
  );

  const [position, setPosition] = useState({x:window.innerWidth / 2, y: window.innerHeight / 2})

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setCurrentPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPoint({ x, y });
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!startPoint || !currentPoint) return;

    let newShape: Shape;

    if (mode === 'rectangle') {
      newShape = {
        type: 'rectangle',
        x: startPoint.x,
        y: startPoint.y,
        width: currentPoint.x - startPoint.x,
        height: currentPoint.y - startPoint.y,
        color: 'yellow',
      };
    } else if (mode === 'circle') {
      newShape = {
        type: 'circle',
        x: startPoint.x,
        y: startPoint.y,
        radius: Math.sqrt(
          Math.pow(currentPoint.x - startPoint.x, 2) +
            Math.pow(currentPoint.y - startPoint.y, 2)
        ),
      };
    } else if (mode === 'line') {
      newShape = {
        type: 'line',
        x1: startPoint.x,
        y1: startPoint.y,
        x2: currentPoint.x,
        y2: currentPoint.y,
        color: 'blue',
      };
    }

    setShapes((prev) => [...prev, newShape]);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color || 'red';
      if (shape.type === 'rectangle') {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      }
    });

    if (isDrawing && startPoint && currentPoint) {
      ctx.strokeStyle = 'gray';

      if (mode === 'rectangle') {
        const width = currentPoint.x - startPoint.x;
        const height = currentPoint.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      } else if (mode === 'circle') {
        const dx = currentPoint.x - startPoint.x;
        const dy = currentPoint.y - startPoint.y;
        const radius = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (mode === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
    }
  }, [isDrawing, startPoint, currentPoint]);

  return (
    <div>
      <div className="border-2 flex gap-4">
        <Button 
         onClick={() => setMode('rectangle')}>Rectangle</Button>
        <Button onClick={() => setMode('circle')}>Circle</Button>
        <Button onClick={() => setMode('line')}>line</Button>
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        className="border"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default CanvasBoard;
