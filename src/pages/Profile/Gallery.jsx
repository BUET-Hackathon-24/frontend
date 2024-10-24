import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'
import { IconGrid4x4, IconLayoutList, IconPhoto, IconUser } from '@tabler/icons-react'
import { format } from 'date-fns'
import { Clock, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'

const Gallery = () => {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState(1)

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await api.get('posts')
        setPosts(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    loadPosts()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <FeedView posts={posts} />
      case 2:
        return <GridView posts={posts} />
      case 3:
        return <div className="text-center p-8 text-gray-500">Tab 3 content coming soon...</div>
      case 4:
        return <div className="text-center p-8 text-gray-500">Tab 4 content coming soon...</div>
      default:
        return <FeedView posts={posts} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex justify-center gap-12 pb-4">
          <IconLayoutList
            onClick={() => setActiveTab(1)}
            size={28}
            className={cn(
              activeTab === 1 ? 'text-blue-600' : 'text-gray-400',
              'cursor-pointer hover:text-blue-500 transition-colors'
            )}
          />
          <IconGrid4x4
            onClick={() => setActiveTab(2)}
            size={28}
            className={cn(
              activeTab === 2 ? 'text-blue-600' : 'text-gray-400',
              'cursor-pointer hover:text-blue-500 transition-colors'
            )}
          />
          <IconPhoto
            onClick={() => setActiveTab(3)}
            size={28}
            className={cn(
              activeTab === 3 ? 'text-blue-600' : 'text-gray-400',
              'cursor-pointer hover:text-blue-500 transition-colors'
            )}
          />
          <IconUser
            onClick={() => setActiveTab(4)}
            size={28}
            className={cn(
              activeTab === 4 ? 'text-blue-600' : 'text-gray-400',
              'cursor-pointer hover:text-blue-500 transition-colors'
            )}
          />
        </div>
      </div>

      {renderContent()}
    </div>
  )
}

// Feed View Component (Original PostCard layout)
const FeedView = ({ posts }) => (
  <div className="grid grid-cols-1 gap-6">
    {posts.map((post, index) => (
      <PostCard
        key={index}
        post={post}
        name={localStorage.getItem('name')}
        avatar={localStorage.getItem('avatar')}
      />
    ))}
  </div>
)

// Grid View Component
const GridView = ({ posts }) => (
  <div className="grid grid-cols-3 gap-1">
    {posts.map((post, index) => (
      <GridItem
        key={index}
        post={post}
        name={localStorage.getItem('name')}
        avatar={localStorage.getItem('avatar')}
      />
    ))}

    <SearchBar />
  </div>
)

// Grid Item Component
const GridItem = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const hasPhotos = post.photos && post.photos.length > 0
  const hasCaption = post.caption != '' && post.caption.trim().length > 0

  if (!hasPhotos && hasCaption) {
    // Render caption-only post with gradient background
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="aspect-square cursor-pointer relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600"
      >
        <div className="absolute inset-0 p-4 text-white flex items-center justify-center text-center">
          <p className="line-clamp-4 text-sm">{post.caption}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-square cursor-pointer" onClick={() => setIsOpen(true)}>
      <img src={post.photos[0].url} alt="" className="w-full h-full object-cover" />
      {post.photos.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {post.photos.length}
        </div>
      )}
      {hasCaption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p className="text-white text-xs line-clamp-2">{post.caption}</p>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="relative">
              <img src={post.photos[currentImageIndex].url} alt="" className="w-full h-auto" />
              {post.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + post.photos.length) % post.photos.length
                      )
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex((prev) => (prev + 1) % post.photos.length)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const PostCard = ({ post, name, avatar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.photos.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.photos.length) % post.photos.length)
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
        <div className="relative aspect-square cursor-pointer" onClick={() => setIsOpen(true)}>
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
        <DialogContent className="sm:max-w-3xl">
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

export default Gallery
