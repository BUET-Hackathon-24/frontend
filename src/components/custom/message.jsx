import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import { BotIcon, UserIcon } from './icons'
import { Markdown } from './markdown'
import { PreviewAttachment } from './preview-attachment'

export const Message = ({ role, content, toolInvocations, attachments }) => {
  return (
    <motion.div
      className="group relative flex flex-row gap-4 px-4 w-full md:w-[650px] md:px-0 py-4 first:pt-20 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="w-8 h-8 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {role === 'assistant' ? (
            <BotIcon className="w-5 h-5" />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {role === 'assistant' ? 'Assistant' : 'You'}
        </div>

        {content && (
          <div className="text-gray-800 dark:text-gray-200">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {attachments.map((attachment, index) => (
              <PreviewAttachment key={index} attachment={attachment} />
            ))}
          </div>
        )}

        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
