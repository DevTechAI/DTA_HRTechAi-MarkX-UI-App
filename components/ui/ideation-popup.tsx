"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IdeationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IdeationPopup({ isOpen, onClose }: IdeationPopupProps) {
  const [ideas, setIdeas] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load ideas from localStorage on mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem("markx-ideas");
    if (savedIdeas) {
      setIdeas(savedIdeas);
    }
  }, []);

  // Auto-save to localStorage whenever ideas change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("markx-ideas", ideas);
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [ideas]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Focus textarea after animation
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Popup Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Quick Ideas</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="text-sm text-muted-foreground mb-3">
            Jot down your ideas quickly. Everything is auto-saved locally.
          </div>
          <Textarea
            ref={textareaRef}
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
            placeholder="Start typing your ideas here..."
            className="flex-1 resize-none border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          Auto-saved • {ideas.length} characters
        </div>
      </div>
    </>
  );
}

export function IdeationFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group hover:scale-110"
        title="Quick Ideas"
      >
        <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Popup */}
      <IdeationPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
