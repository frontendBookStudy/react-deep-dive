# 13장: 웹페이지의 성능을 측정하는 다양한 방법

## 13.1 애플리케이션에서 확인하기

### React (create-react-app)

- reportWebVitals
    - 웹에서 성능을 측정하기 위한 함수
    - 누적 레이아웃 이동(CLS), 최초 콘텐츠풀 페인트(FCP), 최초 콘텐츠 페인팅(LCP), 첫 바이트까지의 시간(TTFB)을 측정하는 용도로 사용
    - web-vitals 라이브러리를 사용하여 측정
    - PerformanceObserver API를 사용한다
        - 브라우저에서 웹페이지의 성능을 측정하기 위해 사용

### Next.js (create-next-app)

- NextWebVitalsMetric
    - Next.js에서 제공하는 성능 측정 도구
    - 기본적인 핵심 웹 지표 외에도 Next.js에 특화된 사용자 지표도 제공한다
        - Next.js-hydration: 페이지가 서버 사이드에서 렌더링되어 하이드레이션하는 데 걸린 시간
        - Next.js-route-change-to-render: 페이지가 경로를 변경한 후 페이지를 렌더링을 시작하는 데 걸리는 시간
        - Next.js-render: 경로 변경이 완료된 후 페이지를 렌더링하는 데 걸린 시간
