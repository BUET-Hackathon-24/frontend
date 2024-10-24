import { useState } from 'react'

const UseDebounceFunc = () => {
  const [results, setResults] = useState([])

  const searchAPI = async (term) => {
    const data = await fetch(`/api/search?q=${term}`)
    setResults(await data.json())
  }

  const debouncedSearch = useDebounceFunc(searchAPI, 500)

  return (
    <input type="text" onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search..." />
  )
}

export default UseDebounceFunc
