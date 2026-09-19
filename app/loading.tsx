// [9단계 메모]
// - 이 파일은 컨벤션 파일입니다. app/page.tsx와 같은 디렉토리에 loading.tsx를 두면,
//   Next.js가 자동으로 app/page.tsx를 <Suspense fallback={<Loading />}>로 감싸줍니다.
//   개발자가 직접 <Suspense>를 써서 감쌀 필요가 없습니다 - 파일명만으로 동작합니다.
// - 동작 시점: page.tsx(async Server Component, 우리 경우 getTodos() 호출)가 데이터를
//   기다리는 동안 이 화면이 먼저 보입니다. 데이터가 준비되면 실제 페이지로 교체됩니다.

export default function Loading() {
  return <p>불러오는 중...</p>
}
