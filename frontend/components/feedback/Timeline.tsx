import React from "react"
import { cn } from "@/lib/utils"

export interface TimelineEvent {
  id: string
  title: string
  description: string
  time: string
  type: 'Meeting' | 'Email' | 'Call' | 'Stage' | 'Note'
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

export function Timeline({ events, className }: TimelineProps) {
  const getBadgeColors = (type: TimelineEvent['type']) => {
    switch (type) {
      case "Meeting":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Email":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Call":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Stage":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className={cn("flow-root", className)}>
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border/40"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-background border text-xs font-semibold uppercase",
                      getBadgeColors(event.type)
                    )}
                  >
                    {event.type[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {event.title}{" "}
                      <span className="font-normal text-muted-foreground">
                        {event.description}
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-muted-foreground">
                    <time dateTime={event.time}>{event.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
