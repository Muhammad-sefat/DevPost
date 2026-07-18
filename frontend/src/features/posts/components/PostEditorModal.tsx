"use client"

import * as React from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { closePostEditor } from "@/store/slices/uiSlice"
import { useToast } from "@/components/ui/toast"
import { MOCK_POST_IDEAS } from "../data/mock-posts"
import { AIRefinementChat } from "./AIRefinementChat"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Copy, Check } from "lucide-react"

export function PostEditorModal() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { postEditorOpen, selectedPostId } = useSelector((state: RootState) => state.ui)
  
  // Find current post text
  const currentPost = MOCK_POST_IDEAS.find((p) => p.id === selectedPostId)

  const [text, setText] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const [newTag, setNewTag] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (currentPost) {
      setText(currentPost.text)
      setTags(currentPost.tags)
    }
  }, [currentPost, postEditorOpen])

  if (!postEditorOpen || !currentPost) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({ title: "Copied!", description: "Post content copied to clipboard.", type: "success" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: "Failed to copy", description: "Could not write to clipboard", type: "error" })
    }
  }

  const handlePostComplete = () => {
    toast({ title: "Posted! Great work 🎉", description: "Successfully updated post status.", type: "success" })
    dispatch(closePostEditor())
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const charLimit = 3000
  const charCount = text.length

  return (
    <Dialog open={postEditorOpen} onOpenChange={() => dispatch(closePostEditor())}>
      <DialogContent className="max-w-4xl w-[95vw] bg-bg-surface border-border p-0 overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[600px]">
        {/* Left Side: Editor (60%) */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-text-primary">Edit your post</h3>
              <p className="text-[10px] text-text-secondary">Review generated draft and adjust parameters</p>
            </div>
            <button
              onClick={() => dispatch(closePostEditor())}
              className="p-1.5 hover:bg-bg-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors border-0 bg-transparent cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              className="w-full flex-1 min-h-[250px] md:min-h-[280px] bg-bg-input border border-border rounded-xl p-4 text-xs text-text-primary leading-relaxed resize-none focus:outline-none focus:border-brand"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Post content..."
            />
            {/* Character Counter */}
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${
                charCount > charLimit
                  ? "text-danger font-bold"
                  : charCount > charLimit - 200
                  ? "text-warning font-semibold"
                  : "text-text-muted"
              }`}>
                {charCount} / {charLimit}
              </span>
            </div>
          </div>

          {/* Editable Tags */}
          <div className="mt-4 space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Post Tags</label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-bg-elevated text-text-secondary border-border rounded text-[10px] flex items-center gap-1 py-0.5 px-2"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-danger text-[9px] font-mono ml-0.5 bg-transparent border-0 p-0 cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {/* Add tag form input */}
              <form onSubmit={handleAddTag} className="inline-block">
                <input
                  type="text"
                  placeholder="+ Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="bg-bg-input border border-dashed border-border rounded px-2 py-0.5 text-[10px] text-text-secondary focus:outline-none w-20"
                />
              </form>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-10 px-4 rounded-lg flex items-center gap-2"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy to clipboard</span>
            </Button>
            <Button
              onClick={handlePostComplete}
              className="bg-success text-text-inverse hover:bg-success-muted text-xs font-semibold h-10 px-4 rounded-lg"
            >
              ✅ I Posted It
            </Button>
          </div>
        </div>

        {/* Right Side: AI Refinement (40%) */}
        <AIRefinementChat />
      </DialogContent>
    </Dialog>
  )
}
