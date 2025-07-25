import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { memo, useMemo } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { marked } from 'marked'

const components: Partial<Components> = {
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props}>
        {children}
      </blockquote>
    )
  },
  code: ({ className, children, ...props }) => {
    return (
      <code className={cn('bg-muted/30 rounded px-[0.3rem] py-[0.2rem] font-mono text-sm', className)} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => {
    return (
      <ol className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ol>
    )
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    )
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="ml-4 list-outside list-disc" {...props}>
        {children}
      </ul>
    )
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    )
  },
  a: ({ children, ...props }) => {
    return (
      <a className="text-blue-500 hover:underline" target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold" {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold" {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold" {...props}>
        {children}
      </h6>
    )
  },
  p: ({ children, ...props }) => {
    return (
      <p className="text-base" {...props}>
        {children}
      </p>
    )
  },
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-2" {...props} />,
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="relative w-full border-none text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:border-b-none m-0 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
      {children}
    </td>
  ),
}

interface MarkdownBlockProps {
  content: string
}

const MemoizedMarkdownBlock = memo(
  ({ content }: MarkdownBlockProps) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm, [remarkMath]]} rehypePlugins={[[rehypeKatex]]} components={components}>
        {content}
      </ReactMarkdown>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false
    }
    return true
  },
)

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock'

interface MarkdownContentProps {
  content: string
  id: string
}

export const MarkdownContent = memo(({ content, id }: MarkdownContentProps) => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])

  return blocks.map((block, index) => <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />)
})

MarkdownContent.displayName = 'MarkdownContent'

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map(token => token.raw)
}
