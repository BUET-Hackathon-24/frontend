import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export const Markdown = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ node, children, ...props }) => {
          return (
            <Link
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noreferrer"
              {...props}
            >
              {children}
            </Link>
          )
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={oneLight}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        ol: ({ node, children, ...props }) => {
          return (
            <ol className="list-decimal list-outside ml-4" {...props}>
              {children}
            </ol>
          )
        },
        li: ({ node, children, ...props }) => {
          return (
            <li className="py-1" {...props}>
              {children}
            </li>
          )
        },
        ul: ({ node, children, ...props }) => {
          return (
            <ul className="list-decimal list-outside ml-4" {...props}>
              {children}
            </ul>
          )
        },
        strong: ({ node, children, ...props }) => {
          return (
            <span className="font-semibold" {...props}>
              {children}
            </span>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
