import { FileIcon, FileTextIcon, FileTypeIcon, FileVideoIcon, ImageIcon } from 'lucide-react'
import { LoaderIcon } from './icons'

const getFilePreviewInfo = (contentType, name) => {
  if (!contentType) {
    const extension = name?.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'pdf':
        return {
          icon: <FileIcon className="w-8 h-8 text-red-500" />,
          label: 'PDF Document',
        }
      case 'txt':
        return {
          icon: <FileTextIcon className="w-8 h-8 text-blue-500" />,
          label: 'Text File',
        }
      case 'mp4':
      case 'mov':
      case 'avi':
        return {
          icon: <FileVideoIcon className="w-8 h-8 text-purple-500" />,
          label: 'Video File',
        }
      default:
        return {
          icon: <FileTypeIcon className="w-8 h-8 text-gray-500" />,
          label: 'File',
        }
    }
  }

  if (contentType.startsWith('image')) {
    return {
      icon: <ImageIcon className="w-8 h-8 text-green-500" />,
      label: 'Image',
    }
  }

  // Add more content type checks here
  return {
    icon: <FileTypeIcon className="w-8 h-8 text-gray-500" />,
    label: 'File',
  }
}

export const PreviewAttachment = ({ attachment, isUploading = false }) => {
  const { name, url, contentType } = attachment
  const { icon, label } = getFilePreviewInfo(contentType, name)

  return (
    <div className="flex flex-row gap-2 w-fit max-w-[120px] group relative">
      <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg relative flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
        {contentType?.startsWith('image') ? (
          <div className="relative w-28  h-full">
            <img
              key={url}
              src={url}
              alt={name ? name : 'File attachment'}
              className="rounded-lg size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {icon}
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{label}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="animate-spin text-primary">
              <LoaderIcon className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 max-w-full truncate px-1">
        {name}
      </div>
    </div>
  )
}
