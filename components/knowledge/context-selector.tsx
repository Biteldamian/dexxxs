"use client";

import { KnowledgeItem } from "@/app/knowledge/page";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface ContextSelectorProps {
  items: KnowledgeItem[];
  selectedItems: string[];
  onSelectItems: (itemIds: string[]) => void;
}

export function ContextSelector({
  items,
  selectedItems,
  onSelectItems,
}: ContextSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm font-medium">Context Documents:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedItems.length
              ? `${selectedItems.length} documents selected`
              : "Select documents..."}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search documents..." />
            <CommandEmpty>No documents found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    const newSelection = selectedItems.includes(item.id)
                      ? selectedItems.filter((id) => id !== item.id)
                      : [...selectedItems, item.id];
                    onSelectItems(newSelection);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selectedItems.includes(item.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}