"use client";

import { Loader2 } from "lucide-react";

interface SearchStatusProps {
  isSearching: boolean;
}

export function SearchStatus({ isSearching }: SearchStatusProps) {
  if (!isSearching) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Searching and analyzing...
    </div>
  );
}