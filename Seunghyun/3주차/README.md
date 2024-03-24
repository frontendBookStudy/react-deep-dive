# 🐻 04. 서버 사이드 렌더링




## 책 내용 정리

- 4.1 서버 사이드 렌더링이란?
    - SPA의 세상
    - SSR이란?
    - SPA와 SSR을 모두 알아야 하는 이유
    - 정리
- 4.2 서버 사이드 렌더링을 위한 리액트 API살펴보기
    - renderToString
    - renderToStaticMarkup
    - renderToNodeStream
    - renderToStaticNodeStream
    - hydrate
    - 서버사이드 렌더링 예제 프로젝트
    - 정리
- 4.3 Next.js 톺아보기
    - Next.js란?
    - Next.js 시작하기
    - Data Fetching
    - 스타일 적용하기
    - _app.tsx 응용하기
    - next.config.js 살펴보기
    - 정리
---
 ### 4.1 서버사이드 렌더링이란?

 - SPA(Single Page Application) : 렌더링과 라우팅에 필요한 대부분의 기능을 서버강 아닌 브라우저의 자바스크립트에 의존하는 방식
    - 서버에서 html을 내려받지 않고 하나의 페이지에서 모든 작업을 처리한다.
    - body에는 자바스크립트 코드만 들어있으므로, 개발자도구 보기로 보면 <body>에는 렌더링된 html이 없다.
    - 페이지 전환 시 렌더링에 필요한 HTTP요청만을 보내고, 결과를 바탕으로 <body/> 내부에 DOM을 추가, 수정, 삭제하는 방법으로 페이지가 전환된다.
    - SPA의 가장 완벽한 앱 : Gmail..!

- JAM 스택의 유행
    - (JavaScript, API, Markup)

하지만, 좋아지는 데스크탑 성능에 비해 모바일 환경은 SPA을 빠르게 보여줄 정도로 성장하지 않았다. 자바스크립트 파싱을 위해 CPU를 소비하는 시간이 눈에 띄게 증가했음.

- SSR(Server Side Rendering) : 최초 사용자에게 보여줄 페이지를 서버에서  렌더링 해 빠르게 사용자에게 화면을 제공하는 방식. 웹페이지가 점점 느려지는 한계를 개선하기위해 도입,
    - 렌더링에 필요한 작업을 모두 서버에서 처리
    - 사용자기기의 영향을 안받고, 서버에서 데이터를 제공하기 때문에 비교적 안정적인 렌더링이 가능하다.


최초 페이지 렌더링을 서버에서 수행했을 때 장점
- 최초 페이지에 정보가 그려지는 시간(First Contentful Paint)이 SPA대비 빠르다. HTTP요청, HTML을 그리는 작업 모두 서버가 더 빠르기 때문.
- 검색엔진 & 메타데이터 제공이 쉽다
- 누적 레이아웃 이동이 적다
    - 덜컥 거리는 화면 : 로딩이 늦게되는 컴포넌트 때문에
    - SSR에서도 문제가 있는게, useEffect내의 작업에 영향받을 수 있음. api속도가 달랐을 때, 모든 요청이 완료되기 전까지 페이지가 렌더링 되지 않을 것이므로 최초 페이지 다운로드가 늦어질 수 있음
    - react18 스트림으로 해결
- 사용자 device 성능에 자유로움
- 보안에 좀더 안전

단점
- 소스코드 작성 시 서버를 고려해야 함
    - window, sessionStorage 등 브라우저 전역객체에 접근 할 수 없음 
- 적절한 서버가 구축되어 있어야 함.
    - 물리적인 가용량, 복구전략, 요청분산 등등
- 서비스 지연에 따른 문제
    - 어떠한 페이지도 제공할 수 없음
- 잘못된 설계는 관리포인트만 늘어날 수 있음


결론
SPA, SSR 모두 만능이 아니다.
- 가장 뛰어난 SPA > 가장 뛰어난 MPA(SSR)
- 보통의 SPA < 보통의 MPA(SSR)
- 요즘 SSR은 두 장점을 취한 방식으로 작동함
    - 최초 진입시에는 SSR 방식으로 HTML을 제공받음.
    - 이후엔 SPA 방식으로 작동

### 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기


#### renderToString VS renderToStaticMarkup

공 : 인수로 넘겨받은 리액트 컴포넌트를 렌더링 해 HTML 문자열로 반환하는 함수.<br>
차 : 순수한 HTML을 반환하는지의 여부. 추가적인 DOM 속성의(data-reactroot) 유무.


#### renderToString
- 서버 사이드 렌더링을 구현하는데 가장 기초적인 API
- hook & eventHandler는 string 결과물에 포함되지 않는다
- 브라우저가 빠르게 렌더링 할 수 있는 HTML커ㅁ포넌트를 제공하는데 목적이 있는 함수.
- 검색 엔진,메타 데이터 정보 제공에 유리
- 별도의 JS코드를 다운로드, 파싱, 실행하는 과정을 거쳐야 함
- data-reactroot : 이후에 자바스크립트를 실행하기 위한 hydrate 함수에서 루트를 식별하는 역할
```
const result = ReactDOMServer.renderToString(
    React.createElement('div',{id:'root'},<SampleComponent />),
)
///
<div id='root' data-reactroot="">
    <div>hello</div>
    <ul>
        <li>apple</li>
        <li>banana</li>
        <li>peach</li>
    </ul>
</div>

```

#### renderToStaticMarkup
- 완전히 순수한 HTML 문자열이 반환됨
- 브라우저 API실행 불가.

```
const result = ReactDOMServer.renderToStaticMarkup(
    React.createElement('div',{id:'root'},<SampleComponent />),
)
///
<div id='root'>
    <div>hello</div>
    <ul>
        <li>apple</li>
        <li>banana</li>
        <li>peach</li>
    </ul>
</div>

```

#### renderToNodeStream VS renderToStaticNodeStream

공: <br/>
차:

#### renderToNodeStream 
- 브라우저에서 사용이 완전히 불가(node.js 환경에 의존)
- Node.js의 ReadableStream을 반환함.(utf-8로 인코딩 된 바이트 스트림)<- 서버 환경에서만 사용가능