import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCustomChat } from '@/hooks/useChat'
import { uploadToSupabase } from '@/lib/utils/supabase'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import MultimodalInput from '../custom/multimodal-input'

const NewPost = ({ id = 1, initialMessages = [] }) => {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } = useCustomChat({
    id,
    initialMessages,
    onFinish: () => {
      // window.history.replaceState({}, '', `/chat/${id}`)
    },
  })

  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Create post data structure
      const postData = {
        content: input,
        files: [],
        messages: messages,
      }

      // Upload all attachments to Supabase
      if (attachments.length > 0) {
        const uploadPromises = attachments.map(async (attachment) => {
          // Get the actual File object from the attachment's url
          const response = await fetch(attachment.url)
          const blob = await response.blob()
          const file = new File([blob], attachment.name, { type: attachment.contentType })

          // Upload to Supabase and get the public URL
          const uploadedFile = await uploadToSupabase({
            file,
            bucketName: 'files', // or whatever your bucket name is
          })

          return {
            ...attachment,
            url: uploadedFile.url,
            path: uploadedFile.path,
          }
        })

        // Wait for all uploads to complete
        postData.files = await Promise.all(uploadPromises)
      }

      // Here you would typically save the post data to your database
      // For example:
      // await savePost(postData);

      console.log('Post created successfully:', postData)

      // Clear the form
      setInput('')
      setAttachments([])

      // Close the dialog
      // You'll need to implement this using the Dialog's state
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>ADD POST</DialogTitle>
          <DialogDescription>Add a new post to your feed.</DialogDescription>
        </DialogHeader>

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
          suggestions={false}
        />

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <DialogFooter>
          <Button
            onClick={submit}
            type="submit"
            disabled={isSubmitting || (!input.trim() && attachments.length === 0)}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewPost
