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


const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Todo App",
    template: "%s | Todo App",
  },
  description: "Next.js App Router로 만드는 학습용 Todo 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>{children}</body>
    </html>
  );
}
