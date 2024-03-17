# 3장 리액트 훅 깊게 살펴보기

## 3.1 리액트의 모든 훅 파헤치기

> 함수 컴포넌트는 매번 함수를 실행해 렌더링을 수행한다.

### useState

상태를 정의하고 이 상태를 관리할 수 있게 해주는 훅

```js
import { useState } from "react";
const [state, setState] = useState(initialState);
```

useState 인수로 초기값을 설정할 수 있으며, 초기값은 undefined
useState 훅의 반환값은 배열, 첫번째 원소는 state 값 자체를 사용할 수 있으며, 두번째 원소는 setState함수로 state의 값을 변경할 수 있다.

클로저 (함수의 실행이 끝났음에도 함수가 선언된 환경을 기억)로 인하여 매번 실행되는 함수 컴포넌트 환경에서 state 값이 유지된다.

**useState 초기화**

```js
//원시값 (값을 바로 집어 넣는다)
const [count, setCount] = useState(0);

//게으른초기화 lazy initialization (함수를 실행해 값을 반환)
const [count, setCount] = useState(() => {
  console.log("복잡한 연산");
  return 0;
});
```

이 초기화 함수는 state가 처음 만들어질 때만 실행되며 이후 리렌더링 시 함수 실행은 무시된다.
따라서 localStorage나 sessionStorage에 대한 접근 / map, filter, find같은 배열에 대한 접근/ 혹은 초깃값 계산을 위해 함수 호출이 필요할 때와 같이 무거운 연산을 포함해 실행 비용이 많이 드는 경우에 게으른 초기화를 사용하는 것이 좋다.

### useEffect

컴포넌트가 렌더링된 후에 어떠한 부수효과를 일으키고 싶을때 사용하는 훅.

- 컴포넌트의 여러 값들을 활용해 동기적으로 부수효과를 만든다.
- 렌더링할 때마다 의존성 있는 값을 보면서 이 의존성의 값이 이전과 다른게 하나라도 있으면 부수 효과를 실행하는 함수이다.

```js

//의존성 배열 o
useEffect(()=>{

  //부수 효과가  포함된 함수

  // 의존성 변화가 있었을 당시 이전의 값을 기준으로 실행, 이전 상태를 clear
  return ()=>{

  }

},[의존성 배열])

//의존성 배열 x
useEffect(()=>{
  console.log('컴포넌트 렌더링됨')
})

//의존성 배열 []
useEffect(()=>{

  //unmount 시에 실행된다.
  //클린업 함수
  return ()=>{

  }
},[])
```

**의존성배열**
빈배열 : 최초 렌더링 직후에 실행되고 다음부터는 실행되지 않는다.
아무값이 없음 : 렌더링이 발생할 때마다 실행된다. ( 컴포넌트가 렌더링 됐는지 판단하기 위한 방법으로 사용)

**return **
useEffect는 return 값은 해당 effect가 더이상 실행할 필요가 없을 때 청소하는 용도이다.

- dependancy가 바뀌어서 effect가 달라져야할 때, 이전 effect clear (첫번째 예시 )
- 해당 component가 unmount 될 때 ( 3번째 예시)

**useEffect 사용 시 주의할 점**  
많이 사용하지만 주의해야하는 훅이다.  
예기치 못한 버그나, 무한루프에 빠지기도한다.

- 빈배열
  - 콜백함수 내에서 특정값을 사용한다면, 부수효과가 실제로 관찰해서 실행되야 하는 값과 별개로 작동한다.
  - 빈 배열을 사용하기 전에 정말로 useEffect의 부수효과가 컴포넌트 상태와 별개로 작동해야하는지 검토해야한다.
- 해당 값으 변경 시점을 피할목적
  - 메모이제이션, 적당한 실행위치 고려

**useEffect의 콜백함수에 함수명을 부여하라.**  
이로인해 목적을 파악하기 쉬워지며, 그 책임을 최소한으로 좀힌다는 점에서 유용하다.

```js
//익명함수
useEffect(() => {
  logging(user.id);
}, [user.id]);

// 기명함수
const logActiveUser = () => {
  logging(user.id);
};
useEffect(logActiveUser, [user.id]);
```

**거대한 useEffect**  
렌더링 시 의존성이 변경될 때마다 부수효과를 실행한다.  
적은 의존성 배열을 사용하는 여러개의 useEffect로 분리하는 것이 좋다.  
거대하고 관리하기 어려워진다면 언제 부수효과가 일어나는지 알 수 없다.  
**_불가피한 상황이라면 useMemo, useCallback과 등으로 사전에 정제한 내용들만 useEffect에 담아두는 것이 좋다._**

### useReducer

### useMemo

비용이 큰 연산에 대한 결과를 저장해두고 **저장된 값**을 반환하는 훅

```js
const data = useMemo(()=>{
  //값을 반환하는 생성함수
},[의존변수,...])
```

- 첫번째 인수 : 값을 반환하는 생성함수
- 두번째 인수 : 의존하는 값의 배열

### useCallback

인수로 넘겨받은 콜백 자체를 기억한다.  
리렌더링 시 특정 함수를 새로 만들지 않고, 재사용 한다.

