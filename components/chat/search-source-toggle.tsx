"use client";

import { SearchEngine, SearchSource } from "@/app/page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Globe, Library, Settings } from "lucide-react";

interface SearchSourceToggleProps {
  source: SearchSource;
  onChange: (source: SearchSource) => void;
  engine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

export function SearchSourceToggle({
  source,
  onChange,
  engine,
  onEngineChange,
}: SearchSourceToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border bg-background p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("web")}
          className={cn(
            "gap-2",
            source === "web" && "bg-secondary"
          )}
        >
          <Globe className="size-4" />
          Web
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("knowledge")}
          className={cn(
            "gap-2",
            source === "knowledge" && "bg-secondary"
          )}
        >
          <Library className="size-4" />
          Knowledge Base
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("both")}
          className={cn(
            "gap-2",
            source === "both" && "bg-secondary"
          )}
        >
          <Globe className="size-4" />
          <Library className="size-4" />
          Both
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEngineChange("serpapi")}>
            SerpAPI {engine === "serpapi" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEngineChange("serper")}>
            Serper {engine === "serper" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEngineChange("searchapi")}>
            SearchAPI {engine === "searchapi" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}