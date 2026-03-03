"use client";

import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";

// Dynamic import for Monaco Editor (~500KB bundle reduction)
const Editor = dynamic(() => import("@monaco-editor/react").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="flex h-[500px] items-center justify-center bg-gray-50">에디터 로딩중...</div>,
});

interface MonacoHtmlEditorProps {
    value: string;
    onChange: (content: string) => void;
    className?: string;
    height?: string;
    readOnly?: boolean;
}

export default function MonacoHtmlEditor({ value, onChange, className, height = "500px", readOnly = false }: MonacoHtmlEditorProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // Memoize onChange handler
    const handleEditorChange = useCallback(
        (val: string | undefined) => {
            onChange(val || "");
        },
        [onChange],
    );

    const handleEditorMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
        editorRef.current = editorInstance;
        // 에디터 레이아웃 강제 업데이트
        setTimeout(() => {
            editorInstance.layout();
            editorInstance.focus();
        }, 100);
    }, []);

    return (
        <div className={`overflow-hidden rounded-[5px] border border-[#D9D9D9] bg-white ${className || ""}`}>
            <div className="relative">
                <Editor
                    height={height}
                    defaultLanguage="html"
                    value={value}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    theme="vs"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        automaticLayout: true,
                        formatOnPaste: true,
                        formatOnType: true,
                        readOnly: readOnly,
                    }}
                />
            </div>
        </div>
    );
}
