import { Button } from '@/components/ui';
import { AI_API } from '@/constants';
import api from '@/lib/axios';
import MDEditor from '@uiw/react-md-editor';

import React, { useEffect } from 'react';
export default function Ed() {
  const [value, setValue] = React.useState('**Hello world!!!**')
  useEffect(() => {
    const getBlog = async () => {
      try {

        let res = await fetch(AI_API + '/image_search/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          },
          body: JSON.stringify({
            start: 1,
            end: 2
          }),
        })
        const data = await res.json()
        console.log(data.blog)
        // If the API returns HTML content, you might need to decode it
        const decodedContent = data.blog
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')

        setValue(decodedContent)
      } catch (error) {
        console.error('Get blog error:', error)
      }
    }

    getBlog()
  }, [])



  const submitBlog = async()=> {
    const res = await api.post('/blogs', {
      title: 'Test Blog',
      value: value
    })
    console.log(res.data)
  }
  return (
    <div className="container" data-color-mode="media">
    <div>
    <MDEditor value={value} onChange={setValue} />
    <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    <div className=' w-full'>
    </div>
    <Button className='m-auto' variants="outlined" onClick={submitBlog}>Submit</Button>
      </div>
    </div>
  )
}
