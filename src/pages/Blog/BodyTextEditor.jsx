import { useState, useEffect } from 'react'
import RichTextEditor from 'react-rte'

export default function BodyTextEditor({ value, setValue }) {
  // Initialize with empty state value
  const [editorValue, setEditorValue] = useState(() => RichTextEditor.createEmptyValue())

  useEffect(() => {
    if (value) {
      try {
        // Create new editor value from content
        const newValue = RichTextEditor.createValueFromString(value, 'html')
        setEditorValue(newValue)
      } catch (error) {
        console.error('Error setting editor value:', error)
      }
    }
  }, [value])

  const handleChange = (newValue) => {
    setEditorValue(newValue)
    // Only call setValue if there's actually a change
    if (setValue) {
      setValue(newValue.toString('html'))
    }
  }

  return (
    <RichTextEditor
      value={editorValue}
      onChange={handleChange}
      required
      multiline
      variant="filled"
      style={{ minHeight: 410 }}
    />
  )
}
