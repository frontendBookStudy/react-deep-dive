## 13장 웹페이지의 성능을 측정하는 다양한 방법

### 애플리케이션에서 확인하기

#### create-react-app

`reportWebVitals`를 사용해서 성능 측정 가능. `PerformanceObserver`를 사용해서 측정함. 이 API를 제공하지 않는다면 web-vitals의 도움을 받을 수 없다.

CLS, FID, FCP, LCP, TTFB 등을 측정할 수 있다.

#### create-next-app

`NextWebVitalsMetric`을 제공. Next.js에 특화된 사용자 지표도 제공

- Next.js-hydration : 하이드레이션 하는 데 걸린 시간
- Next.js-route-change-to-render : 페이지 경로 변경 후 페이지 렌더링을 시작하는 데 걸리는 시간
- Next.js-render : 경로 변경 완료 후 페이지를 렌더링 하는 데 걸리는 시간

### 구글 라이트 하우스

구글에서 제공하는 웹 페이지 성능 측정 도구. 가급적 시크릿 모드로 창을 열어 실행하는 것을 권장.

성능, 접근성, 권장사항, 검색엔진 최적화, PWA 의 성능 지표를 수치로 알 수 있음.

### WebPageTest

웹 사이트 성능을 분석하는 도구로 가장 널리 알려진 도구.

- Site Performance : 웹사이트 성능 분석을 위한 도구
- Core Web Vitals: 웹사이트의 핵심 웹 지표를 확인하기 위한 도구
- Lighthouse : 구글 라이트 하우스 도구
- Visual Comparison : 2개 이상의 사이트를 동시에 실행해 시간의 흐름에 따른 로딩 과정을 비교하는 도구
- Traceroute : 네트워크 경로를 확인하는 도구
