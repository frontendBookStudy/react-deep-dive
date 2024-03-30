# 05장 리액트와 상태관리 라이브러리
## 05.01 상태관리는 왜 필요한가?
상태가 있기 때문

### 05.01.01 리액트 상태관리의 역사
https://velog.velcdn.com/images/andy0011/post/4a1f159f-6972-4028-8a18-9a383cf5e44d/image.png
MVC 패턴에서 앱의 규모가 커짐에 따라, View와 Model이 \*..\* 관계로 맵핑되면서, 연결관계가 복잡해짐.

### Flux 패턴이 등장

**Action**
수행할 동작과 데이터의 집합
Type
Data

**Dispatcher**
액션을 스토어에 전달

**Store**
- 실제 상태값(데이터)
- 상태값을 업데이트 하기 위한 로직
    - Action.Data가 인자값
    - Action.Type에 따른 메서드가 인자값으로부터 상태값을 생성하는 리듀서가 된다.

**View**
- 상태값을 표현
- 상태값 업데이트에 따라 리렌더링 발생
- 액션을 발생시키는 창구 역할

이러한 로직은 useReducer에서 살펴볼 수 있다.
useReducer는 const [*state*,*dispatcher*] = useReducer(*reducer*, *initialState*)의 형식으로 선언되며 다음과 같은 형태이다.
initialState -> | state - reducer - dispatcher | - [action]

```typescript
//State
type StoreState = {
    count: number
}

//Action
type Action = { type : 'add', payload: number }

//Reducer
type Reducer = ( state: StoreState, action: Action ): state: StoreState

...
//View
const ReactComponent = () => {
    ...
    return (
        <View>
            <Button onClick={()=>{dispatcher(action)}} />
        </View>
    )
}

```
이 구조에 따라 네 기둥을 다 세우는 작업을 해주어야 하므로 작성이 수고로울 수 있다.


### 리덕스(Redux)

Redux has quite a difficult entry threshold. If a developer learns Redux
from scratch, and it’s something brand new to them, they may not initially like it.
But, learn they must and learn they want, as almost 20% of respondents want to
master Redux in the future, even though it’s so difficult. Or maybe people realize
that in order to score a nice job in frontend development, having Redux experience is good for their resumes.
근데 어디에선 싫어하는 라이브러리 1위로도 뽑힘

위와 같은 Flux 아키텍쳐를 기반으로, 단 하나의 스토어를 사용해 애플리케이션의 전역 상태를 보유한다.

Action 정의 : 
```const increaseCounterAction = () => {type: INCREMENT}```

Reducer 생성 : 
```const countReducer = (state, action) => (state)```

Store 생성 : 
```const store = createStore(counterReducer)```

액션 발생 : 
```store.dispatch(increaseCounterAction())```


그외에도 보조하기 위한 미들웨어가 존재한다.
- Redux Saga(saga: 복잡한 프로세스 또는 시리즈 작업을 지칭) : 
ES6 Genenator를 통해 비동기 작업 및 사이드 이펙트를 관리하기 위한 미들웨어.
Watcher Saga, Worker Saga와 yield를 통한 미들웨어의 순차 실행 등으로 구성된다.

- Redux Thunk : 

비동기 작업을 간단히 직관적으로 처리하기 위한 미들웨어. 액션을 비동기적 / 조건에 따라 처리할 수 있게 해준다.

- Redux Logger : 
애플리케이션의 상태변화 로깅

- Redux Promise : 
액션 객체에 프로미스를 페이로드로 전달할 수 있게 해준다. 액션의 페이로드가 프로미스인 경우, Redux Promise는 흐로미스가 resolve될 때 결과를 자동으로 디스패치한다.


### ContextAPI
props drilling 문제가 번거로웠다.
리덕스 구조 짜기에는 부담스러웠다.

16.3 버전 이전의 context
```typescript
class ParentComponent extends React.Component {
    static childContextTypes = {
        age : number
    }

    getChildContext() {
        return childContextTypes에 따른 객체
    }

    render() {
        return <ChildComponent />
    }
}

function ChildComponent(props, context) {
    return(
        <p>{context.age}</p>
    )
}

```

16.3 출시된 ContextAPI
```typescript
const myContext = createContxt<*myType*| undefined>(undefined)

class myCompo어쩌고{
    return
        <myContext.Consumer>
            {(state) => <p>{state?.count}</p>}
        </myContext.Consumer>
}

class ParentCompo 생략{
    state: myType = 값

    render() {
        return(
            <myContext.Provider value = state>
                <myCompo>
            </myContext.Provider>
        )
    }
}
```
피차 의존성이 생기기는 매한가지이다. 조금 더 명시적이고 간결해졌다.

### 훅의 탄생, 그리고 React Query와 SWR
16.8에서 함수 컴포넌트에서 사용할 수 있는 useState등의 훅 API 추가되었다.

