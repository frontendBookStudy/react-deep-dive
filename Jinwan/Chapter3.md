## 3장 리액트 훅 깊게 살펴보기

### useState

함수 컴포넌트 내부에서 상태를 정의하고, 이 상태를 **관리**할 수 있게 해주는 훅

```jsx
import { useState } from "react";

function Component() {
  const [state, setState] = useState(defaultValue);

  return <></>;
}
```

이 훅의 반환값은 배열이고, 첫 원소가 상태의 값 자체, 두번째 원소는 상태를 변경하는 함수다.

함수 컴포넌트가 렌더링 된다는 것은 함수가 **다시 호출**된다는 것이다. 그렇기 때문에 상태 변경 함수를 사용하지 않고 상태에 값을 직접 할당하는 코드로는 원하는 렌더링 결과를 확인할 수 없다. 하지만, `useState`는 클로저를 이용해서 함수가 다시 호출되었을 때도 상태를 기억할 수 있게 구현되어 있다.

`useState`를 사용할 때 단순히 원시값을 사용하는 것이 아닌 함수를 사용해서 초기값을 설정할 수 있다. 이 함수는 초기값이 복잡하거나 무거운 연산을 포함한 경우 사용해야하고, 처음 렌더링 시에만 계산되어 리렌더링이 발생했을 때는 이 함수의 실행이 무시된다.

`useState`도 렌더링 시 계속 호출된다. 클로저를 이용해서 초기값은 처음 렌더링 시에만 사용되게 구현되어 있지만, 이 초기값이 무거운 계산으로 나온 결과라면 계속 실행할 때 문제가 있을 수 있다. 이런 경우 함수를 넣어주면서 문제를 방지할 수 있다.

### useEffect

의존성 배열이 변경될 때 콜백함수를 다시 실행하는 함수이다. 단순히 함수가 다시 렌더링될 때 의존성 배열과 상태를 비교하면서 부수 효과를 실행하는 함수이다.

클린업 함수는 `useEffect`의 콜백 함수가 실행되기 전에 먼저 실행된다. 즉, 언마운트 시점에서 클린업 함수를 호출하는 것이 아니라 리렌더링이될 때 클린업 함수를 실행한다는 것이다. 이때 클린업 함수는 리렌더링되면서 변경된 상태를 가지고 실행되는 것이 아니라 변경되기 전 의존성 배열의 상태를 가지고 실행된다.

만약 `useEffect`내부에서 비동기 코드를 사용하려고 한다면 콜백함수를 비동기 함수로만 드는 것이 아니라 내부에서 콜백함수 내부에서 비동기 함수를 만들자. 콜백함수 자체가 비동기가 되어버리면 경쟁 상태를 피하지 못한다.
또한, 클린업 함수를 이용해서 비동기 함수의 실행이 여러 번되지 않도록 하자.

```jsx
useEffect(() => {
  let shouldIgnore = false;
  (async () => {
    const _res = await fetch("http://~");
    const res = await _res.json();

    if (!shouldIgnore) {
      setData(res);
    }
  })();

  return () => {
    shouldIgnore = true;
  };
});
```

### useMemo

비용이 큰 연산에 대한 결과를 저장하고, 이 값을 반환하는 훅이다.
계산하려는 값이 무거운 연산이 필요한 경우 사용할 수 있다.

### useCallback

콜백함수 자체를 기억한다. 함수의 재생성을 막아 불필요한 리소스 또는 리렌더링을 방지하고 싶을 때 사용할 수 있다.

### useRef

useRef도 컴포넌트 내부에서 렌더링이 일어났을 때 상태값을 저장한다. `useState`의 상태와 차이는 변경이 일어나도 렌더링을 발생시키지 않는다는 것이다.

가장 일반적인 사용은 DOM요소에 접근하기 위함이다.

### useContext

props를 통해 부모 자식간 데이터를 공유하는 방식에서 컴포넌트 간 거리가 먼 경우 고려할 수 있다. 사용 방법은 다음과 같다.

```jsx
const Context = createContext();

function Child() {
  const value = useContext(Context);

  return <>{value ? value.hello : ""}</>;
}

function Parent() {
  return (
    <>
      <Context.Provider value={{ hello: "react" }}>
        <Context.Provider value={{ hello: "javascript" }}>
          <Child />
        </Context.Provider>
      </Context.Provider>
    </>
  );
}
```

### useReducer

`useReducer`는 성격이 비슷한 여러 상태를 묶어 관리할 때 효과적이다.

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "up":
      return { count: state.count + 1 };
    case "down":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleUpClick() {
    dispatch({ type: "up" });
  }
  // ...
}
```

### useLayoutEffect

useEffect와 동일한 모습으로 동작하지만, 실행 순서가 다르다.

1. 리액트가 dom 업데이트
2. useLayoutEffect 실행
3. 브라우저에 변경 사항 반영
4. useEffect 실행

## 커스텀 훅 vs HOC

컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶으면 커스텀 훅을, 렌더링의 결과물에도 영향을 미치는 공통 로직이라면 HOC를 사용하자. 단, 고차 컴포넌트는 많아질수록 복잡성이 증가한다.
