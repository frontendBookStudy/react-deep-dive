# 03장: 리액트 훅 깊게 살펴보기

## 3.1 리액트의 모든 훅 파헤치기

리액트(React) Hook은 리액트 16.8 버전에서 도입된 기능으로, 클래스 컴포넌트를 작성하지 않고도 상태 값과 여러 리액트의 기능들을 함수 컴포넌트 내에서 사용할 수 있게 해주는 함수들입니다.
Hooks를 사용함으로써 함수 컴포넌트에서도 리액트의 상태 관리 및 생명주기 기능들을 활용할 수 있게 되었습니다.

### 3.1.1 useState

`useState`는 가장 기본적인 Hook으로, 함수 컴포넌트에서 상태(state) 관리를 가능하게 하는 기능입니다.
이 Hook을 통해 클래스 컴포넌트에서만 가능했던 상태 관리를 함수 컴포넌트에서도 사용할 수 있게 되었습니다.
이 Hook을 사용하면 컴포넌트 내부에 상태를 선언할 수 있고, 이 상태는 컴포넌트가 재렌더링될 때 사이에도 유지됩니다.

#### 사용 방법

`useState`는 현재 상태값과 그 상태를 설정하는 함수를 배열로 반환합니다.
이 함수를 호출함으로써 컴포넌트의 상태를 업데이트할 수 있고, 리액트는 이 변경을 감지하여 컴포넌트를 다시 렌더링합니다.

```jsx
const [state, setState] = useState(initialState);
```

- state
    - 현재 상태값입니다.
    - 초기값은 `useState` 함수의 인자로 넘겨주는 값이 됩니다.
- setState
    - 상태를 업데이트하는 함수입니다.
    - 이 함수에 새로운 상태값을 인자로 넘겨주어 호출함으로써 상태를 업데이트할 수 있습니다.
- initialState
    - 상태의 초기값입니다.
    - 상태값이 처음 사용될 때 이 값이 초기 상태로 설정됩니다.

#### 예제

```jsx
import React, { useState } from 'react';

function Example() {
  // 새로운 상태 변수 "count"를 선언하고, 이를 변경하기 위한 함수 "setCount"를 제공합니다.
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

이 예제에서는 `useState`를 사용하여 `count`라는 상태 변수를 생성하고, 초기값을 `0`으로 설정합니다.
사용자가 버튼을 클릭할 때마다 `setCount` 함수를 호출하여 `count`의 값을 1 증가시키는 로직을 구현합니다.
이렇게 상태가 업데이트되면, 리액트는 `Counter` 컴포넌트를 다시 렌더링하여 화면에 변경된 `count` 값을 반영합니다.

#### 주의 사항

- `setState` 함수는 비동기적으로 상태를 업데이트할 수 있으며, 리액트는 성능 최적화를 위해 여러 상태 업데이트를 한꺼번에 처리할 수 있습니다.
- 상태 업데이트 로직에서 현재 상태에 의존할 경우, `setState` 함수에 함수를 인자로 전달하여 현재 상태를 기반으로 새 상태를 계산할 수 있습니다.
- 상태 업데이트는 항상 새로운 상태 값으로 이루어져야 하며, 객체나 배열과 같은 복잡한 상태를 업데이트할 때는 이전 상태를 복사하고 변경 사항을 적용한 새 객체나 배열을 생성하여 상태를 업데이트해야 합니다.

#### 게으른 초기화 (Lazy Initialization)

`useState`를 사용할 때, 초기 상태를 설정하는 함수를 전달함으로써 초기 상태의 계산을 게으르게(lazily) 수행할 수 있습니다.
이 방법은 초기 상태가 복잡하거나 계산 비용이 높을 때 특히 유용합니다.
리액트는 컴포넌트가 처음 렌더링될 때만 이 함수를 호출합니다.

```jsx
const [state, setState] = useState(() => {
  // 복잡한 계산 또는 비용이 많이 드는 작업을 수행
  const initialState = performExpensiveCalculation();
  return initialState;
});
```

### 3.1.2 useEffect

`useEffect`는 React 함수 컴포넌트에서 부수 효과(side effects)를 다루기 위한 Hook입니다.
부수 효과는 데이터 fetching, 구독(subscriptions), 수동으로 DOM 조작하는 것과 같이 컴포넌트의 렌더링 결과에 영향을 주는 작업을 의미합니다.
클래스 컴포넌트의 생명주기 메소드인 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`의 역할을 `useEffect` 하나로 통합해 처리할 수 있습니다.

