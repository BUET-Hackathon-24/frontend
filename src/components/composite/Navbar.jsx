import { Command, LogOut, Menu, Settings } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useNavigate } from 'react-router';
import { ModeToggle } from '.';
import NotificationComponent from '../custom/notification';
import NewPost from './NewPost';


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="/" className="flex items-center space-x-2">
                  <Command className="h-6 w-6" />
                  <span className="font-bold">Planner.io</span>
                </a>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/blog">Blog Generation</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/vlog">Vlog Generation</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/#">Documentation</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="ml-4 lg:ml-0">
          <a href="/" className="flex items-center space-x-2">
            <Command className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Planner.io</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>

                <a href="/user/blog" className={navigationMenuTriggerStyle()}>
                Blog Generation
                </a>

              </NavigationMenuItem>
              <NavigationMenuItem>


                <a href="/user/vlog" className={navigationMenuTriggerStyle()}>
                Vlog Generation
                </a>





              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/docs" className={navigationMenuTriggerStyle()}>
                  Documentation
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Profile Popover */}
        <div className="ml-auto flex items-center space-x-2">
          <NotificationComponent />
          <NewPost />
          <ModeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={localStorage.getItem('avatar')} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-4">
                <div
                  onClick={() => navigate('/user/profile')}
                  className="flex flex-col space-y-1 cursor-pointer"
                >
                  <p className="text-sm font-medium">{localStorage.getItem('name') ?? 'user'}</p>
                  <p className="text-xs text-muted-foreground">
                    {localStorage.getItem('email') ?? 'user@gmail.com'}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    onClick={() => navigate('/logout')}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef(function ListItem({ className, title, children, ...props }, ref) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

export default Navbar
