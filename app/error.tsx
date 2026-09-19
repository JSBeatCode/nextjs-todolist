"use client"
// [9단계 메모]
// - error.tsx는 반드시 "use client"여야 합니다. 에러 바운더리는 React의 클라이언트 측
//   메커니즘(componentDidCatch와 같은 원리)을 기반으로 동작하기 때문입니다.
// - 이 파일도 컨벤션 파일입니다: 같은 세그먼트(app/page.tsx) 렌더링 중 에러가 발생하면
//   Next.js가 자동으로 이 컴포넌트를 대신 보여줍니다. try/catch를 page.tsx에 직접 쓸 필요가 없습니다.
// - props로 error(발생한 에러 객체)와 reset(다시 시도 함수)을 받습니다.
// - 주의: error.tsx는 "같은 파일 자신의 부모 layout.tsx는 못 덮습니다" - 즉 루트
//   layout.tsx 자체에서 난 에러는 이 파일로 못 잡습니다 (그건 global-error.tsx의 역할, 여기선 다루지 않음).

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
  useEffect(() => {
    console.error(error);
    }, [error])

  return (
    <main>
      <h1>문제가 발생했습니다</h1>
      <p>목록을 불러오는 중 오류가 났습니다</p>
      <button onClick={() => reset()}>다시 시도</button>
    </main>
  );
}
