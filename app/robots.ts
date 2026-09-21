// [10단계 메모]
// - 파일명 robots.ts 컨벤션 - "/robots.txt" 경로에 자동으로 응답합니다.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}
