import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { Clock, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

const PostCard = ({ post, name, avatar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.photos.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.photos.length) % post.photos.length)
  }

  const handleImageClick = (e) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-gray-100">
        <img
          src={avatar || '/api/placeholder/32/32'}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock size={14} />
            <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {post.photos && post.photos.length > 0 && (
        <div className="relative aspect-square cursor-pointer" onClick={handleImageClick}>
          <img src={post.photos[0].url} alt="" className="w-full h-full object-cover" />
          {post.photos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
              {`1/${post.photos.length}`}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <button className="hover:text-red-500 transition-colors">
            <Heart size={24} />
          </button>
          <button className="hover:text-blue-500 transition-colors">
            <MessageCircle size={24} />
          </button>
          <button className="hover:text-green-500 transition-colors">
            <Share2 size={24} />
          </button>
        </div>

        {post.caption && <p className="text-gray-800">{post.caption}</p>}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <div className="relative">
              <img src={post.photos[currentImageIndex].url} alt="" className="w-full h-auto" />
              {post.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      previousImage()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    →
                  </button>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {`${currentImageIndex + 1}/${post.photos.length}`}
                  </div>
                </>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostCard
