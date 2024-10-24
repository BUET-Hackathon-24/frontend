import { cn } from '@/lib/utils'
import {
  FileAudioIcon,
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
  XIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  // Find the appropriate unit
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // Calculate the size in the appropriate unit
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1))

  return `${size} ${sizes[i]}`
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
        animationDelay: `${index * 100}ms`,
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

export const FileUploader = ({ onFileSelect, selectedFiles, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = [...e.dataTransfer.files]
    handleFiles(files)
  }

  const handleFiles = (files) => {
    onFileSelect(files)
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-300',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-300 dark:border-gray-700',
          'hover:border-blue-500 cursor-pointer bg-white dark:bg-gray-800'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={(e) => handleFiles([...e.target.files])}
        />

        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Drop files here or click to upload
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Support for images, videos, documents and more
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedFiles.map((file, index) => (
          <FilePreview
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  )
}

export default FileUploader
