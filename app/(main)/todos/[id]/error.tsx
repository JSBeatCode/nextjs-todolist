"use client";
// [9단계 메모]
// - app/error.tsx와 마찬가지 구조지만, /todos/[id] 세그먼트에서 난 에러만 잡습니다.

import { useEffect } from "react";
import Link from 'next/link'

export default function TodoDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error])

  return (
    <main>
      <h1>할 일 정보를 불러오지 못했습니다.</h1>
      <p>일시적인 문제일 수 있습니다.</p>
      <button onClick={() => reset()}>다시 시도</button>
      <p>
        <Link href="/">&larr; 목록으로 돌아가기</Link>
      </p>
  </main>
  )
}
