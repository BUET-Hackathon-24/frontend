import { useCallback, useRef, useState } from 'react'

// Dummy responses with markdown support and varying content types
const dummyResponses = [
  {
    content:
      "Hello! I'm here to help you. Here are some things I can do:\n\n- Answer questions\n- Help with code\n- Explain concepts\n- Analyze data",
    attachments: [],
  },
  {
    content:
      "Let me break this down step by step:\n\n1. First, we need to understand the basics\n2. Then, we can explore the details\n3. Finally, we'll put it all together\n\n```js\nconsole.log('Example code');\n```",
    attachments: [
      {
        type: 'image',
        url: '/api/placeholder/400/300',
        name: 'example-diagram.png',
      },
    ],
  },
  {
    content:
      "That's an interesting question! Here's what I found:\n\n> Important information that you should consider\n\nDoes this help explain what you were looking for?",
    attachments: [],
  },
  {
    content:
      "Here's a simple example to demonstrate:\n\n```python\ndef example():\n    return 'Hello, World!'\n```\n\nYou can modify this code based on your needs.",
    attachments: [],
  },
]

// Simulate network delay
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

// Helper to get a context-aware response
const getDummyResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      content:
        '👋 Hello! How can I assist you today?\n\nI can help you with:\n- Writing code\n- Explaining concepts\n- Analyzing data\n- And much more!',
      attachments: [],
    }
  }

  if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
    return {
      content:
        "Here's an example code snippet that might help:\n\n```javascript\nconst example = () => {\n  // Your code here\n  return 'Hello, World!';\n};\n```\n\nWould you like me to explain how this works?",
      attachments: [],
    }
  }

  if (lowerMessage.includes('image') || lowerMessage.includes('picture')) {
    return {
      content: "I've generated a sample image for you. Let me know if you'd like any adjustments.",
      attachments: [
        {
          type: 'image',
          url: '/api/placeholder/400/300',
          name: 'generated-image.png',
        },
      ],
    }
  }

  // Default to random response
  return dummyResponses[Math.floor(Math.random() * dummyResponses.length)]
}

export function useCustomChat({
  id,
  initialMessages = [],
  onFinish,
  apiEndpoint = '/api/chat',
  headers = {},
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef(null)

  const append = useCallback(async (message, options = {}) => {
    const newMessage = {
      id: crypto.randomUUID(),
      content: message,
      role: options.role || 'user',
      createdAt: new Date().toISOString(),
      experimental_attachments: options.attachments || [],
      toolInvocations: options.toolInvocations || [],
    }

    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }, [])

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault()
      if (!input.trim()) return

      setIsLoading(true)
      const userMessage = await append(input)
      setInput('')

      try {
        abortControllerRef.current = new AbortController()

        // Simulate API call structure but use dummy response
        await simulateDelay()
        const dummyResponse = getDummyResponse(input)

        await append(dummyResponse.content, {
          role: 'assistant',
          attachments: dummyResponse.attachments,
          toolInvocations: [],
        })

        if (onFinish) {
          onFinish(dummyResponse)
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request aborted')
        } else {
          console.error('Error in chat submission:', error)
          await append('I apologize, but I encountered an error. Could you please try again?', {
            role: 'assistant',
          })
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [input, append, onFinish]
  )

  const reload = useCallback(async () => {
    if (messages.length < 2) return
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMessage) return

    setIsLoading(true)
    setMessages(messages.slice(0, -1))

    try {
      await simulateDelay()
      const dummyResponse = getDummyResponse(lastUserMessage.content)

      await append(dummyResponse.content, {
        role: 'assistant',
        attachments: dummyResponse.attachments,
        toolInvocations: [],
      })
    } catch (error) {
      console.error('Error reloading chat:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, append])

  const clear = useCallback(() => {
    setMessages([])
    setInput('')
  }, [])

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    append,
    reload,
    clear,
  }
}
