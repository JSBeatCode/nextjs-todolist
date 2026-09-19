// [9단계 메모]
// - 세그먼트별로 loading.tsx를 따로 둘 수 있습니다. 이 파일은 /todos/[id] 요청에만
//   적용되고, "/" (app/loading.tsx)에는 영향을 주지 않습니다.
export default function TodoDetailLoading() {
  return <p>할 일 정보를 불러오는 중...</p>
}
