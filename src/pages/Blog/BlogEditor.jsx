import { ListBulletIcon } from '@radix-ui/react-icons'
import { IconListNumbers } from '@tabler/icons-react'
import isHotkey from 'is-hotkey'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  Quote,
  UnderlineIcon,
} from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { createEditor, Editor, Element as SlateElement, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import MarkButton from './BlockButton'

const Button = React.forwardRef(({ active, reversed, style, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      cursor: 'pointer',
      color: reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc',
      ...style,
    }}
  />
))

const Icon = React.forwardRef(({ style, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      fontFamily: 'Material Icons',
      fontSize: '18px',
      verticalAlign: 'text-bottom',
      ...style,
    }}
  />
))

const Menu = React.forwardRef(({ style, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    style={{
      '& > *': {
        display: 'inline-block',
      },
      '& > * + *': {
        marginLeft: '15px',
      },
      ...style,
    }}
  />
))

const Toolbar = React.forwardRef(({ style, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className="flex flex-row flex-wrap w-full items-center justify-evenly"
    style={{
      position: 'relative',
      padding: '1px 18px 17px',
      margin: '0 -20px',
      borderBottom: '2px solid #eee',
      marginBottom: '20px',
      ...style,
    }}
  />
))

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichTextEditor = () => {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon={<Bold />} />
        <MarkButton format="italic" icon={<Italic />} />
        <MarkButton format="underline" icon={<UnderlineIcon />} />
        <MarkButton format="code" icon={<Code />} />
        <BlockButton format="heading-one" icon={<Heading1 />} />
        <BlockButton format="heading-two" icon={<Heading2 />} />
        <BlockButton format="block-quote" icon={<Quote />} />
        <BlockButton format="numbered-list" icon={<IconListNumbers />} />
        <BlockButton format="bulleted-list" icon={<ListBulletIcon />} />
        <BlockButton format="left" icon={<AlignLeft />} />
        <BlockButton format="center" icon={<AlignCenter />} />
        <BlockButton format="right" icon={<AlignRight />} />
        <BlockButton format="justify" icon={<AlignJustify />} />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }

  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.code) {
    children = <code>{children}</code>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default RichTextEditor
