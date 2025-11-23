"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Import Tema Gelap & Terang
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface CodeViewerProps {
  content: string;
}

export function CodeViewer({ content }: CodeViewerProps) {
  const { resolvedTheme } = useTheme(); // Deteksi tema (dark/light)
  const [mounted, setMounted] = useState(false);

  // Hydration fix: Tunggu sampai mounted agar tema terbaca benar
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tentukan style berdasarkan tema
  // Jika belum mounted (server render), default ke dark agar aman
  const isDark = !mounted || resolvedTheme === "dark";
  const codeStyle = isDark ? vscDarkPlus : prism;
  const bgColor = isDark ? "#0f172a" : "#f8fafc"; // Slate-950 vs Slate-50

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isCopied, setIsCopied] = useState(false);

      const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        toast.success("Kode disalin");
        setTimeout(() => setIsCopied(false), 2000);
      };

      if (inline) {
        return (
          <code
            className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <div className="relative group my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2 uppercase">
              {match ? match[1] : "TEXT"}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={handleCopy}
              title="Salin Kode"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {/* Syntax Highlighter Dinamis */}
          <SyntaxHighlighter
            style={codeStyle} // Tema berubah sesuai mode
            language={match ? match[1] : "text"}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              backgroundColor: bgColor, // Background berubah sesuai mode
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
            wrapLongLines={true}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    },

    h1: ({ node, ...props }: any) => (
      <h1
        className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white transition-colors"
        {...props}
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2
        className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 transition-colors"
        {...props}
      />
    ),
    p: ({ node, ...props }: any) => (
      <div
        className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300 transition-colors"
        {...props}
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul
        className="list-disc list-inside mb-4 space-y-1 text-slate-700 dark:text-slate-300"
        {...props}
      />
    ),
    li: ({ node, ...props }: any) => (
      <li className="marker:text-indigo-500" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-indigo-500 pl-4 italic my-4 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-r text-slate-600 dark:text-slate-400 transition-colors"
        {...props}
      />
    ),
  };

  if (!mounted) return null; // Mencegah hydration mismatch saat loading

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none transition-colors duration-300">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