#### 사용 방법

`useEffect`는 두 개의 인자를 받습니다.

```jsx
useEffect(() => {
  // 부수 효과를 수행하는 로직
}, [dependencies]);
```

1. Effect를 실행할 함수
    - 이 함수는 컴포넌트가 렌더링될 때마다 실행됩니다.
    - 옵션으로, 이 함수는 cleanup 함수를 반환할 수 있으며, 이 cleanup 함수는 컴포넌트가 언마운트 되거나 effect가 다시 실행되기 전에 호출됩니다.
2. 의존성 배열(Dependency array)
    - Effect가 의존하는 값들의 배열입니다.
    - 배열에 포함된 값 중 하나라도 변경되면, effect는 다시 실행됩니다.
    - 배열이 비어 있으면, effect는 컴포넌트가 마운트될 때 한 번만 실행되고 컴포넌트가 언마운트될 때 cleanup 함수가 호출됩니다.

#### 예시

##### 1) 데이터 fetching

```jsx
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    setData(data);
  };

  fetchData();
}, []); // 의존성 배열이 비어 있으므로, 컴포넌트가 마운트될 때만 fetchData가 실행됩니다.
```

##### 2) 이벤트 리스너 등록 및 해제

```jsx
useEffect(() => {
  const handleResize = () => console.log('Window resized');

  window.addEventListener('resize', handleResize);

  // Cleanup 함수
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // 컴포넌트가 마운트 및 언마운트될 때만 실행됩니다.
```

##### 3) 의존성 배열을 사용한 effect 업데이트

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // count가 변경될 때마다 effect를 다시 실행합니다.
```

#### Cleanup 함수

`useEffect`에서 반환하는 함수는 컴포넌트가 언마운트되기 전이나, effect가 재실행되기 전에 실행되며, 주로 리스너 해제, 타이머 취소 등의 정리(clean-up) 작업에 사용됩니다.

#### 주의사항

##### 1. `eslint-disable-line react-hooks/exhaustive-deps` 주석은 최대한 자제하라

`useEffect`의 의존성 배열에는 effect 함수 내에서 사용되는 모든 외부 값과 함수를 포함시켜야 합니다.
React의 ESLint 플러그인은 의존성 배열에서 누락된 값들을 감지하고 경고합니다.
때로는 이 경고를 무시하기 위해 `eslint-disable-line react-hooks/exhaustive-deps` 주석을 사용하는 개발자들이 있습니다.
하지만 이런 식으로 경고를 무시하는 것은 의존성 배열 관리의 본래 목적에 어긋나며, 무한 루프나 데이터 불일치 같은 버그를 발생시킬 위험을 높입니다.
의존성 배열 관련 경고는 코드의 잠재적인 문제점을 지적하는 것이므로, 가능한 해결하려고 노력해야 합니다.

##### 2. `useEffect`의 첫 번째 인수에 함수명을 부여하라

익명 함수 대신 명명된 함수를 사용하는 것은 좋은 코딩 습관 중 하나입니다.
이는 디버깅 시 함수 이름이 스택 트레이스에 나타나기 때문에 문제를 더 쉽게 추적할 수 있게 해줍니다.
또한, 코드의 가독성을 높이는 데도 도움이 됩니다.

```jsx
// 좋은 예
useEffect(function fetchData() {
  // 데이터 fetching 로직
}, []);

