import { Navbar } from '@/components/composite/Navbar'
import { Outlet } from 'react-router'

export default function Template() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
