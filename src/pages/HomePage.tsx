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
import {
  seedAnnualMotto,
  seedHeroSlides,
  seedNews,
  seedPastorGreeting,
} from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function HomePage() {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const [slides, setSlides] = useState<HeroSlide[]>(seedHeroSlides)
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
      <HeroSlider slides={slides} />
      {isAdminMode ? (
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
