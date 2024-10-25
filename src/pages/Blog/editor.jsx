const editor = () => {
  const [values, setValues] = useState({
    bodyText: '',
  })

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
      // If the API returns HTML content, you might need to decode it
      const decodedContent = data.blog
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')

      setValues({ ...values, bodyText: decodedContent })
    } catch (error) {
      console.error('Get blog error:', error)
    }
  }

  getBlog()
}, [])

  return (
    <BodyTextEditor
      value={values.bodyText}
      setValue={(bodyText) => setValues({ ...values, bodyText })}
    />
  )
}
