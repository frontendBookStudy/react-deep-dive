# 08장: 좋은 리액트 코드 작성을 위한 환경 구축하기

# 8.1 ESLint를 활용한 정적 코드 분석

정적 코드 분석
코드의 실행과는 별개로 코드 그 자체만으로 코드 스멜(잠재적으로 버그를 야기할 수 있는 코드)를 찾아내어 문제의 소지가 있는 코드를 사전에 수정하는 것
자바스크립트 생태계에서 가장 많이 사용되는 정적 코드 분석 도구는 ESLint다

ESLint
자바스크립트 코드를 정적 분석해 잠재적인 문제를 발견하고 나아가 수정까지 도와주는 도구
ESLint는 기본값으로 espree를 사용한다
자바스크립트 파일을 espree로 분석하면 JSON 형태로 구조화된 결과를 얻을 수 있다
espree 같은 코드 분석 도구는 단순히 변수인지, 함수인지, 함수명은 무엇인지 등만 파악하는 것이 아니라 코드의 정확한 위치와 같은 아주 세세한 정보도 분석해 알려준다
@typescript-eslint/typescript-estree
ESLint가 espree로 코드를 분석한 결과를 바탕으로, 어떤 코드가 잘못된 코드이며 어떻게 수정해야 할지도 정해야 한다
이를 ESLint 규칙(rules)이라고 하며, 특정한 규칙의 모음을 plugins라고 한다

eslint-plugin이라는 접두사로 시작하는 플러그인은 규칙들을 모아놓은 패키지다
eslint-config는 이러한 eslint-plugin을 한데 묶어서 완벽하게 한 세트로 제공하는 패키지다
여러 프로젝트에 걸쳐 동일하게 사용할 수 있는 ESLint 관련 설정을 제공할 수 있다

eslint-config-airbnb
@titicaca/triple-config-kit

ESLint 규칙 만들기
1 이미 존재하는 규칙을 커스터마이징해서 적용하기
2 완전히 새로운 규칙 만들기
규칠을 만든 후 ESLint를 실행하면 코드에서 에러가 발생하고, ESLint 설정이 추가돼 있는 코드 에디터에서도 해당 규칙이 적용되어 에러가 발생한다
규칙은 하나씩 만들어 배포하는 것은 불가능하며, 반드시 eslint-plugin 형태로 규칙을 묶음으로 배포하는 것만 가능하다

prettier는 코드의 포메팅을 도와주는 도구다
ESLint는 코드의 잠재적인 문제가 될 수 있는 부분을 분석해 준다면, Prettier는 포매팅과 관련된 작업, 즉 줄바꿈, 들여쓰기, 작은따옴표와 큰따옴표 등을 담당한다
서로 충돌을 방지하는 방법
1 서로 규칙이 충돌되지 않게끔 규칙을 잘 선언한다
2 자바스크리비트나 타입스크립트는 ESLint에, 그 외의 파일(마크다운, YAML, JSON 등)은 모두 Prettier에게 맡긴다
eslint-plugin-prettier는 Prettier에서 제공하는 모든 규칙을 ESLint에서 사용할 수 있는 규칙으로 만들어둔 플러그인이다

만약 일부 코드에서 특정 규칙을 임시로 제외시키고 싶다면 eslint-disable- 주석을 사용하면 된다
특정 줄만 제외하거나, 파일 전체를 제외하거나, 특정 범위에 걸쳐 제외하는 것이 가능하다
eslint-disable을 많이 사용하고 있다면 그렇게 무시하는 것이 옳은지, 아니면 해당 규칙을 제거하는 것이 옳은지 꼭 점검해 봐야 한다

설치하고자 하는 eslint-confit, eslint-plugin이 지원하는 ESLint 버전을 확인하고, 또 설치하고자 하는 프로젝트에서 ESLint 버전을 어떻게 지원하고 있는지 살펴봐야 한다
ESLint 공식 문서에서 ESLint 의존성은 peerDependencies로 명시하도록 권장하고 있다

ESLint가 제공하는 기능은 강력하고 편리하며 개발자가 만든 지저분한 코드를 깔끔하게 정리하는 등 강력한 기능을 제공한다
사용자 지정 룰을 생성해 프로젝트 전반에 걸쳐 준수하고자 하는 규칙도 ESLint의 도움을 얻어 손쉽게 일관성을 유지할 수 있다
또한 일관된 코딩 스타일을 유지할 수 있도록 도와준다

## 8.2 리액트 팀이 권장하는 리액트 테스트 라이브러리

