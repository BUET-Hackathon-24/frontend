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
import { toast } from 'sonner'
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
        caption: input,
        files: [],
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
            url: uploadedFile.url,
            name: uploadedFile.path,
          }
        })

        // Wait for all uploads to complete and stringify the files array
        const uploadedFiles = await Promise.all(uploadPromises)
        postData.files = uploadedFiles
      }

      console.log(postData)
      try {
        // const res = await api.post('/posts', postData)
        const res = await fetch('http://172.28.31.67:8000/api/v1/image_search/upload', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        console.log(res)
        toast.success('Post created successfully!')
      } catch (err) {
        console.log(err)
        toast.error('Failed to create post')
      }
      // Clear the form
      setInput('')
      setAttachments([])

      // Close the dialog
      // You'll need to implement this using the Dialog's state
    } catch (err) {
      toast.error('Error creating post:', err)
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
