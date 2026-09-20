import type { Metadata } from "next";
import { Noto_Sans_KR } from 'next/font/google';
import "./globals.css";

// [1단계 메모]
// - 이 파일은 "루트 레이아웃"이라고 부르며, app/ 디렉토리 안의 모든 페이지를 감싸는 공통 껍데기입니다.
// - Next.js 규칙: app/layout.tsx 는 반드시 <html>, <body> 태그를 포함해야 합니다.
//   (Vue2였다면 App.vue의 <router-view/>를 감싸는 최상위 템플릿과 비슷한 역할)
// - children 자리에 각 라우트의 page.tsx 내용이 끼워집니다.
// - next/font, generateMetadata 등 최적화/SEO 관련 기능은 10단계에서 이 파일에 추가할 예정입니다.
//   지금은 구조만 잡는 단계라 최소한의 metadata만 넣어둡니다.
// [10단계 메모]
// - next/font/google은 Google Fonts를 빌드 시점에 다운로드해서 자체 호스팅합니다.
//   즉 브라우저가 매번 fonts.googleapis.com에 요청하지 않아도 되고(레이아웃 밀림 방지),
//   개인정보 관점에서도 구글 서버로 요청이 안 나갑니다.
// - subsets: ["latin"] 만으로는 한글이 안 나와서, 한글 서비스는 별도로 한글 폰트를 씁니다.
// - variable 옵션으로 CSS 변수(--font-noto-sans-kr)를 만들고, 이걸 <html> className에 실어서
//   globals.css에서 font-family: var(--font-noto-sans-kr)로 참조하는 패턴이 표준적입니다.


// Noto Sans KR 폰트를 설정하고 CSS 변수로 사용할 수 있도록 등록
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],                 // 사용할 문자 세트
  variable: "--font-noto-sans-kr",    // CSS에서 사용할 폰트 변수 이름. 그 다음 CSS에서 이렇게 사용함 -> font-family: var(--font-noto-sans-kr);
  display: "swap",                    // 폰트 로딩 중에는 기본 폰트를 먼저 표시
});

// 페이지의 제목과 설명 등 HTML <head>에 들어갈 메타데이터 설정
export const metadata: Metadata = {
  title: {
    default: "Todo App",              // 페이지에서 별도 제목을 지정하지 않았을 때 사용할 기본 제목
    template: "%s | Todo App",        // 하위 페이지의 제목을 "%s" 자리에 넣어 공통 제목 형식으로 표시. 하위 페이지에서, 'title: "할 일 목록"' 이렇게 되어 있으면 브라우저 탭에 이렇게 보여짐 -> 할 일 목록 | Todo App
  },
  description: "Next.js App Router로 만드는 학습용 Todo 앱", // 페이지 설명
};

// 앱 전체 페이지를 감싸는 최상위 레이아웃 컴포넌트
// children:
  // 여기에 현재 접속한 페이지의 내용이 들어와.
  // 예를 들어 사용자가 /todos에 접속하면 대략:
    // RootLayout
    // └─ <html>
    //     └─ <body>
    //         └─ /todos 페이지 내용 (app/(main)/todos/page.tsx) ← children
  // 혹은 '/' 로 접속하면:
    // 사용자가 "/" 접속
    //       ↓
    // Next.js가 app/page.tsx를 찾음
    //       ↓
    // page.tsx의 결과를 children에 넣음
    //       ↓
    // RootLayout(children)
    //       ↓
    // <html>
    //   <body>
    //     {children}  ← page.tsx의 화면
    //   </body>
    // </html>
  // 결론:
    // layout.tsx
    // └── {children}
    //      ├── 정상       → todos/page.tsx
    //      ├── 로딩 중    → todos/loading.tsx
    //      └── 에러 발생  → todos/error.tsx
export default function RootLayout({
  children, // 현재 페이지의 내용이 들어오는 영역
}: {
  children: React.ReactNode; // children에 React 요소가 들어올 수 있도록 타입 지정
}) {
  return (
    <html
      lang="ko" // HTML 문서의 기본 언어를 한국어로 설정
      className={notoSansKr.variable} // Noto Sans KR 폰트의 CSS 변수를 html에 적용
    >
      <body>
        {children} {/* 현재 페이지의 실제 내용을 body 안에 표시 */}
      </body>
    </html>
  );
}
