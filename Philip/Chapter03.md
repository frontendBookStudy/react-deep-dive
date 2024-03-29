# 03 리액트 훅 살펴보기
## 03.01 리액트의 모든 훅 파헤치기
함수형 컴포넌트(Functional Component)가 아니라 함수 컴포넌트(Function Component)이며 함수형 프로그래밍과는 별 관계 없다.
함수 컴포넌트는 상태관리를 할 수 없었으나 Hook이 도입되며 간결하고 간단하고 분할이 쉬운 함수 컴포넌트가 많은 인기를 얻게 되었다. 이러한 배경에 따라 훅을 파헤칠 필요가 있다.


### 03.01.01 useState
가장 손쉽게 접할 수 있는 훅의 하나. 상태를 보관하지 않는 함수 컴포넌트 내에서 매 실행마다 이전의 값을 기억하는 역할을 한다. 특징으로는 아래와 같은 것들이 있다.

- 리렌더링을 발생시킨다.
- 클로저의 개념을 이용한다.
- lazy initialization이 가능하다.
```typescript
const [count, setCount] = useState(() => {
  Number.parseInt(window.localStorage.getItem(cacheKey))
})
//상태 생성되는 최초에만 실행됨
```


### 03.01.02 useEffect
흔히 클래스 컴포넌트의 생명주기를 흉내내기 위해서 사용한다고 생각하지만, 실질적으로는 의존성 배열에 따른 부수효과를 일으키는 개념이다.

- 특별한 패턴을 통해 값의 변화를 관찰하는 것이 아니라 의존성의 값만을 관찰한다.
- 이벤트 등을 부수효과로서 생성한 경우 클린업 함수를 통해 제거할 수 있는데, 리턴을 통해 전달된 클린업 함수는 다음 렌더링 끝난 후 실행된다.
- 렌더링이 완료된 후 실행된다. 따라서 클라이언트 사이드에서의 작동을 보장할 수도 있다.

**주의사항**
- 빈 배열 등 의존성 배열의 흐름과 동작이 별개로 작동할 떄에는 의심하라
- 많은 부수효과는 추적하기 어렵기 때문에 꼭 필요한 경우에만 잘 사용하라.
- 비동기 함수를 바로 콜백으로 전달할 경우 앞선 비동기호출이 더 오래 걸릴 경우 결과를 대체해버릴 수 있다.


### 03.01.03 useMemo
큰 연산에 대해, 인수로 전달된 값이 변경되지 않을 경우 결과값을 기록해두었다가 연산 없이 즉시 사용할 수 있다.,

- 컴포넌트를 반환할 수도 있다.
- 2장에서 살펴보았듯 렌더링을 발생시키지 않는다.


### 03.01.04 useCallback
useMemo의 함수 버전


### 03.01.05 useRef
useState와 비슷하게 컴포넌트가 참조할 수 있는 상태값을 생성할 수 있다. 전역변수와 비교했을 때 다음과 같은 장점을 갖는다.

- 동적으로 여러 객체를 생성할 때, 각각 고유한 상태값을 갖도록 할 수 있다.
- 인스턴스 생성 시 메모리를 할당할 수 있다.

또한 이는 렌더링에 영향을 끼치지 않으며, useMemo를 이용해 구현할 수 있다.


### 03.01.06 useContext
특정 값을 전달하기 위해선 부모-자식의 체인을 따라 계속해서 props를 넘겨주어야 하는데 이를 props drilling이라고 한다.
이는 매우 번거로운 작업인데, 자식 컴포넌트는 부모 컴포넌트의 맥락 내에 있다고 가정하여 이러한 맥락 속에서 접근할 수 있는 공간을 만들어 주는 것이다. 보고체계에 따르지 않고 이병이 중대장에게 중대한 사항을 전달할 수 있는 마음의 편지 같은 시스템이다.

다음과 같은 구조이다.
```typescript
const Context = createContext<type>(value)

function ParentComponent() {
  return(
    <>
      <Context.Provider value=...>
        <ChildComponent />
      </Context.Provider>
    </>
  )
}

function ChildComponent() {
  const value = useContext(Context)
}
```

마음의 편지가 많아지면 군대가 어떻게 되겠는가? 관리가 어려워진다.

