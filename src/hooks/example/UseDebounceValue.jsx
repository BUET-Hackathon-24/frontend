const { useState, useEffect } = require('react')
const { useDebounce } = require('..')

// In a component:
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay

  useEffect(() => {
    // This will only run 500ms after the user stops typing
    if (debouncedSearchTerm) {
      searchAPI(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}

export default SearchComponent
