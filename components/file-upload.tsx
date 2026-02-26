"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  file: File | null
  accept?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  file,
  accept = ".pdf,.docx,.doc,.txt",
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect, disabled]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) {
        onFileSelect(selected)
      }
    },
    [onFileSelect]
  )

  if (file) {
    return (
      <div className={cn("glass-panel flex items-center justify-between rounded-xl px-6 py-5", className)}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        {onFileRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onFileRemove}
            aria-label="Remove file"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <label
      className={cn(
        "glass-panel flex cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-16 transition-all",
        isDragging && "border-primary/50 bg-primary/5",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Upload className="h-8 w-8" />
      </div>
      <p className="mt-4 text-lg font-medium text-foreground">
        Drag and drop your resume here
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        or click to browse (PDF, DOCX, TXT)
      </p>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="Upload resume file"
      />
    </label>
  )
}
