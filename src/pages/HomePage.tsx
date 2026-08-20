import { useCallback, useEffect, useState } from 'react'
import { Seo } from '../components/shared/Seo'
import { HeroSlider } from '../features/hero/HeroSlider'
import { HeroManagePanel } from '../features/hero/HeroManagePanel'
import { GreetingMottoBand } from '../features/home/GreetingMottoBand'
import { NewsPreview } from '../features/home/NewsPreview'
import { QuickLinks } from '../features/home/QuickLinks'
import {
  getAnnualMotto,
  getHeroSlides,
  getNewsPosts,
  getPastorGreeting,
} from '../lib/content-service'
import type { AnnualMotto, HeroSlide, NewsPost, PastorGreeting } from '../types/content'
import { seedAnnualMotto, seedNews, seedPastorGreeting } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

/**
 * 모듈 스코프 캐시: HOME은 다른 메뉴로 이동했다가 돌아올 때마다 언마운트·재마운트되어
 * state가 초기화된다. 매번 seed 폴백(주차장 사진과 흡사한 이미지)이 잠깐 노출된 뒤
 * Firestore 응답으로 교체되는 깜빡임을 막기 위해, 세션 내 마지막으로 불러온 Hero
 * 슬라이드를 여기 보관해 두었다가 다음 마운트의 초기값으로 재사용한다.
 */
let cachedHeroSlides: HeroSlide[] | null = null

/** 세션 내 첫 로딩 동안 노출: seed 사진 대신 중립 스켈레톤을 보여줘 실제 콘텐츠로 오인되지 않게 한다. */
function HeroSkeleton() {
  return (
    <div
      className="relative h-[min(92vh,900px)] min-h-[560px] w-full animate-pulse overflow-hidden bg-ink"
      style={{ marginTop: 'calc(var(--header-h, 0px) * -1)' }}
    />
  )
}

export function HomePage() {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const [slides, setSlides] = useState<HeroSlide[] | null>(cachedHeroSlides)
  const [greeting, setGreeting] = useState<PastorGreeting>(seedPastorGreeting)
  const [motto, setMotto] = useState<AnnualMotto>(seedAnnualMotto)
  const [news, setNews] = useState<NewsPost[]>(seedNews)

  const reload = useCallback(async () => {
    const [s, g, m, n] = await Promise.all([
      getHeroSlides(),
      getPastorGreeting(),
      getAnnualMotto(),
      getNewsPosts({ publishedOnly: true, pageSize: 3 }),
    ])
    cachedHeroSlides = s
    setSlides(s)
    setGreeting(g)
    setMotto(m)
    setNews(n)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return (
    <>
      <Seo title="HOME" path="/" description="대한예수교장로회 사랑하는교회 공식 홈페이지" />
      {slides ? <HeroSlider slides={slides} /> : <HeroSkeleton />}
      {isAdminMode && slides ? (
        <HeroManagePanel slides={slides} onUpdated={() => void reload()} />
      ) : null}
      <GreetingMottoBand
        greeting={greeting}
        motto={motto}
        onUpdated={() => void reload()}
      />
      <NewsPreview posts={news} />
      <QuickLinks />
    </>
  )
}
