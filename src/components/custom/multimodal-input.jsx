import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { FileIcon, FileTextIcon, ImageIcon, PaperclipIcon, SendIcon, XIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const suggestedActions = [
  {
    title: 'What is the weather',
    label: 'in San Francisco?',
    action: 'What is the weather in San Francisco?',
  },
  {
    title: "Answer like I'm 5,",
    label: 'why is the sky blue?',
    action: "Answer like I'm 5, why is the sky blue?",
  },
]

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const getFileTypeInfo = (file) => {
  if (file.type.startsWith('image/')) {
    return {
      icon: <ImageIcon className="w-5 h-5" />,
      label: 'Image',
    }
  }
  if (file.type.startsWith('video/')) {
    return {
      icon: <FileVideoIcon className="w-5 h-5" />,
      label: 'Video',
    }
  }
  if (file.type.startsWith('audio/')) {
    return {
      icon: <FileAudioIcon className="w-5 h-5" />,
      label: 'Audio',
    }
  }
  if (file.type.startsWith('text/')) {
    return {
      icon: <FileTextIcon className="w-5 h-5" />,
      label: 'Doc',
    }
  }
  return {
    icon: <FileIcon className="w-5 h-5" />,
    label: 'File',
  }
}

const FilePreview = ({ file, onRemove, index }) => {
  const { icon, label } = getFileTypeInfo(file)
  const [isHovered, setIsHovered] = useState(false)
  const fileSize = formatFileSize(file.size)

  return (
    <div
      className={cn(
        'relative group p-4 rounded-lg',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'shadow-sm hover:shadow-md transition-all duration-300',
        'animate-in slide-in-from-bottom-3 fade-in duration-500'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationFillMode: 'forwards',
        // animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate max-w-[200px] text-gray-900 dark:text-gray-100">
            {file.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
              {fileSize}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          className={cn(
            'transition-all duration-300 p-1 rounded-full',
            isHovered ? 'opacity-100 bg-gray-100 dark:bg-gray-700' : 'opacity-0',
            'hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          <XIcon
            className={cn(
              'w-4 h-4 transition-transform duration-300 text-gray-500 dark:text-gray-400',
              isHovered ? 'rotate-90' : 'rotate-0'
            )}
          />
        </button>
      </div>

      {file.type.startsWith('image/') && (
        <div className="mt-3 relative h-24 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

export function MultimodalInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
}) {
  const [uploadQueue, setUploadQueue] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)
  const textAreaRef = useRef(null)

  const handleFileChange = useCallback(
    async (newFiles) => {
      const fileArray = Array.from(newFiles)
      setUploadQueue(fileArray.map((file) => file.name))
      setFiles((currentFiles) => [...currentFiles, ...fileArray])

      try {
        // Simulating file upload - replace with actual upload logic
        const uploadedAttachments = fileArray.map((file) => ({
          name: file.name,
          contentType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
        }))

        setAttachments((currentAttachments) => [...currentAttachments, ...uploadedAttachments])
      } catch (error) {
        console.error('Error uploading files!', error)
      } finally {
        setUploadQueue([])
      }
    },
    [setAttachments]
  )

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev - 1)
    if (dragCounter - 1 === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    const droppedFiles = [...e.dataTransfer.files]
    if (droppedFiles.length > 0) {
      handleFileChange(droppedFiles)
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    const pastedFiles = []

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          pastedFiles.push(file)
        }
      }

      if (pastedFiles.length > 0) {
        handleFileChange(pastedFiles)
      }
    }
  }

  const handleRemoveFile = (index) => {
    setFiles((currentFiles) => currentFiles.filter((_, i) => i !== index))
    setAttachments((currentAttachments) => currentAttachments.filter((_, i) => i !== index))
  }

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && files.length === 0 && uploadQueue.length === 0 && !isDragging && (
        <div className="grid sm:grid-cols-2 gap-2 w-full md:px-0 mx-auto md:max-w-[500px]">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
            >
              <Button variant="outline" size="sm" onClick={() => setInput(suggestedAction.action)}>
                {suggestedAction.title}{' '}
                <span className="text-muted-foreground">{suggestedAction.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      <div
        onDragEnter={handleDragEnter}
        // onDragLeave={handleDragLeave}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            'relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            isDragging ? 'min-h-40' : ''
          )}
        >
          {files.length > 0 &&
            files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                index={index}
                onRemove={handleRemoveFile}
              />
            ))}
          {isDragging && (
            <div className={cn('absolute w-full z-10 top-0 left-0 h-full')}>
              <div
                className={cn(
                  'h-full border-2 border-dashed rounded-lg flex items-center justify-center',
                  'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                )}
              >
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-blue-500" />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Drop files here to upload
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className={cn('flex items-end gap-2', isDragging && 'opacity-0')}>
            <Textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              placeholder="Type a message..."
              className="flex-1 pr-24"
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-primary"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-primary"
              >
                <PaperclipIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="primary"
                size="icon"
                onClick={isLoading ? stop : handleSubmit}
                disabled={!input.trim() && files.length === 0}
              >
                {isLoading ? <SendIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileChange([...e.target.files])}
        multiple
      />
    </div>
  )
}

export default MultimodalInput
