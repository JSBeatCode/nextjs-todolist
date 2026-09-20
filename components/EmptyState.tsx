// [10단계 메모]
// - next/image의 <Image>는 일반 <img>와 다르게 자동으로:
//   1) width/height 기반으로 레이아웃 밀림(CLS)을 방지하고
//   2) 화면 크기에 맞는 최적 포맷/크기로 이미지를 서빙하고
//   3) 기본적으로 lazy loading을 적용합니다.
// - 이 컴포넌트는 "use client"가 없는 Server Component입니다.
// - public/ 폴더에 둔 파일은 "/파일명"으로 바로 접근 가능합니다.

import Image from "next/image";

export default function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "32px 0", color: "#888" }}>
      <Image
        src="/empty-illustration.svg"
        alt="할 일이 없음을 나타내는 빈 노트 일러스트"
        width={160}
        height={160}
        priority
      />
      <p>아직 할 일이 없어요. 위에서 새 항목을 추가해보세요.</p>
    </div>
  );
}
