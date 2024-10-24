// First install the required packages:
// npm install react-markdown remark-gfm rehype-prism-plus

import ReactMarkdown from 'react-markdown'
import rehypePrismPlus from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'

const MarkdownWithCode = () => {
  const markdown = `
# Example Code

Here's some JavaScript code:

\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}

// Example usage
const result = calculateSum(5, 3);
console.log(result); // 8
\`\`\`

And here's some Python:

\`\`\`python
def calculate_sum(a, b):
    return a + b

# Example usage
result = calculate_sum(5, 3)
print(result)  # 8
\`\`\`
`

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <ReactMarkdown
        className="prose prose-slate dark:prose-invert max-w-none"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrismPlus]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownWithCode
