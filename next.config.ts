import type { NextConfig } from "next";

// Next.js 프로젝트의 설정을 정의하는 객체
const nextConfig: NextConfig = {
  // React Compiler를 활성화하면 React 코드를 자동으로 최적화할 수 있음
  reactCompiler: true,
};

// 위에서 만든 Next.js 설정을 외부에 내보냄
export default nextConfig;
