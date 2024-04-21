# 09장: 모던 리액트 개발 도구로 개발 및 배포 환경 구축하기

## 9.1 Next.js 로 리액트 개발 환경 구축하기

create-react-app create-next-app
리액트 애플리케이션과 Next.js 애플리케이션을 손쉽게 만들기 위한 CLI 도구

아무것도 없는 상태에서 리액트 프레임워크를 구축하는 방법

Package.json 만들기
npm init을 실행하면 package.json을 만드는 CLI를 실행할 수 있다

react, react-dom, next 설치하기

Typescript, @types/react, @types/react-dom, @types/node, eslint, eslint-config-next 설치하기

tsconfig.json 작성하기
타입스크립트 코드를 작성하기 위해 설정 추가
CompilerOptions: 타입스크립트를 자바스크립트로 컴파일할 때 사용하는 옵션
target: 타입스크립트가 변환을 목표로 하는 언어의 버전
lib
allowJs: 타입스크립트가 자바스크립트 파일 또한 컴파일할지를 결정
skipLibCheck: 라이브러리에서 제공하는 d.ts에 대한 검사 여부를 결정
strict: 타입스크립트 컴파일러의 엄격 모드를 제어
forceConsistentCasingInFileNames: 파일 이름의 대소문자를 구분하도록 강제
noEmit: 컴파일을 하지 않고 타입 체크만 한다
esModuleInterop: CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올 수 있게 해준다
module: 모듈 시스템을 설정한다
ModuleRedolution: 모듈을 해석하는 방식을 설정한다
ResolveJsonModule: JSON 파일을 import 할 수 있게 해준다
IsolateModules: 타입스크립트 컴파일러는 파일에 import나 export가 없다면 단순 스크립트 파일로 인식해 이러한 파일이 생성되지 않도록 막는다
Jsx: .tsx 파일 내부에 있는 JSX를 어떻게 컴파일할지 설정한다
incremental: 이 옵션이 활성화되면 타입스크립트는 마지막 컴파일 정보를 .tsbuildinfo 형태로 만들어 디스크에 저장한다
BaseUrl: 모듈을 찾을 때 기준이 되는 디렉터리를 지정한다
Paths: 경로에 별칭(alias)을 지정할 수 있다
include: 타입르크립트 컴파일 대상에서 포함시킬 파일 목록을 의미한다
exclude: 타입스크립트 컴파일 대상에서 제외시킬 파일 목록을 의미한다

next.config.js 작성하기
Next.js 설정 추가
reactStrictMode: 리액트의 엄격 모드를 활성화한다
poweredByHeader: X-Powered-By 헤더를 제거한다
eslint.ignoreDuringBuilds: 빌드 시에 ESLint를 무시한다

ESLint와 Prettier 설정하기
@titicaca/eslint-config-triple
Eslint-config-next와 eslint-config-triple이 함게 작동하게 하려면 별도의 설정이 필요하다
extends에 next/core-web-vitals를 추가하면 두 가지 설정이 모두 적용된다

스타일 설정하기
Next.js에 스타일을 적용하기 위해 styled-components를 사용한다
swc에 styled-components를 사용한다는 것을 알리기 위해 styledComponents: true를 next.config.js에 추가한다
pages/_document.tsx의 Head에 styled-components를 사용하기 위한 ServerStyleSheet를 추가한다

애플리케이션 코드 작성하기
Pages: Next.jss에서 예약어로 지정해두고 사용하는 폴더로, 이 폴더 하위의 내용은 모두 실제 라우터가 된다
components: 페이지 내부에서 사용하는 컴포넌트를 모아둔 폴더
Hooks: 직접 만든 훅을 모아둔 폴더
types: 서버 응답 타입 등 공통으로 사용하는 타입을 모아둔 폴더
utils: 애플리케이션 전역에서 공용으로 사용하는 유틸성 파일을 모아둔 폴더
Next.js 애플리케이션의 폴더 구조는 src/pages 하단에 실제 페이지 라우팅고 고나련된 파일을 기재해야 한다

Next.js 프로젝트 실행, 빌트, 린트와 관련된 명령어를 package.json에 기재하기


## 9.2 깃허브 100% 활용하기

CI: 코드의 변화를 모으고 고나리하는 코드 중앙 저장소에서, 여러 기여자가 기여한 코드를 지속적으로 빌드하고 테스트해 코드의 정합성을 확인하는 과정
저장소에서 코드의 변화가 있을 때마다 전체 소프트웨어의 정합성을 확인하기 위한 작업을 자동으로 실행해야 한다
테스트, 빌드, 정적 분석, 보안 취약점 분석 등

깃허브 액션
깃허브를 둘러싼 다양한 이벤트를 기반으로 깃허브에서 제공하는 가상 환경에서 사용자가 원하는 작업을 수행할 수 있도록 도와주는 서비스
깃허브 액션을 사용해 CI를 구축할 수 있다
러너(runner): 파일로 작성된 깃허브 액션이 실행되는 서버
액션(action): 러너에서 실행되는 하나의 작업 단위
이벤트(event): 깃허브 액션의 실행을 일으키는 이벤트
잡(jobs): 하나의 러너에서 실행되는 여러 스텝의 모음
스텝(steps): 잡 내부에서 일어나는 하나하나의 작업
액션을 작성하려면 저장소의 루트에 .github/workflows 폴더를 생성하고 내부에 yaml 파일을 작성한다

