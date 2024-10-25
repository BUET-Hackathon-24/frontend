import { AI_API } from '@/constants';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const RichTextEditor = () => {
  const [text, setText] = useState('')

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
            end: 2,
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

        setText(decodedContent)
      } catch (error) {
        console.error('Get blog error:', error)
      }
    }

    getBlog()
  }, [])

  const handleChange = (value) => {
    setText(value)
  }

  return (
    <div className="flex justify-center">
      <ReactQuill
        className="w-[60%]"
        value={text}
        onChange={handleChange}
        modules={RichTextEditor.modules}
        formats={RichTextEditor.formats}
      />
    </div>
  )
}

// Specify the modules for the editor
RichTextEditor.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'blockquote', 'code-block'],
    ['clean'], // Remove formatting button
  ],
}

// Specify the formats for the editor
RichTextEditor.formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
  'blockquote',
  'code-block',
]

export default RichTextEditor
