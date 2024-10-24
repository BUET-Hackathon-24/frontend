import { useLocalStorage } from '@hooks/useLocalStorage'

const UseLocalStorage = () => {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue')

  return <div>value</div>
}

export default UseLocalStorage
