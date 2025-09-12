import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
    content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[]} >
                {content}
            </ReactMarkdown>
        </div>
    );
}