이러한 배경에 따라 React Query와 SWR이 등장하였다.

**useSWR(Stale-While-Revalidate)**

```typescript
const { data, error } = useSWR(
    URI : 가져올 URI,
    fetcher : fetch 후 값을 처리하여 리턴하는 함수
)
```

비동기적으로 데이터를 가져오고 데이터가 업데이트 되면 리렌더링된다.
캐시된 데이터를 활용하여 먼저 화면에 보여준다.

**ReactQuery**
서버의 상태를 효율적으로 가져오고, 캐시하고, 동기화하고, 업데이트 하기 위한 라이브러리로 캐싱, 동기화, 업데이트 작업을 단순화한다.
```typescript
const {data, error, isLoading} = useQuery(key, fetchingFunction);
```
의 형태로 사용된다.

**최근**
Recoil, Zustand, Jotai, Valtio(그리고 책에 나오지 않은 Mobx) 등도 등장함
 
Redux
장점
- 탄탄한 커뮤니티와 개발자 풀
- 오랜 역사
- 다양한 보일러플레이트
- 미들웨어
단점
- 컴포넌트 업데이트 하는 반응형 메커니즘이 기본탑재 되어있지 않음

Recoil
Atom(state) - Selector(Function)
장점
- Facebook사에서 나와 React스러움
- 간단한 구조
- component 렌더링 시기, 상태 등을 세밀하게 제어하고 성능 최적화 가능
- 세분화된 상태관리

단점    
- 세분화된 상태관리
- 빈약한 커뮤니티

MobX
- Redux에서 몇가지가 보완되고, 객체지향적인 형태의 라이브러리
- Redux에서 제공하지 않는 반응형 매커니즘 기본 제공

### 05.01.02 정리
| 특징       | Redux                   | Recoil                      | MobX                     | Zustand                     | Jotai                       |
|---------|---------|---------|---------|---------|---------|
| 데이터 흐름 | 단방향 데이터 흐름 패턴을 사용 | 단방향 데이터 흐름 패턴을 사용 | 양방향 데이터 바인딩 패턴을 사용 | 단방향 데이터 흐름 패턴을 사용 | 단방향 데이터 흐름 패턴을 사용 |
| 데이터 변화 감지 | 액션(Action)을 통해 변화를 감지 | 변화를 감지하는 상태 Atom을 사용 | 오브젝트를 Observer로 사용함 | React Hooks를 통해 상태 변화를 감지함 | React Hooks를 통해 상태 변화를 감지함 |
| 비동기 처리 | Redux-Thunk, Redux-Saga와 같은 미들웨어를 사용함 | 비동기 처리를 위한 별도의 라이브러리가 필요하지 않음 | MobX-React와 같은 미들웨어를 사용함 | 비동기 처리를 위한 별도의 라이브러리가 필요하지 않음 | 비동기 처리를 위한 별도의 라이브러리가 필요하지 않음 |
| 러닝 커브 | Redux는 개념이 간결하고 직관적이지만 초기 학습이 어려움 | Recoil은 개념이 간결하고 초기 학습이 상대적으로 용이함 | MobX는 초기 학습이 비교적 용이함 | Zustand은 상태 관리와 관련된 개념이 간결하며 초기 학습이 상대적으로 용이함 | Jotai는 초기 학습이 비교적 용이함 |
| 커뮤니티 | 널리 사용되고 활발한 커뮤니티가 있음 | 아직은 상대적으로 새로운 상태 관리 도구이기 때문에 커뮤니티는 활발하지 않음 | 커뮤니티가 활발하지만 Redux보다는 작음 | 커뮤니티는 활발하지만 Redux보다는 작음 | 커뮤니티는 활발하지만 Redux보다는 작음 |


| 기능/도구     | Redux | Recoil | MobX | Zustand | Jotai |
|---------------|-------|--------|------|---------|-------|
| 코드 크기     | 큼    | 중간   | 작음 | 중간    | 작음  |
| 비동기 처리   | 미들웨어 필요 | 필요 없음 | 미들웨어 필요 | 필요 없음 | 필요 없음 |
| 데이터 흐름   | 단방향 | 단방향   | 양방향 | 단방향   | 단방향  |
| 초기 학습 용이 | 어려움 | 쉬움    | 쉬움  | 쉬움    | 쉬움  |
| 코드 간결성   | 중간  | 높음    | 높음  | 높음    | 높음  |
| 유지 보수성   | 높음  | 높음    | 중간 | 높음    | 높음  |
| 상태 구성     | 객체  | Atom   | 객체 | 객체    | Atom  |

위 표는 2022년 말 어딘가에서 주워온것으로 참조만 하시오.

## 05.02 리액트 훅으로 시작하는 상태 관리
### 05.02.01 가장 기본적인 방법 : useState와 useReducer
가장 기본적인 방법이라 그런지 모두가 알고 있거나, 금방 할 수 있을것

