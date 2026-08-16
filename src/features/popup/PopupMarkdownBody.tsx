import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * 방문자용 마크다운 렌더러. react-markdown은 rehype-raw를 추가하지 않는 한
 * 마크다운에 섞인 raw HTML을 텍스트로 이스케이프하는 게 기본값이라 별도
 * sanitize 없이도 안전하다 (관리자 에디터의 미리보기 엔진과는 별개 — 그쪽은
 * raw HTML을 실행하므로 방문자 렌더링에는 재사용하지 않는다).
 */
export default function PopupMarkdownBody({ children }: { children: string }) {
  return (
    <div
      className="max-w-none text-sm leading-relaxed text-ink [&_a]:text-terracotta [&_a]:underline [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
