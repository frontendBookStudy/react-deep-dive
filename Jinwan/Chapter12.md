## 12장 모든 웹 개발자가 관심을 가져야 할 핵심 웹 지표

### 핵심 웹 지표란

구글이 핵심 웹 지표로 꼽는 지표

- 최대 콘텐츠물 페인트(LCP: Largest Conlentful Paint)

- 최초 입력 지연(FID: First Input Delay)

- 누적 레이아웃 이동 (CLS: Cumulative Layout Shift)

- 최초 바이트 까지의 시간 (TTFB:TimeToFirslByte)

- 최초 콘텐츠풀 시간 (FCP: Firsl Conlentful Paint)

### LCP

LCP(Largest Contentful Paint)란 ‘페이지가 처음으로 로드를 시작한 시점부터 뷰포트 내부에서 가장 큰 이미지 또는 텍스트를 렌더링하는 데 걸리는 시간’임.

LCP에서 좋은 점수는 2.5초 내로 응답이 오는 것이고, 4초 이내는 보통, 그 이상은 나쁨으로 판단

조율을 통해 가능하다면 이미지보다 텍스트로 뷰포트 최대 영역을 채우는 것이 가장 좋음

### FID

웹페이지의 로딩 속도만큼 중요한 것이 웹사이트의 반응 속도인데, 이런 웹사이트의 반응성을 측정하는 지표가 바로 최초 입력 지연(FID). 사용자가 페이지와 처음 상호 작용할 때부터 해당 상호 작용에 대한 응답으로 브라우저가 실제로 이벤트 핸들러 처리를 시작하기까지 시간을 측정

#### 개선

- 클라이언트에서 처리해야 되는지 생각해보고, 서버에서 처리하면 상대적으로 빠르고 쾌적하게 처리하면서 메인 스레드를 오래 점유하지 않아도 됨.
- 긴 작업을 여러 개로 분리 : 반드시 클라이언트에서 처리해야 하는 작업이라면 여러 개로 분리하는 것이 좋음.

### CLS

페이지의 생명주기 동안 발생하는 모든 예기치 않은 이동에 대한 지표를 계산하는 것이 누적 레이아웃 이동(CLS).

#### 개선

- 삽입이 예상되는 요소를 위한 추가적인 공간 확보
- 폰트 로딩 최적화
- 적절한 이미지 크기 설정

## 14. 리액트와 웹 페이지 보안 이슈

### 1. 리액트에서 발생하는 크로스 사이트 스크립팅(XSS)

#### 1. dangerouslySetInnerHTML prop

- JSX는 기본적으로 이스케이프 작업을 수행하지만, dangerouslySetInnerHTML는 별도의 검증이 필요하다.

#### 2. useRef를 활용한 직접 삽입

- `ref.current.innerHTML = html`처럼 html을 직접 조작하는 경우 보안 취약점이 있는 스크립트가 삽입될 우려가 있다.

#### 3. 리액트에서 XSS 문제를 피하는 방법

- 제3자가 삽입할 수 있는 HTML을 안전한 HTML 코드로 치환하는 것이다.
- 새니타이즈(sanitize) 또는 이스케이프(escape)라고 한다.
- 이러한 과정은 서버에서 처리하는 것이 좋다. 모든 데이터가 프론트를 거쳐서 들어오는 것은 아니기 때문이다.
- 관련 라이브러리는 다음과 같다.
  - DOMpurity
  - sanitize-html
  - js-xss

### 2. getServerSideProps와 서버 컴포넌트의 주의사항

- getServerSideProps가 반환하는 모든 prop은 외부에 노출된다.
- 뿐만 아니라 서버 컴포넌트가 클라이언트 컴포넌트에 반환하는 값도 주의해야 한다.

### 3. anchor 태그 값의 제한

- 사용자가 입력한 주소로 이동하는 경우 새니타이즈 과정이 필요하다.
- 피싱 사이트로 이동하는 것을 막기 위해 origin도 확인해 처리하는 것이 좋다?

### 4. HTTP 보안 헤더

#### 1. Strict-Transport-Security

- http로 요청해도 https로 이동

#### 2. X-XSS-Protection

- 비표준 기술
- XSS 취약점이 발견되면 페이지 로딩을 중단

#### 3. X-Frame-Options

- frame, iframe, embed, object 내부에서 렌더링을 허용할지 결정
- 제3의 페이지에서 `<iframe>`으로 삽입되는 것을 막을 수 있음

#### 4. Permissions-Policy

- 브라우저의 기능이나 API를 선택적으로 활성화

#### 5. X-Content-Type-Options

- MIME 타입을 브라우저에서 추측하지 않고, 서버에서 명시적으로 선언된 Content-Type 헤더 값을 따름

#### 6. Referrer-Policy

- 현재 웹사이트에서 다른 웹 사이트로 어떤 정보를 referer로 전달할지 결정

#### 7. Content-Security-Policy

- 웹 사이트에서 실행할 수 있는 콘텐츠의 종류를 제한

#### 8. 보안 헤더 설정하기

- Next.js에서는 next.config.js에 `headers()`를 정의할 수 있다.