또한 특정 맥락에 의존하게 되므로 의존성 문제가 발생한다.

또한 상태관리를 위한, 상태에 따른 변화발생시키기, 최적화가 어려우므로 상태관리자로 보기 어렵다. 그냥 편지함에 가깝다.

또한 어차피 상위 컴포넌트가 렌더링 되면 하위 컴포넌트는 모두 리렌더링되기 때문에, 특정 컴포넌트만 업데이트 된다고 보기 어렵다.

### 03.01.07 useReducer
Reducer는 특정한 일련의 시퀀스를 단일한 값등으로 줄여내는 녀석을 이야기한다. useState로 관리하기 어려운 복잡한 상태값을 관리하는 시나리오를 다루는 데에 용이하다.

인수(3개) : 리듀서(함수), 초깃값, 초깃값 지연생성 함수(optional)

반환값(2개) : [state, dispatcher]를 갖는다

상태를 관리하는 로직이 훅에 바인딩되어 관리가 편해진다. 

### 03.01.08 useImperativeHandle
#### forwardRef
상위 컴포넌트에서 접근하고자 하는 참조값을 하위 컴포넌트에 전달하여 심어둘 때에 아래와 같은 방식으로 사용한다.

```typescript
const ChildComponent = forwardRef((props, ref) => {
  ref 어쩌고
})

function ParentComponent() {
  const inputRef = useRef()

  return (
    <>
    <ChildComponent ref={inputRef}>
    </>
  )
}
```
이는 ref가 key와 같이 모든 컴포넌트에 대해 암시적으로 정의된 키워드이기 때문이다.

#### useImperativeHandle
위 내용을 다룬 이유는 이번에 다루는 훅이 연관이 깊기 때문인데, 부모에서 전달받은, 이 값을 자식컴포넌트에서 만질 수 있게 된다.

### 03.01.09 useLayoutEffect
useEffect와 형태나 사용은 동일하다.

리액트가 DOM을 업데이트 한 후 동기적으로 실행되므로, 렌더링 전에 수행된다. 렌더링 시 부수효과를 일으키는 useEffect보다 늘 먼저 실행되게 된다.

동기적으로 수행되므로 작업이 큰 경우 되도록이며 성능을 위해 주의하여야 한다.


### 03.01.10 useDebugValue
값을 리액트 개발자 도구에서 확인할 수 있게 만든다. 첫째가 값이고, 두번째는 포매팅이며, 값이 변경되었을 때 작동한다.

다른 훅 내부에서만 실행할 수 있다(사용자 정의 훅 포함).

### 03.01.11 훅의 규칙
최상위 레벨에서만 훅을 호출하여야 한다. 훅의 호출 순서를 보장하기 위해서이다.

훅을 호출할 수 있는 것은 함수 컴포넌트와 사용자 정의 훅 둘 뿐이다.

*최근에 반복문이나 조건문 안에서도 실행 가능한 훅이 나왔다고 한다*

아무튼 위에서 훅의 호출 순서가 중요한 것은 파이버 객체 내에서 훅의 순서에 따라 구조화되어 있는데, 분기에 의해 이러한 순차 구조가 깨어질 수 있기 떄문이다.

---
## 03.02 사용자 정의 훅과 고차 컴포넌트
사용자 정의 훅(custom hook) 고차 컴포넌트(HOC)


### 03.02.01 사용자 정의 훅
이름은 반드시 use로 시작한다(다르지 않을 시 함수형 컴포넌트나 사용자 정의 훅에서만 리액트 훅을 사용할 수 있다는 에러가 발생한다.). 여러 컴포넌트에서 공유하고자 하는 로직을 구현할 때에 사용한다. 기본 훅을 사용자 정의 훅에서 사용할 수 있다. 

### 03.02.02 고차 컴포넌트
대표적으로 map이 고차 함수이다. 로직을 추가하고자 할때 기존의 함수를 감싸고 그를 이용하여 확장된 로직을 구성할 수 있다. 내포된 컴포넌트가 부수효과를 갖는 경우, 특히 이러한 상태로 중첩될 경우 복잡성이 커진다.

### 03.02.03 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?
재사용의 확장 : 사용자 정의 훅
특화 확장 : 고차 컴포넌트
