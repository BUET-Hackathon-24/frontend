import MarkdownWithCode from '@/components/custom/Code'
import { Markdown } from '@/components/custom/markdown'

const Home = () => {
  const markdown = `![Cute
        cat](https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

       \`\`\`
  const first = useContext(second)
  console.log(first)
  \`\`\`
        `
  return (
    <div>
      <MarkdownWithCode />
      <Markdown>{markdown}</Markdown>
    </div>
  )
}

export default Home
