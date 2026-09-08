import type { Metadata } from "next";
import "./globals.css";

// [1단계 메모]
// - 이 파일은 "루트 레이아웃"이라고 부르며, app/ 디렉토리 안의 모든 페이지를 감싸는 공통 껍데기입니다.
// - Next.js 규칙: app/layout.tsx 는 반드시 <html>, <body> 태그를 포함해야 합니다.
//   (Vue2였다면 App.vue의 <router-view/>를 감싸는 최상위 템플릿과 비슷한 역할)
// - children 자리에 각 라우트의 page.tsx 내용이 끼워집니다.
// - next/font, generateMetadata 등 최적화/SEO 관련 기능은 10단계에서 이 파일에 추가할 예정입니다.
//   지금은 구조만 잡는 단계라 최소한의 metadata만 넣어둡니다.

export const metadata: Metadata = {
  title: "Todo App",
  description: "Next.js App Router로 만드는 학습용 Todo 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}