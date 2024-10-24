import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell } from 'lucide-react'

const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 7) {
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  } else if (diffInDays > 0) {
    return `${diffInDays}d ago ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffInHours > 0) {
    return `${diffInHours}h`
  } else {
    return `${diffInMinutes}m`
  }
}

const dummyNotifications = [
  {
    id: 1,
    avatar: '/api/placeholder/32/32',
    title: 'New comment on your post about React performance optimization techniques',
    description: 'John Doe left a comment on your recent post',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 2,
    avatar: '/api/placeholder/32/32',
    title: 'Sarah mentioned you in a discussion',
    description: 'Check out the thread about state management',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: 3,
    avatar: '/api/placeholder/32/32',
    title: 'Your post was featured',
    description: 'Congratulations! Your article was featured on the homepage',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 4,
    avatar: '/api/placeholder/32/32',
    title: 'New follower',
    description: 'Alex started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: 5,
    avatar: '/api/placeholder/32/32',
    title: 'System notification',
    description: 'Your account was successfully verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
  },
  {
    id: 6,
    avatar: '/api/placeholder/32/32',
    title: 'Old notification',
    description: 'This is an old notification',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
]

const NotificationComponent = () => {
  const unreadCount = dummyNotifications.length
  const visibleNotifications = dummyNotifications.slice(0, 5)
  const hasMoreNotifications = dummyNotifications.length > 5

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start p-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={notification.avatar} />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{notification.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatTimeAgo(notification.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {hasMoreNotifications && (
            <Button variant="ghost" className="w-full h-10 font-normal">
              Show all notifications
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationComponent
