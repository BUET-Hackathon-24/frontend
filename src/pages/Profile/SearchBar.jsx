import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/axios'
import { useSetAtom } from 'jotai'
import { Loader2, Search, X } from 'lucide-react'
import { useState } from 'react'
import { SearchResultAtom } from './store'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setSearchResult = useSetAtom(SearchResultAtom)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      // Add your search logic here
      const search_string = encodeURIComponent(searchTerm)

      const res = await api.get(`photos/search/${search_string}`)

      setSearchResult(res.data)
      console.log(res.data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <form
      onSubmit={handleSearch}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-3"
    >
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="pr-10 py-2 w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={!searchTerm.trim() || isLoading}
          size="icon"
          className="h-10 w-10 shrink-0"
          variant="default"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