```jsx
const ChildComponent = memo(({ name, value, onChange }) => {
  useEffect(() => {
    console.log("rendering!", name);
  });
  return (
    <>
      <h1>
        {name} {value ? "on" : "off"}
      </h1>
      <button onClick={onChange}>toggle</button>
    </>
  );
});
const App = () => {
  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(false);

  const toggle1 = () => {
    setStatus1(!status1);
  };
  const toggle2 = () => {
    setStatus2(!status2);
  };

  return (
    <>
      <ChildComponent name="1" value={status1} onChange={toggle1} />
      <ChildComponent name="2" value={status2} onChange={toggle2} />
    </>
  );
};
```

위의 경우에는 첫번쨰 컴포넌트인 ChildComponent 에서 버튼을 눌러 status1이 변화될 경우, state1 값이 업데이트 되면서 App이 리렌더링 된다.
이 때,memo로 감싸져있고 status1만 변화되었으니, 첫번째 자식 컴포넌트만 리렌더링 될거라 생각하겠지만 두번째도 리렌더링된다.
이유는 매번 onChange로 넘기는 함수가 재생성되어 다른곳을 참조하고 있기 때문이다.

```js
const toggle1 = useCallback(() => {
  setState1(!status1);
}, [state1]);
```

이렇게 처리가 된다면, 의존성이 변했을 때를 제외하고는 함수가 재생성되지 않는다.

### useRef

useRef, useState 공통점

- 컴포넌트 내부에서 렌더링이 일어나도 변경 가능한 상태값을 저장한다
  useRef, useState 차이점
- useRef는 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경할 수 있다.
- useRef는 그 값이 변하더라도 렌더링을 발생시키지 않는다.  
  즉, 렌더링을 발생시키지 않고 원하는 상태값을 저장하여 이전값을 기억하도록 만들 수 있다.

### useContext

부모가 가지고 있는 데이터를 자식에서 사용하고 싶다면 props로 데이터를 넘겨준다. 컴포넌트와 컴포넌트 사이가 멀수록 코드가 복잡해짐으로, prop drilling이 발생한다.
context를 사용하여 props로 불필요한 곳까지 전달할 필요 없이 하위 컴포넌트 어디에서든 값을 사용할 수 있다.

이 말이, 렌더링이 최적화 된다는 뜻은아니다.
주입된 상태만 사용할 수 있을 뿐이고 중간 컴포넌트도 memoization을 하지 않으면 값이 변경되지 않았더라도 리렌더링 된다.

### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

useState의 심화 버전

- 반환값
  - state : 현재 useReducer가 갖고있는 값
  - dispathcer: state를 업데이트하는 함수 , setState는 단순히 값을 넘겨준다면, dispathcer는 action 을 넘겨준다.
- 인수
  - reducer:상태가 어떻게 업데이트할 지 명시한 함수
  - initialArg : 초기값
  - (선택사항) init : 초기값을 반환하는 초기화 함수. init가 있으면 init(initialArg)를 호출한 결과로 설정되고 없을 경우 초기 값은 initialArg 값으로 설정된다.

useReducer나 useState 둘 다 세부 작동과 쓰임에만 차이가 있을 뿐, 결국 클로저를 활용해 값을 가둬서 state를 관리한다는 사실에는 변함이 없다.

### useImperativeHandle

- useImperativeHandle은 부모에게서 넘겨받은 ref를 부모가 원하는 대로 수정할 수 있는 훅이다.
  ref는 useRef에서 반환한 객체로, 컴포넌트의 props인 ref에 넣어 부모가 자식 컴포넌트 HTMLElement에 접근하는 용도로 흔히 사용된다. (forwardRef)

컴포넌트의 최상위 레벨에서 useImperativeHandle을 호출하여 노출할 ref 핸들을 사용자가 직접 정의할 수 있다.

### useLayoutEffect

모든 DOM의 변경 후에 useLayoutEffect의 콜박함수 실행이 동기적으로 발생한다. (동기적으로 발생한다는 것은 리액트의 useLayoutEffect의 실행이 종료될 때까지 기다린 다음에 화면을 그린다는 것을 의미)
DOM 변경이란 렌더링이지, 브라우저에 실제로 해당 변경 사항이 반영되는 시점을 의미하는 것은 아니다.
항상 useLayoutEffect가 useEffect보다는 먼저 실행된다. 이는 useLayoutEffec가 브라우저에 변경 사항이 반영되기 전에 실행되는 반면 useEffect는 브라우저에 변경 사항이 반영된 이후에 실행되기 때문이다.

useLayoutEffect의 특징상 DOM은 계산됐지만 이것이 화면에 반영되기 전에 하고 싶은 작업이 있을 때와 같이 반드시 필요할 때만 사용하는 것이 좋다. 특정 요소에 따라 DOM 요소를 기반으로 한 애니메이션, 스크롤 위치를 제어하는 등 화면에 반영되기 전에 하고 싶은 작업에 useLayoutEffect를 사용한다면 useEffect를 사용했을 때보다 훨씬 더 자연스러운 사용자 경험을 제공할 수 있다.

### 커스텀 hooks 만들기

### 다른 hooks

### 정리

상태 값을 초기화하는 방법은 단순히 원시값만 할당할 수 있는줄 알았는데, 함수도 가능하다니 ?
