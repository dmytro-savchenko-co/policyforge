"use client";

import { useRef, useCallback } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, List, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyEditorProps {
  html: string;
  onChange: (html: string) => void;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export function PolicyEditor({ html, onChange }: PolicyEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInsertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  }, [execCommand]);

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: "Bold",
      action: () => execCommand("bold"),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: "Italic",
      action: () => execCommand("italic"),
    },
    {
      icon: <Heading1 className="w-4 h-4" />,
      label: "Heading 1",
      action: () => execCommand("formatBlock", "h1"),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: "Heading 2",
      action: () => execCommand("formatBlock", "h2"),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      label: "Heading 3",
      action: () => execCommand("formatBlock", "h3"),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: "Bullet List",
      action: () => execCommand("insertUnorderedList"),
    },
    {
      icon: <Link className="w-4 h-4" />,
      label: "Insert Link",
      action: handleInsertLink,
    },
  ];

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-gray-50">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            title={btn.label}
            className={cn(
              "p-2 rounded-lg text-muted hover:text-foreground hover:bg-white transition-colors",
            )}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: html }}
        className="min-h-[500px] p-6 sm:p-8 outline-none prose prose-sm max-w-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-3
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-8
          [&_h3]:text-base [&_h3]:font-semibold
          [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:list-decimal [&_ol]:pl-6
          [&_li]:mb-2
          [&_a]:text-primary [&_a]:underline
          [&_p]:my-3
          focus:ring-2 focus:ring-primary/20 focus:ring-inset"
      />
    </div>
  );
}
