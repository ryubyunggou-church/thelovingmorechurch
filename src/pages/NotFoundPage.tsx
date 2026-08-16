import { Link } from 'react-router-dom'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
      <Seo title="페이지를 찾을 수 없습니다" path="/404" />
      <p className="index-num font-serif text-sm font-semibold text-gold-deep">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-paper-text">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-paper-muted">요청하신 주소가 올바른지 확인해 주세요.</p>
      <Button asChild className="mt-8">
        <Link to="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
