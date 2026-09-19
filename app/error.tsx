"use client"
// [9단계 메모]
// - error.tsx는 반드시 "use client"여야 합니다. 에러 바운더리는 React의 클라이언트 측
//   메커니즘(componentDidCatch와 같은 원리)을 기반으로 동작하기 때문입니다.
// - 이 파일도 컨벤션 파일입니다: 같은 세그먼트(app/page.tsx) 렌더링 중 에러가 발생하면
//   Next.js가 자동으로 이 컴포넌트를 대신 보여줍니다. try/catch를 page.tsx에 직접 쓸 필요가 없습니다.
// - props로 error(발생한 에러 객체)와 reset(다시 시도 함수)을 받습니다.
// - 주의: error.tsx는 "같은 파일 자신의 부모 layout.tsx는 못 덮습니다" - 즉 루트
//   layout.tsx 자체에서 난 에러는 이 파일로 못 잡습니다 (그건 global-error.tsx의 역할, 여기선 다루지 않음).

// React의 useEffect Hook을 가져옵니다.
// 아래에서 에러가 발생했을 때 error 내용을 콘솔에 출력하는 데 사용합니다.
import { useEffect } from "react"

// Next.js가 에러가 발생했을 때 자동으로 이 컴포넌트를 렌더링합니다.
//
// error: 발생한 에러 객체
// reset: 에러가 발생한 화면을 다시 렌더링하도록 요청하는 함수
export default function Error({
  error,
  reset,
}: {
    // Error 객체를 받고, digest라는 선택적 문자열 속성을 추가로 가질 수 있습니다.
    error: Error & { digest?: string };

    // 호출하면 현재 에러 상태에서 다시 렌더링을 시도합니다.
    reset: () => void;
  }) {

  // error 값이 변경될 때마다 실행됩니다.
  useEffect(() => {

    // 발생한 에러를 브라우저 개발자 도구의 콘솔에 출력합니다.
    console.error(error);

    // error가 변경될 때만 이 effect를 다시 실행합니다.
    }, [error])

  // 사용자에게 실제로 보여줄 에러 화면입니다.
  return (
    <main>
      {/* 에러가 발생했다는 제목을 보여줍니다. */}
      <h1>문제가 발생했습니다</h1>

      {/* 어떤 문제가 발생했는지 사용자에게 안내합니다. */}
      <p>목록을 불러오는 중 오류가 났습니다</p>

      {/* 사용자가 클릭하면 reset()을 실행해서 다시 렌더링을 시도합니다. */}
      <button onClick={() => reset()}>다시 시도</button>
    </main>
  );
}
