// [10단계 메모]
// - 파일명 robots.ts 컨벤션 - "/robots.txt" 경로에 자동으로 응답합니다.

import type { MetadataRoute } from "next";

// robots.txt의 내용을 정의하는 함수
export default function robots(): MetadataRoute.Robots {
  return {
    // 검색엔진 크롤러에 대한 접근 규칙
    rules: {
      // 모든 검색엔진 크롤러에 적용
      userAgent: "*",

      // 사이트의 모든 경로에 대한 크롤링 허용
      allow: "/",
    },

    // 검색엔진에게 사이트맵 위치를 알려줌
    sitemap: "https://example.com/sitemap.xml",
  };
}