테스트라는 개발자가 만든 프로그램이 코딩을 한 의도대로 작동하는지 확인하는 일련의 작업이다
처음에 설계한 대로 프로그램이 작동하는지 확인할 수 있고, 버그를 사전에 방지할 수도 있으며, 이후에 잘못된 작동으로 인해 발생하는 비용을 줄일 수도 있다

백엔드 테스트 vs 프론트엔드 테스트
백엔드 테스트는 일반적으로 서버나 데이터베이스에서 원하는 데이터를 올바르게 가져올 수 있는지, 데이터 수정 간 교착 상태나 경쟁 상태가 발생하지는 않는지, 데이터 손실은 없는지, 특정 상황에서 장애가 발생하지 않는지 등을 확인하는 과정이 주를 이룬다
백엔드 테스트는 화이트박스 테스트로 작성한 코드가 의도대로 작동하는 지 확인해야 한다

프론트엔드 테스트는 일반적인 사용자와 동일하거나 유사한 환경에서 수행된다
사용자가 프로그램에서 수행할 주요 비즈니스 로직이나 모든 경우의 수를 고려해야 하며, 이 과정에서 사용자는 굳이 프론트엔드 코드를 알 필요는 없다
즉 블랙박스 형태로 테스트가 이뤄지며, 코드가 어떻게 됐든 상관없이 의도한 대로 작동하는지 확인하는 데 좀 더 초점이 맞춰져 있다

React Testing Library
DOM Testing Library를 기반으로 만들어진 테스팅 라이브러리로 리액트를 기반으로 한 테스트를 수행하기 위해 만들어졌다
DOM Testing Library는 jsdom을 기반으로 하고있다
jsdom이란 순수하게 자바스크립트로 작성된 라이브러리로 HTML이 없는 자바스크립트만 존재하는 환경, 예를 들어 Node.js 같은 환경에서 HTML과 DOM을 사용할 수 있도록 해주는 라이브러리다
DOM Testing Library에서 제공하는 API를 사용해 테스트를 수행할 수 있다
jsdom을 사용하면 마치 HTML이 있는 것처럼 DOM을 불러오고 조작할 수 있다

리액트 테스팅 라이브러리를 활용하면 실제로 리액트 컴포넌트를 렌더링하지 않고도, 즉 브러우저를 직접 실행해 눈으로 확인하지 않아도 리액트 컴포넌트가 원하는 대로 랜더링되고 있는지 확인할 수 있다
컴포넌트뿐만 아니라 Provider, 훅 등 리액트를 구성하는 다양한 요소들을 테스트할 수 있다

테스트 코드란 내가 작성한 코드가 내가 코드를 작성했던 당시의 의도와 목적에 맞는지 확인하는 코드를 의마한다

기본적인 테스트 코드를 작성하는 방식
1 테스트할 함수나 모듈을 선정한다
2 함수나 모듈이 반환하길 기대하는 값을 적는다
3 함수나 모듈의 실제 반환 값을 적는다
4 3번의 기대에 따라 2번의 결과가 일치하는지 확인한다
5 기대하는 결과를 반환한다면 테스트는 성공이며, 만약 기대와 다른 결과를 반환하면 에러를 던진다

assert
테스트 코드가 예상대로 작동한다고 주장하는 코드를 작성하면 이 코드의 성공 여부에 따라 테스트 통과 또는 실패를 반환한다

일반적으로 테스트 코드와 실제 코드는 분리해 작성한다

테스트 결과를 확인할 수 있도록 도와주는 라이브러리를 어설션(assertion) 라이브러리라고 한다

테스트 코드는 가능한 한 사람이 읽기 쉽게, 그리고 테스트의 목적이 분명하게 작성되는 것이 중요하다
좋은 테스트 코드는 다양한 테스트 코드가 작성되고 통과하는 것 뿐만 아니라 어떤 테스트가 무엇을 테스트하는지 일목요연하게 보여주는 것도 중요하다

테스트의 기승전결을 완성해 주는 것이 바로 테스팅 프레임워크다
테스팅 프레임워크들을 어설션을 기반으로 테스트를 수행하며, 여기에 추가로 테스트 코드 작성자에게 도움이 될 만한 정보를 알려주는 역살도 함께 수행한다

