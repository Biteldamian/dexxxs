"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, onFileUpload, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border-t bg-background">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="min-h-[60px] resize-none"
          disabled={disabled}
        />
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            className="px-8"
            disabled={!input.trim() || disabled}
          >
            Send
          </Button>
          {onFileUpload && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="size-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}