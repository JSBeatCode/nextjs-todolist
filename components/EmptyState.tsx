// [10단계 메모]
// - next/image의 <Image>는 일반 <img>와 다르게 자동으로:
//   1) width/height 기반으로 레이아웃 밀림(CLS)을 방지하고
//   2) 화면 크기에 맞는 최적 포맷/크기로 이미지를 서빙하고
//   3) 기본적으로 lazy loading을 적용합니다.
// - 이 컴포넌트는 "use client"가 없는 Server Component입니다.
// - public/ 폴더에 둔 파일은 "/파일명"으로 바로 접근 가능합니다.
//
// [추가 설명]
// - EmptyState는 Todo 목록이 비어 있을 때 보여주는 "빈 상태 화면" 컴포넌트입니다.
// - Todo 데이터가 없는지 판단하는 역할은 하지 않고,
//   호출한 쪽에서 <EmptyState />를 렌더링하면 빈 상태 UI를 보여주는 역할만 합니다.
// - <Image>는 일반 HTML의 <img>와 비슷하게 이미지를 표시하지만,
//   Next.js가 이미지 최적화 기능을 제공하는 컴포넌트입니다.
// - <Image>는 기본적으로 lazy loading을 사용하지만,
//   아래처럼 priority를 지정하면 lazy loading하지 않고 우선적으로 이미지를 로딩합니다.
// - 이 이미지가 EmptyState 화면에 표시되는 중요한 이미지이므로 priority가 지정되어 있습니다.

import Image from "next/image";

export default function EmptyState() {
  return (
    // 빈 상태 화면 전체를 감싸는 영역
    // textAlign: "center" → 내용을 가운데 정렬
    // padding: "32px 0" → 위/아래 여백 32px
    // color: "#888" → 글자 색상
    <div style={{ textAlign: "center", padding: "32px 0", color: "#888" }}>

      <Image
        // public/empty-illustration.svg 파일을 이미지로 표시
        // public 폴더의 파일은 "/파일명"으로 접근할 수 있음
        src="/empty-illustration.svg"

        // 이미지가 표시되지 않을 경우 사용할 설명
        // 웹 접근성(스크린 리더)에도 사용됨
        alt="할 일이 없음을 나타내는 빈 노트 일러스트"

        // 이미지의 표시 크기
        // width/height를 지정해서 이미지 영역의 크기를 미리 확보
        width={160}
        height={160}

        // 이 이미지는 우선적으로 로딩
        // 기본 <Image>의 lazy loading 대신 페이지 로딩 시 우선 로딩
        priority
      />

      {/*// 사용자에게 Todo가 없다는 것을 안내*/}
      <p>아직 할 일이 없어요. 위에서 새 항목을 추가해보세요.</p>
    </div>
  );
}
