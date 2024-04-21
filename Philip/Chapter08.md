# 08장 좋은 리액트 코드 작성을 위한 환경 구축하기
## 08.01 ESLint를 활용한 정적 코드 분석
### 08.01.01 ESLint 살펴보기
동작 방식

- 자바스크립트 코드 문자열로 읽기
- 파서로 코드 구조화
- 구조화한 트리(AST)를 규칙과 대조
- 알림

파서의 실질적인 형태 :

```typescript
function hello(str) {}
```

```json
{
  "type": "Program",
  "start": 0,
  "end": 22,
  "range": [0, 22].
  "body": [
    {
      "type": "FunctionDeclaration",
      "start" 0
      ...
    }
  ]
}
```
위와 같은 형태로 변수/함수 여부, 함수명, 코드의 정확한 위치 등을 파악한다.

## 08.01.02 eslint-plugin과 eslint-coinfg

### eslint-plugin
eslin의 규칙을 모아놓은 패키지
프레임워크나 도메인과 관련된 규칙을 묶어서 제공한다.

### eslint-config
eslint-plugin 전체를 묶어놓은 패키지

### eslint-config-airbnb
에어비앤비에서 만든 eslint 설정

### eslint-config-next
Next.js 프레임워크 프로젝트에서 사용할 수 있는 eslint-config


## 08.01.03 나만의 ESLint 규칙 만들기

## 08.01.04 주의할 점
### Prettier와의 충돌
코드포맷터인 프리티어와 충돌을 일으킬 수 있다. 따라서 이 둘이 서로 충돌하지 않고록 설정해야한다. 그 방법으로는 다음과 같은 것이 있다.
- 규칙을 잘 설정한다.
- 적용의 영역을 달리 한다(JS/TS : ESLint, Markdown/YAML/JSON : Prettier)

### 규칙에 대한 예외처리
// eslint-disable-

구문을 사용하면 된다.

예시 : // eslint-disable-line no-exhaustive-deps

위 규칙은 의존성 배열을 요구하는 곳에서 배열을 제대로 선언했는지 체크한다.

이 규칙을 무시할 경우 다음과 같은 문제가 발생할 여지가 있다.(상태와 관계없는 작동, 너무 긴 내부함수, 불필요한 일회성 실행)

편하게 이러한 규칙을 예외처리하기보다는, 이러한 규칙이 발생시킬 수 있는 잠재적 위협을 확인한 후 해결하는 것이 낫다.

### ESLint 버전 충돌
패키지에서는 ESLint 의존성을 peerDependencies로 명시하도록 권장하고 있지만, 이러한 사항이 지켜지지 않는 경우 버전 충돌로 인해 정상적으로 작동하지 않을 수도 있다.

---
## 08.02 리액트 팀이 권장하는 리액트 테스트 라이브러리
백엔드는 로지컬하게 테스트가 다소 가지만, 프론트엔드 부분은 모든 사용자의 인터렉션을 예측할 수 없기 때문에 백엔드의 테스트와는 다소 다를 수 있다.

### 08.02.01 React Testing Library
jsdom을 이용하여 nodejs 환경에서 HTML과 DOM을 사용할 수 있따. 이를 통해 실제로 렌더링 하지 않고도 확인할 수 있다.

### 08.02.02 자바스크립트 테스트의 기초
모듈이나 함수 선정하여 기대값을 적고, 실행값이 일치하는지 확인하면 된다.

node.js에서는 assert라는 모듈을 제공하며, 이를 통해 실제로 잘 작동하는지 확인할 수 있다.

이러한 로직으로 테스트를 실행할 수 있게 만든 다양한 테스팅 프레임워크가 있는데, 여기엔 Jest, Mocha, Karma, Jasmine 등이 있다.

리액트에서도 Jest가 널리 사용된다.

```typescript
//math.js
export function sum(a,b) {
  return a+b;
}

//math.test.js
import { sum } from './math.js'

test('Sum Test', () => {
  expect(sum(1,2)).toBe(3);
})
```

### 08.02.03 리액트 컴포넌트 테스트 코드 작성하기
컴포넌트 테스트는 다음과 같은 순서로 진행된다.

- 컴포넌트를 렌더링한다.
- 컴포넌트에서 특정 액션을 수행한다.
- 컴포넌트 렌더링과 액션을 통해 기대하는 결과와 실제 결과를 비교한다.

```typescript
import { render, screen } from '@testing-library/react';

test('react test', () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
```
여기서 screen은 컴포넌트가 렌더링되는 테스트 환경으로 보이고, 여기에서 요소를 잡아내어 동작을 테스트 할 수 있는 것이다.

정적 컴포넌트는 매번 같은 요소를 반환하므로 테스트가 어렵지 않다.

동적 컴포넌트는 상태값이 존재하기 때문에, 인터렉션에 의해 경우의 수가 매우 다양해진다.

userEvent 등의 객체를 통해 사용자의 입력을 가상으로 진행하고 테스트할 수 있따.

비동기 이벤트를 처리하기 위해서는 MSW(Mock Service Worker)가 존재하는데, Node.js나 브라우저에서 사용할 수 있는 모킹 라이브러리로 fetch 요청과 동일하게 네트워크 요청을 수행하고, 그 요청을 중간에 MSW가 감지하고 준비한 모킹 데이터를 제공하는 방식이다. 

그 외에도 사용자 훅을 위한 테스트나, 여러가지 테스트들이 준비되어 있다.

---

Imagoworks의 경우 dev환경이 잘 제공되고 있고, HMR기능이 나날이 잘 되고 있어, 직접 사용자 인터페이스를 조작해가며 테스트할 수 있는 상황에서 프런트 테스트코드를 작성하는 것에 대한 효용성은 다소 의문이 든다. 전역 상태값이나 기타 여러가지 환경들을 실제 테스트환경에 맞추어 설정하는 것 또한 제법 어려울 것이라고 생각된다.