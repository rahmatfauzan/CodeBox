"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data"; // Support banyak bahasa
import { vscodeDark } from "@uiw/codemirror-theme-vscode"; // Tema VS Code

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  return (
    <div className="">
      {/* Area Editor */}
      <CodeMirror
        value={value}
        height="400px"
        theme={vscodeDark} // Gunakan tema gelap ala VS Code
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }), // Support Markdown + Auto Syntax
        ]}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        className="text-base font-mono"
        basicSetup={{
          lineNumbers: true, // Tampilkan nomor baris
          highlightActiveLine: true, // Highlight baris aktif
          foldGutter: true, // Bisa lipat kode
          tabSize: 2, // Tab = 2 spasi
        }}
      />
    </div>
  );
}
