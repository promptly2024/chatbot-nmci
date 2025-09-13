import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import type { ReactNode, HTMLAttributes, LiHTMLAttributes, AnchorHTMLAttributes, ImgHTMLAttributes } from "react";

type MarkdownRendererProps = {
    content: string;
    className?: string;
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    const components = {
        // Enhanced table styling
        table: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableElement>) => (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm" {...props}>
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => (
            <thead className="bg-gray-50" {...props}>
                {children}
            </thead>
        ),
        tbody: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => (
            <tbody className="divide-y divide-gray-200" {...props}>
                {children}
            </tbody>
        ),
        th: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableCellElement>) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300" {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableCellElement>) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200" {...props}>
                {children}
            </td>
        ),

        // Enhanced list styling
        ul: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLUListElement>) => (
            <ul className="space-y-2 my-4 ml-6 list-none" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLOListElement>) => (
            <ol className="space-y-2 my-4 ml-6 list-decimal" {...props}>
                {children}
            </ol>
        ),
        li: ({ children, ordered, ...props }: { children?: ReactNode; ordered?: boolean } & LiHTMLAttributes<HTMLLIElement>) => (
            <li
                className={`relative flex items-start ${ordered
                    ? "" // Use browser default for ordered lists
                    : "before:content-['•'] before:text-blue-600 before:font-bold before:mr-3 before:text-lg before:leading-5"
                    }`}
                {...props}
            >
                <div className="flex-1">{children}</div>
            </li>
        ),

        // Enhanced headings
        h1: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3 pb-1 border-b border-gray-200" {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3" {...props}>
                {children}
            </h3>
        ),
        h4: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
            <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2" {...props}>
                {children}
            </h4>
        ),

        // Enhanced code blocks
        code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLElement>) => {
            if (inline) {
                return (
                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                        {children}
                    </code>
                );
            }
            return (
                <div className="relative my-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code className="font-mono text-sm" {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
            );
        },

        // Enhanced blockquotes
        blockquote: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLElement>) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700" {...props}>
                {children}
            </blockquote>
        ),

        // Enhanced paragraphs
        p: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLParagraphElement>) => (
            <p className="text-gray-700 leading-relaxed my-3" {...props}>
                {children}
            </p>
        ),

        // Enhanced links
        a: ({ children, href, ...props }: { children?: ReactNode; href?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        ),

        // Enhanced horizontal rule
        hr: ({ ...props }: HTMLAttributes<HTMLHRElement>) => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" {...props} />
        ),

        // Enhanced images
        img: ({
            src,
            alt,
            ...props
        }: React.ImgHTMLAttributes<HTMLImageElement>) => (
            <div className="my-6">
                <img
                    src={typeof src === "string" ? src : undefined}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                    {...props}
                />
                {alt && <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>}
            </div>
        ),
    };

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}