Jest의 경우 자체적으로 제작한 expect 패키지를 사용해 어설션을 수행한다
테스트를 실행하는 콘솔에서 볼 수 있는 테스트 관련 정보가 한층 다양해진다
무엇을 테스트했는지, 소요된 시간은 어느 정도인지, 무엇이 성공하고 실패했는지, 전체 결과는 어떤지에 대한 자세한 정보를 확인할 수 있다
Jest를 비롯한 테스팅 프레임워크에는 글로벌(Global)이라는 실행 시에 전역 스코프에 기본적으로 넣어주는 값들이 있다
그리고 이 값을 실제 테스트 직전에 미리 전역 스코프에 넣어준다

리액트에서 컴포넌트 테스트는 다음과 같은 순서로 진행된다
1 컴포넌트를 렌더링한다
2 필요하다면 컴포넌트에서 특정 액션을 수행한다
3 컴포넌트 렌더링과 2번의 액션을 통해 기대하는 결과와 실제 결과를 비교한다

리액트 컴포넌트에서 테스트하는 일반적인 시나리오는 특정한 무언가를 지닌 HTML 요소가 있는지 여부다
getBy
FindBy
QueryBy

정적 컴포넌트, 즉 별도의 상태가 존재하지 않아 항상 같은 결과를 반환하는 컴포넌트를 테스트하는 방법
테스트를 원하는 컴포넌트를 렌더링한 다음, 테스트를 원하는 요소를 찾아 원하는 테스트를 수행하면 된다

동적인 컴포넌트를 테스트하는 방법
리액트 테스팅 라이브러리에서 사용자의 입력을 흉내 내고, 또 state의 변화에 따른 컴포넌트의 변화를 테스트한다

비동기 이벤트 특히 자주 사용되는 fetch가 실행되는 컴포넌트를 테스트하는 방법
jest.spyOn 등을 활용해서 fetch를 모킹한다
MSW(Mock Service Worker)는 Node.js나 브라우저에서 모두 사용할 수 있는 모킹 라이브러리
브라우저에서는 서비스 워커를 활용해 실제 네트워크 요청을 가로채는 방식으로 모킹을 구현한다
Node.js 환경에서는 https나 XMLHttpRequest의 요청을 가로채는 방식으로 작동한다
Node.js나 브라우저에서는 fetch 요청을 하는 것과 동일하게 네트워크 요청을 수행하고, 이 요청을 중간에 MSW가 감지하고 미리 준비한 모킹 데이터를 제공하는 방식이다
MSW를 사용한 fetch 응답 모킹과 findBy를 활용해 비동기 요청이 끝난 뒤에 제대로 된 렌더링이 일어났는지 기다린 후에 확인한다

react-hooks-testing-library를 활용하여 훅을 더욱 편리하게 테스트할 수 있다
굳이 테스트를 위한 컴포넌트를 만들지 않아도 훅을 간편하게 테스트할 수 있다
renderHook 함수에서 훅을 편리하게 테스트하기 위한 rerender, unmount 등의 함수도 제공하므로 사용자 정의 훅을 테스트할 때 유용하다

테스트 커버리지가 높을수록 좋고 꾸준히 테스트 코드를 작성해야 한다
TDD(Test Driven Development) 테스트 주도 개발
테스트 코드를 작성하기 전에 생각해 봐야 할 최우선 과제는 애플리케이션에서 가장 취약하거나 중요한 부분을 파악하는 것이다
애플리케이션에서 가장 핵심이 되는 부분부터 먼저 테스트 코드를 하나씩 작성해 나가는 것이 중요하다
테스트 코드는 개발자가 단순 코드 작성만으로는 쉽게 이룰 수 없는 목표인 소프트웨어 품질에 대한 확신을 얻기 위해 작성하는 것이다

테스트 종류
유닛 테스트(Unit Test): 각각의 코드나 컴포넌트가 독립적으로 분리된 환경에서 의도된 대로 정확히 작동하는지 검증하는 테스트
통합 테스트(Integration Test): 유닛 테스트를 통과한 여러 컴포넌트가 묶여서 하나의 기능으로 정상적으로 작동하는지 확인하는 테스트
엔드 투 엔드 테스트(End to End Test): 흔히 E2E 테스트라 하며, 실제 사용자처럼 작동하는 로봇을 활용해 애플리케이션의 전체적인 기능을 확인하는 테스트

리액트 테스팅 라이브러리는 유닛 테스트 내지는 통합 테스트를 도와주는 도구이며 E2E 테스트를 수행하려면 Cypress 같은 다른 라이브러리의 힘을 빌려야 한다

테스트가 이뤄할 목표는 애플리케이션이 비즈니스 요구사항을 충족하는지 확인하는 것이다