브랜치 보호 규칙(branch protection rule)
기본 브랜치에는 항상 테스트, 빌드와 같은 CI가 성공한 코드만 푸시될 수 있어 코드의 정합성을 확보할 수 있다

깃허브에서 제공하는 기본 액션을 사용할 수 있다
actions/checkout
Actions/setup-node
Actions/github-script
Actions/stale
Actions/dependency-review-action
GitHub/codeql-action
Calibreapp/image-actions
Lirantal/is-website-vulnerable

Lighthouse CI
구글에서 제공하는 액션
웹 선을 지표인 라이트하우스를 CI를 기반으로 실행할 수 있는 도와주는 도구
현재 머지 예정인 웹사이트의 성능 지표를 측정할 수 있다

깃허브 Dependabot으로 보안 취약점 해결하기
의존성에 문제가 있다면 이에 대해 문제를 알려주고 가능하다면 해결할 수 있는 풀 리퀘스트까지 열어준다

버전
Major(주 버전): 기존 버전과 호환되지 않게 API가 바뀌는 경우 올림
Minor(부 버전): 기존 버전과 호환되면서 새로운 기능을 추가하는 경우 올림
Patch(수 버전): 기존 버전과 호환되면서 버그를 수정한 경우 올림
버전은 어디까지나 개발자들 간의 약속일 뿐, 정말로 해당 API의 버전이 이 버전에 맞춰 구현되어 있는지는 알수 없다

의존성
package.json에서 dependencies란 npm 프로젝트를 운영하는 데 필요한 자신 외의 npm 라이브러리를 정의해둔 목록
dependencies: 해당 프로젝트를 실행하는 데 꼭 필요한 패키지
devDependencies: 해당 프로젝트를 실행하는 데는 필요하지 않지만 개발 단계에서 필요한 패키지
peerDependencies: 라이브러리와 패키지에서 자주 쓰이는 단위

의존성에 숨어있는 잠재적인 위협을 깃허브를 통해 확인하고 조치하는 방법
See Dependabot alerts

취약점을 수정하는 방법
패키지 내부에 선언된 의존성을 강제로 올릴 수 있는 방법은 npm이 제공하는 overrides를 활용하는 것이다. package.json에 overrides를 선언해 두면 패키지 내부의 버전을 강제로 올릴 수 있다

의존성 관련 이슈를 방지하는 가장 좋은 방법은 의존성을 최소한으로 유지하는 것이다
가능한 한 내재화할 수 있는 모듈은 내재화하고, 의존성을 최소한으로 유지하는 것이 좋다

## 9.3 리액트 애플리케이션 배포하기

코드가 실제로 사용자에게 제공되려면 실제 인터넷 망에 배포하는 과정이 필요하다
클라우드 서비스를 활용

Netilify
Vercel
DigitalOcean

## 9.4 리액트 애플리케이션 도커라이즈하기

애플리케이션을 하나의 컨테이너로 만들어서 빠르게 배포하는 것이 일반적이다
이 컨테이너를 만드는 데 사용되는 것이 바로 도커(Docker)다
도커는 서비스 운영에 필요한 애플리케이션을 격리해 컨테이너로 만드는데 이용하는 소프트웨어다
도커는 애플리케이션을 빠르게 배포할 수 있도록 애플리케이션을 컨테이너라는 단위로 패키징하고 이 컨테이너 내부에서 애플리케이션이 실행될 수 있도록 도와준다
이 컨테이너를 바탕으로 독립된 환경에서 애플리케이션이 항상 일관되게 실행할 수 있도록 보장해준다

이미지: 컨테이너를 만드는 데 사용되는 템플릿
컨테이너: 도커의 이미지를 실행한 상태
Dockerfile: 어떤 이미지 파일을 만들지 정의하는 파일
태그: 이미지를 식별할 수 있는 레이블 값
리포지터리: 이미지를 모아두는 저장소
레지스트리: 리포지터리에 접근할 수 있게 해주는 서비스

docker build: Dockerfile을 기준으로 이미지를 빌드하는 작업
docker push: 이미지나 리포지터리를 도커 레지스트리에 업로드하는 과정
docker tag: 이미지에 태그를 생성
docker inspect: 이미지나 컨테이너의 세부 정보를 출력
docker run: 이미지를 기반으로 새로운 컨테이너를 생성
docker ps: 현재 가동 중인 컨테이너 목록을 확인
docker rm: rm {이미지명}으로 컨테이너를 삭제

도커로 만든 이미지 배포하기
도커 이미지도 도커 허브라고 하는 공간에 업로드할 수 있다
Cloud Run은 푸시된 이미지를 클라우드 환경에서 손쉽게 실행할 수 있도록 도와주는 서비스다

