"use client";

// 이 컴포넌트는 브라우저에서 실행되는 Client Component입니다.
// useSearchParams() 같은 브라우저용 Hook을 사용하기 때문에 필요합니다.

import Link from "next/link";
// Next.js의 Link 컴포넌트입니다.
// 탭을 클릭했을 때 페이지를 이동시키는 역할을 합니다.

import { useSearchParams } from "next/navigation";
// 현재 브라우저 URL의 Query String을 읽을 수 있는 Hook입니다.
// 예: /?filter=active → "active"를 읽을 수 있습니다.

import type { TodoFilter } from "@/lib/data";
// TodoFilter는 실제 데이터가 아니라 TypeScript의 타입입니다.
// 따라서 import 앞에 type을 붙였습니다.

import styles from "./FilterTabs.module.css";
// 이 컴포넌트에서 사용하는 CSS Module입니다.


// 탭 하나가 어떤 형태의 데이터를 가져야 하는지 정의합니다.
type TabItem = {
  // 사용자에게 화면으로 보여줄 글자입니다.
  // 예: "전체", "진행중", "완료"
  label: string;

  // 실제 필터 값입니다.
  // TodoFilter 타입에 정의된 값만 사용할 수 있습니다.
  value: TodoFilter;
};


// 화면에 표시할 탭 목록입니다.
// 배열로 만들어 놓았기 때문에 아래에서 map()으로 탭을 반복해서 만들 수 있습니다.
const TABS: TabItem[] = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];


// FilterTabs 컴포넌트입니다.
export default function FilterTabs() {

  // 현재 브라우저 URL의 Query String을 읽습니다.
  // 예: /?filter=active → searchParams에서 filter 값을 가져올 수 있습니다.
  const searchParams = useSearchParams();

  // URL에서 filter 값을 가져옵니다.
  // 예: /?filter=completed → "completed"
  // filter가 없으면 null이 나오므로 기본값으로 "all"을 사용합니다.
  // "as TodoFilter"는 TypeScript에게 이 값이 TodoFilter 타입이라고 알려줍니다.
  const currentFilter = (searchParams.get("filter") as TodoFilter) || "all";

  // 실제 화면에 렌더링할 JSX를 반환합니다.
  return (
    // 탭 전체를 감싸는 nav 태그입니다.
    <nav className={styles.tabs}>

      // TABS 배열의 각 항목을 하나씩 꺼내서 탭을 만듭니다.
      {TABS.map((tab) => {

        // 현재 URL의 filter 값과 현재 탭의 value가 같은지 확인합니다.
        // 같으면 현재 선택된 탭입니다.
        const isActive = currentFilter === tab.value;

        // 탭을 클릭했을 때 이동할 URL을 만듭니다.
        // 전체 탭 → /
        // 진행중 탭 → /?filter=active
        // 완료 탭 → /?filter=completed
        const href = tab.value === "all" ? "/" : `/?filter=${tab.value}`;

        // map()에서 만든 탭 하나를 반환합니다.
        return (
          <Link
            // React가 반복되는 요소를 구분할 수 있도록 고유한 key를 지정합니다.
            key={tab.value}

            // 클릭했을 때 이동할 URL입니다.
            href={href}

            // 현재 선택된 탭이면 tabActive CSS를 적용하고,
            // 선택되지 않은 탭이면 일반 tab CSS를 적용합니다.
            className={isActive ? styles.tabActive : styles.tab}
          >
            // 실제 화면에 "전체", "진행중", "완료"가 표시됩니다.
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
