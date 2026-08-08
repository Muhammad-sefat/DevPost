"use client"

import * as React from "react"
import { useDispatch } from "react-redux"
import { openPostEditor } from "@/store/slices/uiSlice"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface PostIdeaCardProps {
  id: string
  text: string
  tags: string[]
}

export function PostIdeaCard({ id, text, tags }: PostIdeaCardProps) {
  const dispatch = useDispatch()

  // Truncate text to 3 lines preview
  const truncatedText = text.length > 150 ? text.substring(0, 150) + "..." : text

  return (
    <Card className="bg-bg-surface border-border hover:border-brand/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between rounded-xl p-5 group h-full">
      <CardContent className="p-0 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono text-[9px] bg-bg-elevated text-text-secondary border-border rounded px-2">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Text Preview */}
        <p className="text-xs text-text-primary leading-relaxed font-body">
          &ldquo;{truncatedText}&rdquo;
        </p>
      </CardContent>

      <CardFooter className="p-0 pt-4 flex justify-end">
        <button
          onClick={() => dispatch(openPostEditor(id))}
          className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 group/btn transition-colors bg-transparent border-0 p-0 cursor-pointer"
        >
          <span>Select this post</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </CardFooter>
    </Card>
  )
}
