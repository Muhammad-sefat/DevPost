"use client"

import * as React from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
}

export function AIRefinementChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "m1",
      sender: "user",
      text: "Can you make it sound a bit more casual and developer-friendly?"
    },
    {
      id: "m2",
      sender: "ai",
      text: "Sure! I adjusted the tone. Here is the revised draft:\n\n\"Spent 4 hours wrestling with TS generic constraints today. Spoiler: forgot a single 'extends'. Conditional types are brilliant but they sure know how to humble you...\""
    },
    {
      id: "m3",
      sender: "user",
      text: "Perfect. Add a strong hook to the top of the post."
    },
    {
      id: "m4",
      sender: "ai",
      text: "Updated with a hook:\n\n\"6 hours of coding, 0 features shipped, but I deleted 200 lines of code. That's a massive win. Here's why refactoring generic type parameters pays off...\""
    }
  ])

  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: input
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate typing and static response
    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: "I've refined the draft based on your instructions! Copy the text on the left to review the updated layout."
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 1500)
  }

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-[400px] md:h-full justify-between bg-bg-surface/50 border-l border-border md:w-[320px] shrink-0 font-body">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand animate-pulse" />
        <div>
          <h4 className="text-xs font-semibold text-text-primary">Refine with AI</h4>
          <p className="text-[10px] text-text-secondary mt-0.5">Iterate on tone and phrasing</p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[90%] text-[11px] leading-relaxed whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-brand text-text-inverse rounded-br-none"
                  : "bg-bg-elevated border border-border text-text-primary rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-xl bg-bg-elevated border border-border text-[10px] text-text-secondary w-fit rounded-bl-none">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-border bg-bg-surface/80">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Ask AI to refine..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-bg-input border-border text-text-primary text-xs h-9 rounded-lg"
          />
          <Button type="submit" size="icon" className="bg-brand text-text-inverse hover:bg-brand-hover h-9 w-9 rounded-lg shrink-0">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        <p className="text-[9px] text-text-muted mt-2 text-center">
          AI remembers your style to avoid duplicates
        </p>
      </div>
    </div>
  )
}
