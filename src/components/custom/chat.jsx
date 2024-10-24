import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom'
import { useCustomChat } from '@/hooks/useChat'
import { useState } from 'react'
import { Message } from './message'
import { MultimodalInput } from './multimodal-input'
import { Overview } from './overview'

export default function Chat({ id, initialMessages }) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } = useCustomChat({
    id,
    initialMessages,
    onFinish: () => {
      // window.history.replaceState({}, '', `/chat/${id}`)
    },
  })

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom()
  const [attachments, setAttachments] = useState([])

  const handleFileSelect = (files) => {
    setAttachments((prev) => [...prev, ...files])
  }

  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/5 dark:bg-grid-gray-100/5" />

      {/* Content container */}
      <div className="relative flex flex-col h-dvh max-w-3xl mx-auto">
        {/* Messages section */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scroll-smooth px-4 py-8">
          <div className="flex flex-col gap-6 items-center">
            {messages.length === 0 && <Overview />}

            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                attachments={message.experimental_attachments}
                toolInvocations={message.toolInvocations}
              />
            ))}

            <div ref={messagesEndRef} className="h-px" />
          </div>
        </div>

        {/* Input section - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t dark:border-gray-800">
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {/*}<FileUploader
              onFileSelect={handleFileSelect}
              selectedFiles={attachments}
              onRemoveFile={handleRemoveFile}
            />*/}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1">
                <MultimodalInput
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  stop={stop}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  messages={messages}
                  append={append}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// CSS utility for grid background
const gridStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
}
