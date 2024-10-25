import { AI_API } from '@/constants';
import api from '@/lib/axios';
import { redirect } from 'react-router';
import { Button } from './Button';

const Vlog = () => {

  const handle = async () => {
      const res = await fetch(AI_API + '/image_search/vlog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }})
      const data = await res.json()
      const url = "https://cghemaaztqssvxbmmzwq.supabase.co/storage/v1/object/public/files/" + data.file_name
      await api.post('/vlogs', {
        title: "",
        url: url,
      })
      redirect(url, '_blank')
  }
  return (
    <div className='w-screen h-screen'>
    <div className='m-auto '>
      <Button variants="contained" onClick={handle} >
        Generate
      </Button>
    </div>
    </div>




  )
}

export default Vlog