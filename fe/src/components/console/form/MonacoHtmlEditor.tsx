"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// Dynamic import for Monaco Editor (~500KB bundle reduction)
const Editor = dynamic(() => import("@monaco-editor/react").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="flex h-[500px] items-center justify-center bg-gray-50">에디터 로딩중...</div>,
});

interface MonacoHtmlEditorProps {
    value: string;
    onChange: (content: string) => void;
    className?: string;
}

export default function MonacoHtmlEditor({ value, onChange, className }: MonacoHtmlEditorProps) {
    const [isPreview, setIsPreview] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Memoize onChange handler
    const handleEditorChange = useCallback(
        (val: string | undefined) => {
            onChange(val || "");
        },
        [onChange],
    );

    // iframe에 HTML 미리보기
    useEffect(() => {
        if (isPreview && iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html lang="ko">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <!-- Tailwind CSS CDN (미리보기용) -->
                            <script src="https://cdn.tailwindcss.com"></script>
                        </head>
                        <body class="antialiased">
                            <div id="preview-content" class="min-h-screen">
                                ${value}
                            </div>
                        </body>
                    </html>
                `);
                iframeDoc.close();
            }
        }
    }, [isPreview, value]);

    return (
        <div className={`overflow-hidden rounded-[5px] border border-[#D9D9D9] bg-white ${className || ""}`}>
            <div className="flex items-center justify-between border-b border-[#D9D9D9] bg-white p-2">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`rounded px-3 py-1 ${
                            !isPreview ? "bg-[#104893] text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        📝 코드
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`rounded px-3 py-1 ${
                            isPreview ? "bg-[#104893] text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        👁️ 미리보기
                    </button>
                </div>
                <div className="text-[12px] text-gray-500">
                    {isPreview ? "HTML 미리보기 (Tailwind CSS 적용됨)" : "HTML 코드 편집 (Tailwind 클래스 사용 가능)"}
                </div>
            </div>
            <div className="relative">
                {!isPreview ? (
                    <Editor
                        height="500px"
                        defaultLanguage="html"
                        value={value}
                        onChange={handleEditorChange}
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
                        }}
                    />
                ) : (
                    <iframe
                        ref={iframeRef}
                        className="h-[500px] w-full border-0"
                        title="HTML Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                )}
            </div>
        </div>
    );
}