// 나쁜 예
useEffect(() => {
  // 데이터 fetching 로직
}, []);
```

##### 3. 거대한 `useEffect`를 만들지 마라

하나의 `useEffect` 내에 여러 가지 부수 효과를 넣는 것은 피해야 합니다.
각 부수 효과는 그 목적과 사용하는 의존성이 다를 수 있기 때문에, 각각을 별도의 `useEffect`로 분리하는 것이 좋습니다.
이는 코드의 가독성을 높이고, 각 effect의 의존성을 명확하게 관리할 수 있게 해줍니다.

##### 4. 불필요한 외부 함수를 만들지 마라

`useEffect` 내부에서만 사용되는 함수는 해당 effect 내부에 정의하는 것이 좋습니다.
외부에 정의된 함수를 `useEffect` 내부에서 사용할 경우, 그 함수를 의존성 배열에 포함시켜야 하며, 해당 함수가 컴포넌트의 다른 부분에서도 사용되지 않는다면, 불필요한 의존성이 추가되는 것입니다.
함수가 effect 밖에서도 필요하거나, 여러 effect에서 공통적으로 사용된다면, 해당 함수를 커스텀 훅으로 분리하는 것을 고려해볼 수 있습니다.

### 3.1.3 useMemo

`useMemo`는 메모이제이션(memoization)된 값을 반환합니다.
이 Hook을 사용하면, 비용이 많이 드는 계산 작업의 결과값을 기억하고, 의존성 배열에 있는 값이 변경되었을 때만 계산을 다시 수행합니다.
이는 성능 최적화를 위해 사용되며, 불필요한 렌더링을 방지해줍니다.

#### 사용 방법

`useMemo`는 두 개의 인자를 받습니다.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

1. 생성 함수(create function)
    - 메모이제이션할 값을 계산하는 함수입니다.
2. 의존성 배열(Dependency array)
    - 이 배열의 값이 변경될 때만 생성 함수가 다시 호출됩니다.
    - 만약 의존성 배열이 비어 있으면, 생성 함수는 컴포넌트가 처음 렌더링될 때만 실행됩니다.

#### 예제

```jsx
function MyComponent({ value1, value2 }) {
  // 비용이 많이 드는 계산 작업
  const expensiveComputation = useMemo(() => {
    return computeExpensiveValue(value1, value2);
  }, [value1, value2]);

  return <div>{expensiveComputation}</div>;
}
```

이 예제에서 `computeExpensiveValue` 함수의 결과는 `value1`과 `value2`가 변경될 때만 다시 계산됩니다.
그 결과, 불필요한 계산을 방지하고 성능을 향상시킬 수 있습니다.

### 3.1.4 useCallback

`useCallback`은 메모이제이션된 콜백 함수를 반환합니다.
이 Hook은 주로 불필요한 렌더링을 방지하여 성능을 최적화하기 위해 사용됩니다.
특히, 자식 컴포넌트에 props로 함수를 전달할 때 유용하며, 의존성 배열에 있는 값이 변경될 때만 함수가 다시 생성됩니다.

#### 사용 방법

`useCallback`은 두 개의 인자를 받습니다.

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

1. 콜백 함수
    - 메모이제이션할 콜백 함수입니다.
2. 의존성 배열(Dependency array)
    - 이 배열의 값이 변경될 때만 콜백 함수가 다시 생성됩니다.
    - 의존성 배열이 비어 있으면, 콜백 함수는 컴포넌트가 처음 렌더링될 때만 생성되고, 그 이후에는 재생성되지 않습니다.

#### 예제

자식 컴포넌트에 함수를 전달할 경우, `useCallback`을 사용하지 않으면 부모 컴포넌트가 리렌더링될 때마다 새로운 함수가 생성되어 자식 컴포넌트도 리렌더링될 수 있습니다.
이를 방지하기 위해 `useCallback`을 사용할 수 있습니다.

```jsx
import React, {
  useCallback,
  useState
} from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onIncrement={increment}/>;
}

function ChildComponent({ onIncrement }) {
  return (
    <button onClick={onIncrement}>Increment</button>
  );
}
```

이 예제에서 `ParentComponent`는 `increment` 함수를 `ChildComponent`에 prop으로 전달합니다.
`increment` 함수는 `useCallback`에 의해 메모이제이션되므로, `ParentComponent`가 리렌더링될 때마다 `increment` 함수가 재생성되지 않습니다.
결과적으로, `ChildComponent`는 `onIncrement` prop이 실제로 변경되지 않는 한 불필요하게 리렌더링되지 않습니다.

#### 주의사항

- `useCallback`은 함수를 메모이제이션하는 것이므로, 모든 함수에 사용해야 하는 것은 아닙니다. 주로 자식 컴포넌트에 함수를 전달하거나, 함수가 의존성 배열에 있는 값에 의존할 때 사용하는 것이 좋습니다.
- 의존성 배열을 올바르게 관리하는 것이 중요합니다. 배열 내의 값이 변경되면 콜백 함수가 다시 생성되므로, 불필요한 재생성을 방지하기 위해 필요한 값만 포함시켜야 합니다.
- `useCallback`과 `useMemo`는 성능 최적화 도구입니다. 사용하기 전에 실제로 성능 문제가 있는지 분석하고, 필요한 경우에만 사용하는 것이 좋습니다. 남용할 경우 코드 복잡성을 높이고 성능상의 이점을 얻지 못할 수 있습니다.

### 3.1.5 useRef

`useRef`는 렌더링 간에 값을 기억할 수 있는 객체를 생성합니다.
`useRef`는 DOM 요소에 직접 접근하기 위한 참조(ref)를 저장하는 것과, 컴포넌트의 라이프사이클 동안 변하지 않고 유지되어야 하는 값을 저장하는 것입니다.

#### 사용 방법

`useRef`는 초기값을 인자로 받고, 이 초기값으로 초기화된 `current` 프로퍼티를 가진 ref 객체를 반환합니다.

```jsx
const refContainer = useRef(initialValue);
```

- `initialValue`는 ref 객체의 초기 `current` 프로퍼티 값입니다.
- 반환된 ref 객체는 컴포넌트의 전체 수명주기에 걸쳐 유지되며, 객체의 `.current` 프로퍼티를 통해 접근할 수 있는 값을 저장할 수 있습니다.

#### 1) DOM 요소에 접근하기

`useRef`는 DOM 요소에 직접 접근하기 위해 사용될 수 있습니다.
이를 통해 DOM 요소의 속성을 읽거나, DOM API를 직접 호출할 수 있습니다.

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // `current` 프로퍼티는 input 요소의 DOM 노드를 가리킵니다.
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text"/>
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

#### 2) 값을 기억하기

`useRef`는 컴포넌트의 라이프사이클 동안 지속되어야 하는 값을 저장하는 데에도 사용될 수 있습니다.
이 경우, ref 객체의 `.current` 프로퍼티는 갱신되어도 컴포넌트가 리렌더링되지 않습니다.

```jsx
function TimerComponent() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // 무언가를 실행
    }, 1000);
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // ...
}
```

#### 주의 사항

- `useRef`로 생성된 객체를 업데이트해도 컴포넌트는 리렌더링되지 않습니다. 이는 `useState`와는 대조적인 특성입니다.
- DOM 요소에 접근하는 경우, 해당 요소가 렌더링 결과에 포함되어 있을 때만 `.current` 프로퍼티가 해당 DOM 요소를 가리킵니다. 컴포넌트가 마운트되지 않았거나 언마운트된 후에는 `.current`가 `null`을 가리킬 수 있습니다.

### 3.1.6 useContext

`useContext`는 함수 컴포넌트 내에서 Context를 손쉽게 사용할 수 있게 해주는 기능입니다.
Context API는 React 애플리케이션에서 전역적으로 데이터를 공유할 수 있는 방법을 제공하여, prop drilling(컴포넌트 트리를 통해 props를 수동으로 전달하는 과정) 없이 컴포넌트 간에 데이터를 공유할 수 있게 합니다.

#### 사용 방법

`useContext` Hook을 사용하려면 먼저 React의 `createContext`를 사용하여 Context 객체를 생성해야 합니다.
그 다음, 이 Context의 Provider 컴포넌트를 사용하여 하위 컴포넌트에 데이터를 제공할 수 있습니다.
마지막으로, `useContext` Hook을 사용하여 해당 Context의 현재 값을 읽어올 수 있습니다.

```jsx
import React, {
  useContext,
  createContext
} from 'react';

