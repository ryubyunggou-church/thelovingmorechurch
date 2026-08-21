import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_TITLE } from '../../types/content'

interface SeoProps {
  title: string
  description?: string
  path?: string
}

export function Seo({ title, description, path = '/' }: SeoProps) {
  /** 브라우저 탭 타이틀 전용 — 소셜 공유 미리보기(og:title)는 정식 명칭을 그대로 쓴다 */
  const tabTitle = title === 'HOME' ? SITE_TITLE : `${title} | ${SITE_TITLE}`
  const ogTitle = title === 'HOME' ? SITE_NAME : `${title} | ${SITE_NAME}`
  const desc =
    description ??
    `${SITE_NAME} 공식 홈페이지 — 예배안내, 교육부서, 선교사역, 교회소식, 오시는길`
  const url = `https://www.tlmc.kr${path}`

  return (
    <Helmet>
      <title>{tabTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