### 05.02.02 지역 상태의 한계를 벗어나보자 : useState의 상태를 바깥으로 분리하기
useState가 지역상태값이라는 내용
특정파일에서 상태값을 전역으로 내보내고, 전역 메서드를 통해 조작하지만 렌더링이 안되어서 아쉬웠다는 내용.

렌더링을 일으키고자 useState등을 사용해보았으나, 지역상태만 업데이트되는 문제 등을 거론하며 렌더링을 일으키는 전역 상태관리자를 위해서는 다음 조건이 필요함을 언급한다.

- 완전한 전역수준까진 아니더라도 독립된 여러 컴포넌트간 공유 가능해야함
- 상태값을 사용하는 컴포넌트가 상태변화를 알아채고 리렌더링 하여야 함
- 객체인 경우, 객체의 내용이 변하더라도 참조하고 있는 값이 변한게 아닌 이상 리렌더링을 일으키면 안됨

위 내용을 골자로 코드를 자겅하고 있다.
자세한 내용은 책을 참고하라.

### 05.02.03 useState와 Context를 동시에 사용해보기
스토어와 콘텍스트를 동시에 사용해 독립적인 콘텍스트 공간을 갖는 많은 콘텍스트를 구현하는 내용.
자세한것은 생략한다.

위 내용들은 상태관리 라이브러리를 이해하는데에 참조하면 충분할 것으로 생각된다.
"Don't reinvent the wheel" 하자.


### 05.02.04 상태 관리 라이브러리 Recoil, Jotai, Zustand 살펴보기
https://miro.medium.com/v2/resize:fit:720/format:webp/1*r8e7SDRwavMy8FwNEuHhPg.png


### Recoil
작은 상태를 효율적으로 관리

https://recoiljs.org/ko/
현재 0.7.7까지 나왔다. 1.0.0
근1년간 패치가 두어번정도 되었고, 여러 이슈가 있다. 메모리 누수 이슈가 있다.
Facebook(현 Meta)에서 팀 리더로 Recoil Recoil-sync Recoil-relay 등을 개발했던 Douglas Armstrong 님이 지난 1월 정리 해고에 의해 퇴직을 하게 되었다. Recoil의 초기 설계부터 개발까지 담당했던 메인 개발자가 사라진 것에 영향이 있을 수 있다. meta team이 유지보수 하지 않는다는 이야기 있다.

이탈률이 커지고 있다.

그러나 여전히 개념은 참고하여 알아두고 영감을 받을 수도 있다.

작동원리
**Recoil Root**
최상단에 배치

**atom**
상태를 나타내는 Recoil의 최소 단위로 데이터이다. 키와 상태값을 가진다.

**useRecoilValue**
atom의 값을 가져옴

**useRecoilState**
useState의 형태로 상태값과 업데이트 함수를 반환한다.


### Zustand
https://zustand-demo.pmnd.rs/
하나의 큰 스토어를 기반으로 상태를 관리한다. Flux 패턴을 따르며 리덕스와 비슷한 계열로 생각해도 된다. atom같은 최소단위 대신 커다란 저장소(중앙집중형)을 사용하고 있다. 
- 사용자 유입이 지속적으로 늘어나고 있다 
- 보일러플레이트가 작다
- Redux Devtool을 사용할 수 있다
- 핵심 로직을 위한 코드가 적다(러닝커브 작음)

아주 쉽다고 하니 FE Study 동지들께선 필요한 경우 공식문서를 참조하시면 금방 하실 수 있을것이라 생각.
자세한 내용은 생략한다.


### Jotai
작은 상태를 효율적으로 관리, Recoil에 영감을 받아 만들어진 상태 관리 라이브러리라고 한다.
2023년 2월 1일 Jotai V2가 나왔다. 현재는 2.7.2.
Recoil과 달리 키 관리가 추상화되어 별도의 문자열 키가 없어도 각 값들을 관리할 수 있다. 또한 타입스크립트를 잘 지원한다.

**Atom**
상태값

**DerivedAtom**
다른 atom에서부터 파생된 atom으로 다음과 같은 세가지 유형이 존재한다.
- Read-Write atom — useAtom
- Read-only atom — useAtomValue
- Write-only atom — useSetAtom

**Atom 사용**
- Read-Write — useAtom
- Read-only — useAtomValue
- Write-only — useSetAtom


### 05.02.05 정리
전역 상태관리에 있어서는
기존 코드들과의 호환성, 안정적인 구현과 유지보수를 위한다면 Redux,
atomic한 상태관리를 원한다면 Jotai를,
중앙 집중식 상태관리를 하는 경우에, 초기 테스트 프로젝트 코어 구축등을 한다면 Zustand가 좋을 것이라고 추론된다.