// Context 생성
const MyContext = createContext();

function App() {
  return (
    <MyContext.Provider value="Hello, useContext!">
      <Child/>
    </MyContext.Provider>
  );
}

function Child() {
  // Context로부터 현재 값을 읽어옴
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

#### 예제

`useContext`는 테마, 로컬라이제이션 설정, 사용자 인증 정보 등 애플리케이션 내 여러 컴포넌트에서 공유되어야 하는 데이터를 관리하는 데 유용합니다.

```jsx
const UserContext = createContext(null);

function App({ user }) {
  return (
    <UserContext.Provider value={user}>
      <Profile/>
    </UserContext.Provider>
  );
}

function Profile() {
  const user = useContext(UserContext);
  return user ? <div>Welcome, {user.name}</div> : <div>Please log in</div>;
}
```

예를 들어, 사용자의 로그인 상태를 애플리케이션의 여러 컴포넌트에서 접근해야 할 때, `UserContext`를 생성하고, 애플리케이션의 최상위에서 `Provider`를 통해 사용자 정보를 공유한 후, 하위 컴포넌트에서 `useContext`를 사용하여 해당 정보에 접근할 수 있습니다.

#### 주의 사항

- `useContext`를 사용할 때, 해당 Context의 Provider가 컴포넌트 트리 상위에 존재하지 않으면 Context의 기본값이 사용됩니다. 따라서, Context를 사용하기 전에 적절한 Provider로 컴포넌트를 감싸 줘야 합니다.
- Context를 너무 많이 사용하면 컴포넌트 재사용성이 떨어질 수 있으며, 애플리케이션의 로직이 복잡해질 수 있습니다. 필요한 곳에서만 Context를 사용하고, 가능한 한 props를 통한 데이터 전달을 우선시하는 것이 좋습니다.

### 3.1.7 useReducer

`useReducer`는 복잡한 컴포넌트의 상태 로직을 더 관리하기 쉽게 만들어 주는 기능입니다.
`useState`와 비슷하지만, `useReducer`는 보다 복잡한 상태 로직을 처리하고 다수의 하위 값이 있는 상태를 관리할 때 더 적합합니다.
특히, 다음 상태가 이전 상태에 의존적인 경우에 유용합니다.

#### 사용 방법

`useReducer`는 세 가지 인자를 받습니다.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

1. reducer
    - 상태를 업데이트하는 함수입니다.
    - 이 함수는 현재 상태와 액션을 인자로 받아 새로운 상태를 반환합니다.
2. initialState
    - 리듀서의 초기 상태입니다.
3. init
    - 초기 상태를 지연 초기화하기 위한 함수(선택적)입니다.

`useReducer`는 현재 상태와 `dispatch` 함수를 쌍으로 반환합니다.
`dispatch` 함수는 액션을 발생시키는 데 사용되며, 이 액션은 리듀서 함수에 의해 처리됩니다.

#### 예시

```jsx
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

이 예제에서, `reducer` 함수는 현재 상태와 액션 객체를 인자로 받습니다.
액션 타입에 따라 새로운 상태를 반환합니다.
`dispatch` 함수를 사용하여 액션을 발생시키면, 리듀서 함수가 호출되어 상태가 업데이트됩니다.

#### 주의 사항

- `useReducer`는 컴포넌트의 상태 업데이트 로직을 외부 함수로 분리할 수 있게 해주므로, 테스트가 용이해지고 로직의 재사용성이 높아집니다.
- 리듀서 함수는 순수 함수로 작성되어야 합니다. 즉, 동일한 인자에 대해 항상 동일한 결과를 반환해야 하며, 외부 상태를 변경하거나 API 호출과 같은 부수 효과를 발생시켜서는 안 됩니다.
- `useReducer`는 복잡한 상태 로직을 관리하거나, 다른 컴포넌트와 상태를 공유해야 할 때 특히 유용합니다. 상태 업데이트 로직이 간단한 경우에는 `useState`를 사용하는 것이 더 적합할 수 있습니다.

### 3.1.8 useImperativeHandle

`useImperativeHandle`은 부모 컴포넌트가 자식 컴포넌트의 함수나 변수에 접근할 수 있도록 해줍니다.
일반적으로, 컴포넌트는 자신의 내부 상태를 숨기고 외부로부터 독립적이어야 하지만, 특정 케이스에서 부모 컴포넌트가 자식의 인스턴스 메서드나 변수에 접근해야 할 필요가 있을 수 있습니다.
`useImperativeHandle`은 이러한 경우에 사용되며, `forwardRef`와 함께 사용되어야 합니다.

#### 사용 방법

`useImperativeHandle`은 주로 세 가지 인자와 함께 사용됩니다.

```jsx
useImperativeHandle(ref, create, deps);
```

1. ref
    - 부모 컴포넌트로부터 전달받은 ref 객체입니다.
2. create
    - 함수로, 이 함수는 ref가 가리킬 값을 반환합니다.
3. deps
    - 의존성 배열로, `create` 함수가 다시 실행되어야 할 조건을 배열 형태로 지정합니다.

#### 예시

부모 컴포넌트가 자식 컴포넌트의 포커스 함수에 접근하려는 경우의 예시입니다.

```jsx
import React, {
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';

function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));

  return <input ref={inputRef}/>;
}

