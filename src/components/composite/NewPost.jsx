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

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewPost
