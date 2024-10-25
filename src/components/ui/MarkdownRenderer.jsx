import Markdown from 'react-markdown'

const MarkdownRenderer = ({ children }) => {
  // Custom components for Markdown elements with Tailwind styles
  const components = {
    // Headings
    h1: ({ node, ...props }) => <h1 {...props} className="text-4xl font-bold mt-6 mb-4" />,
    h2: ({ node, ...props }) => <h2 {...props} className="text-3xl font-bold mt-5 mb-3" />,
    h3: ({ node, ...props }) => <h3 {...props} className="text-2xl font-bold mt-4 mb-2" />,
    h4: ({ node, ...props }) => <h4 {...props} className="text-xl font-bold mt-3 mb-2" />,
    h5: ({ node, ...props }) => <h5 {...props} className="text-lg font-bold mt-2 mb-1" />,
    h6: ({ node, ...props }) => <h6 {...props} className="text-base font-bold mt-2 mb-1" />,

    // Paragraphs and text
    p: ({ node, ...props }) => <p {...props} className="my-4 leading-relaxed" />,
    strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
    em: ({ node, ...props }) => <em {...props} className="italic" />,

    // Lists
    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside my-4 space-y-2" />,
    ol: ({ node, ...props }) => (
      <ol {...props} className="list-decimal list-inside my-4 space-y-2" />
    ),
    li: ({ node, ...props }) => <li {...props} className="ml-4" />,

    // Links and images
    a: ({ node, ...props }) => (
      <a {...props} className="text-blue-600 hover:text-blue-800 underline" />
    ),
    img: ({ node, ...props }) => <img {...props} className="max-w-full h-auto my-4 rounded-lg" />,

    // Blockquotes and code
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} className="border-l-4 border-gray-200 pl-4 my-4 italic" />
    ),
    code: ({ node, inline, ...props }) =>
      inline ? (
        <code {...props} className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" />
      ) : (
        <code
          {...props}
          className="block bg-gray-100 rounded p-4 my-4 font-mono text-sm overflow-x-auto"
        />
      ),
    pre: ({ node, ...props }) => (
      <pre {...props} className="bg-gray-100 rounded p-4 my-4 overflow-x-auto" />
    ),

    // Horizontal rule and line breaks
    hr: ({ node, ...props }) => <hr {...props} className="my-8 border-t border-gray-200" />,
    br: ({ node, ...props }) => <br {...props} className="my-4" />,

    // Tables
    table: ({ node, ...props }) => <table {...props} className="min-w-full border-collapse my-4" />,
    thead: ({ node, ...props }) => <thead {...props} className="bg-gray-50" />,
    tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-gray-200" />,
    tr: ({ node, ...props }) => <tr {...props} className="hover:bg-gray-50" />,
    td: ({ node, ...props }) => <td {...props} className="px-4 py-2 border border-gray-200" />,
    th: ({ node, ...props }) => (
      <th {...props} className="px-4 py-2 border border-gray-200 font-bold bg-gray-50" />
    ),
  }

  return (
    <div className="prose prose-gray max-w-none">
      <Markdown components={components}>{children}</Markdown>
    </div>
  )
}

export default MarkdownRenderer