FancyInput = forwardRef(FancyInput);

function Parent() {
  const inputRef = useRef();

  return (
    <>
      <FancyInput ref={inputRef}/>
      <button onClick={() => inputRef.current.focus()}>
        Focus the input
      </button>
    </>
  );
}
```

이 예제에서, `FancyInput` 컴포넌트는 내부 `input` 요소에 포커스를 주는 `focus` 함수를 제공합니다.
`useImperativeHandle` Hook을 사용하여 `FancyInput` 컴포넌트의 ref가 이 `focus` 함수를 가리키도록 합니다.
그리고 `Parent` 컴포넌트는 `FancyInput`에 대한 ref를 통해 이 `focus` 함수를 호출할 수 있습니다.

#### 주의 사항

- `useImperativeHandle`은 비교적 드문 케이스에서 사용됩니다. 컴포넌트 간의 데이터 흐름은 주로 props를 통해 이루어져야 하며, 이 Hook은 정말 필요한 경우에만 사용해야 합니다.
- 이 Hook을 남용하면 애플리케이션의 구조가 복잡해지고 유지 관리가 어려워질 수 있으므로 주의가 필요합니다.

### 3.1.9 useLayoutEffect

`useLayoutEffect`는 DOM 변경 후에 동기적으로 실행되는 부수 효과(side effects)를 처리합니다.
`useEffect`와 매우 유사하게 작동하지만, 주요 차이점은 실행 시점에 있습니다.
`useEffect`는 모든 DOM 변경이 완료되고 브라우저가 화면을 그린 후에 비동기적으로 실행되는 반면, `useLayoutEffect`는 DOM 변경 후 즉시 실행되지만 화면이 그려지기 전에 실행됩니다.
이로 인해 `useLayoutEffect` 내부에서 수행된 변경사항은 사용자에게 화면 깜빡임 없이 한 번에 보여집니다.

#### 사용 방법

`useLayoutEffect`의 사용법은 `useEffect`와 동일합니다.
두 개의 인자를 받으며, 첫 번째 인자는 부수 효과를 수행할 함수이고, 두 번째 인자는 의존성 배열입니다.

```jsx
useLayoutEffect(() => {
  // 실행할 부수 효과 로직
}, [dependencies]);
```

#### 예시

`useLayoutEffect`는 주로 다음과 같은 상황에서 사용됩니다.

- DOM 측정이 필요한 경우
    - 화면이 사용자에게 보여지기 전에 DOM 요소의 크기나 위치를 측정해야 할 때 사용합니다.
    - `useEffect`에서 이러한 작업을 수행하면 화면 깜빡임이 발생할 수 있습니다.
- 조건에 따른 DOM 수정
    - 화면에 보여지기 전에 조건에 따라 DOM을 수정하거나 조정해야 하는 경우에 사용됩니다.

#### 주의 사항

- `useLayoutEffect`는 동기적으로 실행되기 때문에, 가능한 한 사용을 자제하고 필요한 경우에만 사용하는 것이 좋습니다. 불필요한 사용은 애플리케이션의 성능을 저하시킬 수 있습니다.
- 서버 사이드 렌더링 환경에서 `useLayoutEffect`를 사용하면 경고가 발생합니다. 이러한 환경에서는 `useEffect`를 사용하는 것이 좋습니다.

#### useLayoutEffect vs useEffect

- `useLayoutEffect`
    - 화면이 업데이트되기 전에 실행되어야 하는 작업, 특히 DOM 측정이나 조정 작업에 적합합니다.
- `useEffect`
    - 데이터 fetching이나 구독 설정 같이 비동기적으로 실행되어도 괜찮은 작업에 더 적합합니다.

`useLayoutEffect`는 그 사용 사례가 매우 제한적이며, 대부분의 경우 `useEffect`가 더 적합합니다. 하지만 화면 깜빡임 없이 DOM 변경을 반영해야 하는 등의 특수한
상황에서는 `useLayoutEffect`가 필요할 수 있습니다.

### 3.1.10 useDebugValue

`useDebugValue`는 주로 개발자 도구에서 커스텀 Hook의 내부 상태를 디버깅할 때 사용됩니다.
이 Hook은 커스텀 Hook을 더 쉽게 검사할 수 있게 해주며, 특히 복잡한 커스텀 Hook을 개발하고 있을 때 유용합니다.
`useDebugValue`는 커스텀 Hook 내에서만 사용될 수 있으며, 그 값을 React 개발자 도구에서 확인할 수 있습니다.

#### 사용 방법

`useDebugValue`는 단일 인자를 받으며, 이 인자는 디버깅을 위해 표시할 값을 지정합니다.
선택적으로, 포맷 함수를 두 번째 인자로 전달하여 디버깅 값을 변환할 수도 있습니다.
이 포맷 함수는 개발자 도구에서 해당 Hook을 검사할 때만 실행되므로, 성능에 미치는 영향을 최소화합니다.

```jsx
useDebugValue(value);
```

```jsx
useDebugValue(value, formatFn);
```

#### 예시

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // 친구의 온라인 상태를 추적하는 로직...

  // 디버깅 값 설정
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

이 예시에서 `useDebugValue`는 친구의 온라인 상태(`isOnline`)를 'Online' 또는 'Offline' 문자열로 변환하여 React 개발자 도구에서 표시합니다.
이를 통해 개발자는 개발자 도구를 사용하여 `useFriendStatus` Hook의 현재 상태를 쉽게 확인할 수 있습니다.

#### 주의 사항

- `useDebugValue`는 개발 모드에서만 작동하며, 프로덕션 빌드에서는 React가 이를 무시합니다.
- 이 Hook은 커스텀 Hook의 내부 상태를 디버깅하는 데 도움을 주기 위한 것이므로, 애플리케이션의 로직에는 직접적인 영향을 미치지 않습니다.

### Hook의 규칙

#### 1. 최상위에서만 Hook을 호출해야 합니다.

Hook은 함수 컴포넌트의 최상위 레벨에서만 호출되어야 합니다.
반복문, 조건문, 중첩된 함수 내에서 Hook을 실행하면 안 됩니다.
이 규칙은 Hook이 각 컴포넌트 렌더링 간에 동일한 순서로 호출되도록 보장하기 위해 필요합니다.
이 순서는 React가 내부 상태를 올바르게 관리하는 데 중요합니다.

#### 2. 함수 컴포넌트와 커스텀 Hook 내에서만 Hook을 호출해야 합니다.

Hook은 React 함수 컴포넌트 내부나 다른 Hook 내부에서만 호출될 수 있습니다.
일반 JavaScript 함수에서 Hook을 호출하면 안 됩니다.
이 규칙은 Hook의 사용이 예측 가능하도록 하고, 컴포넌트의 상태 관리 로직을 캡슐화하는 데 도움이 됩니다.
