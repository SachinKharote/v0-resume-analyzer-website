"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function ScoreGauge({ score, size = 180, strokeWidth = 12, label, className }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success stroke-success"
    if (s >= 60) return "text-warning stroke-warning"
    return "text-destructive stroke-destructive"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Fair"
    return "Needs Work"
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Resume score: ${score} out of 100`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-4xl font-bold", getScoreColor(score).split(" ")[0])}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">out of 100</span>
        </div>
      </div>
      {label ? (
        <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
      ) : (
        <p className={cn("mt-3 text-sm font-semibold", getScoreColor(score).split(" ")[0])}>
          {getScoreLabel(score)}
        </p>
      )}
    </div>
  )
}
