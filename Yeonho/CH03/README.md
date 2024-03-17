# Chapter 02 - React Hook

함수형 컴포넌트(Functional Component)를 구성할 때 React에서 기본적으로 제공하는 Hook을 사용하여 컴포넌트를 구성할 것이다.

각 Hook이 어떻게 구성이 되는 지 어떤 목적때문에 만들어진 것으로 보이는지 확인해보자.

기본적으로 React에서 제공하는 Hook들은 SECRET INTERNALS 상태이기 때문에 자세한 구현 로직은 알 수 없다.
그래서 책에서는 React가 아닌 경량화된 Preact의 구현 코드를 기준으로 하며, React와 100% 같다고 볼수는 없다.

### useState

useState의 기본적인 사용 방법

```JavaScript
import { useState } from 'react'

const [state, setState] = useState(initialState)

```

useState 훅은 기본적으로 위와 같이 state를 상태로, setState를 상태 변경 시 setter로서 사용한다.
처음 initialState가 없다면 초깃값은 undefined로 정의된다.

만약 위의 useState를 사용하지 않고 (아예 react를 모른다 가정했을 때), 컴포넌트를 구성한다면 아래와 같이 구성할 수도 있겠다.

```JavaScript
function Component() {
    let state = 'hello'

    function handleButtonClick() {
        state = 'hi'
    }

    return (
        <>
            <h1> {state} </h1>
            <button onClick = {handleButtonClick}>hi</button>
        </>
    )
}
```

위 컴포넌트의 예상되는 동작으로는 처음 h1에 들어가는 string은 hello이며 버튼을 누르게 된다면 hi로 변경되는 것이 목적일 것이다.
하지만, state는 변경되지 않는다.

앞서 CH02에서 react는 JSX로 작성한 컴포넌트를 `react.createElement()`로 변환시킨다 하였다.
이후, 컴포넌트 업데이트는 컴포넌트 내부의 state가 업데이트 될 때 이루어진다고 하였다.
이때, `let state = 'hello'`는 react state가 아니기 때문에 업데이트 되지 않는다.
(여기에 더해서, react update시 컴포넌트 호출을 할텐데 `let state` 로 정의한 부분이나 arrow function 으로 정의한 것들은 다시 **_재생성_**된다. 계속 호출이 되기 때문이다.

이를 막을 여지가 있는 곳에서는 뒤에 나오는 내용이지만 `useCallback`으로 감싸주면 된다. )

그러므로, react를 사용하는 환경에서는 **_"상태"_** 를 사용하기 위해서는 useState를 통해 선언해야한다.

`setState`에 대해서도 알아보자
`setState((prev) => prev + 1);` 와 같은 형태로 setter를 사용시 prev에는 이전 state 값이 들어가있음을 예상할 수 있다.

책에서 Preact를 참조한 코드를 보면 useState는 아래와 같이 표현되어있다.

```JavaScript
const MyReact = (function () {
    const global = {}
    let index = 0

    function useState(initialState) {
        if(!global.states) {
                // App 전체의 States를 배열로 초기화 한다.
                // 최초 접근이라면 빈 배열로 초기화한다.
            global.states = []
        }

        // states 정보를 조회하여 현재 상태값이 있는지 확인하고,
        // 없다면 초기값으로 설정한다
        const currentState = global.states[index] || initialState
        // states의 값을 위에서 조회한 현재 값으로 업데이트 한다.
        global.states[index] = currentState

        // 즉시 실행 함수로 setter를 만든다.

        const setState = (function () {
            // 현재 index를 클로저로 가둬놔서 이후에도 계속해서 동일한 index에 접근할 수 있도록 한다.
            let currentindex = index
            return function (value) {
                global.states[currentIndex] = value
                // 이후 컴포넌트를 렌더링한다...
                // ...
            }
        })()
        // useState를 쓸 때마다 index가 하나씩 추가된다. 이 index는 setState에서 사용된다.
        // 즉, 하나의 state마다 index가 할당되어있어 그 index가 배열의 값(global.states)를
        // 가리키고 필요할 때마다 그 값을 가져오게 한다.
        index = index + 1

        return [currentState, setState]
    }

    function Component() {
        const [value, setValue] = useState()
        // ...
    }
})

```

위 코드를 보면 컴포넌트를 막론하고 useState 호출 시 index를 통해 구별하는 것으로 보인다.
또한 setState는 IIFE(Immediately-invoked function expression, 즉시 실행 함수)로 구성되어있는데
클로저로 index를 잠궈버려, 컴포넌트에서 받게되는 setState는 항상 같은 index를 가지고 있다.

#### 게으른 초기화

```JavaScript
// 원시값을 그대로 집어넣음 => 초기값에 필요없는 최초 렌더링 시에도 아래의 state 작업이 계속돌아감
Number.parseInt(window.localStorage.getItem()) // 이 부분이 리렌더링시 계속 호출됨, 근데 state 반영은 안됨

const [count, setCount] = useState(Number.parseInt(window.localStorage.getItem(cacheKey)));

//보통 state는 원시값으로 초기화를 하지만 위와와 같은 함수 호출이 필요한 경우에는 아래처럼 선언하면 필요없는 연산을 줄일 수 있음

// 처음 state가 만들어질 때만, 함수를 실행하여 값을 반환함
// 최초만 함수를 실행함, state 정의 시 무거운 연산이 요구될 때 사용하라고 react에서 권고함
const [count, setCount] = useState(() =>Number.parseInt(window.localStorage.getItem(cacheKey)));
```

arrow function을 통해 함수 호출형태를 initialState로 넘기면, **_최초 렌더링_** 시에만 함수 호출을 하니, 리렌더링 시 무거운 연산을 그대로 하지 않을 것이다.

### useEffect

우선, useEffect 는 이전 class 형태의 생명주기 메서드를 대체하기 위해 만들어진 훅이 아니다.
state나 props의 변화로 인한 영향이 필요한 경우 사용하기 위한 hook이다.

아래는 useEffect를 설명할 때 흔히 알 수 있는 동작과 기능들이다.

- useEffect는 두 개의 인수를 받으며, 첫 번째는 콜백, 두 번째는 의존성 배열이다. 이 두번째 의존성 배열의 값이 변경되면 첫 번째 인수인 콜백을 실행한다.

- 클래스 컴포넌트의 생명주기 메서드와 비스무리한 작동을 구현할 수 있다. 의존성 배열에 빈 배열을 넣으면 컴포넌트가 마운트 될 때만 실행된다.

- useEffect는 클린업 함수를 반환할 수 있는데, 컴포넌트 언마운트 시 실행된다.

아까 위에서 정의한 코드를 살짝 다르게 해보자

```JavaScript
function Component () {
    const counter = 1

    useEffect(() => {
        console.log(counter)    // 1, 2, 3, 4
    })

    function handleButtonClick() {
         counter = counter + 1;
    }

    return (
        <>
            <h1>{counter}</h1>
            <button onClick={handleClick}>+</button>
        </>
    )
}
```

**_엥 state가 아닌데 왜 useEffect에서 counter가 찍히나요..?_**
useEffect에 dependency array가 아예 없기 때문이다.
useEffect는 JS의 Proxy나 데이터 바인딩,옵저버와 같은 특별한 기능을 통해 값의 변화를 관찰하는 것이 아니고,
렌더링 할 때마다 의존성에 있는 값을 보며 이전과 다른 것이 하나라도 있으면 부수효과를 실행하는 평범한 함수라 볼 수 있다. (하나라도 다른 것이 있다면,,,,)

위에서는 onClick으로 인하여 useEffect가 돌아간다고 볼 수 있겠다.
그래서 state나 props가 없음에도 위의 useEffect 안에 있는 console.log가 계속해서 찍힌다.

dependency array가 [] 으로 들어가게 된다면, 처음 선언 시에만 동작하게 되고 이후에는 비워져있기 때문에 비교가 되지 않는다. => 그러므로 컴포넌트 마운트와 비슷하게 생명주기를 따라할 수 있는 것이다.

#### Clean up

Clean up은 정확히, 컴포넌트 언마운트 시 실행되는 release의 역할보다는
state 변화로 인해 **_이전 state 값에서 미처 처리하지 못한 부분을 해결_**하는 것이 조금 더 옳은 방향인 것으로 보인다.

최초 빈 배열([])의 dependency array 가 있는 useEffect의 경우 컴포넌트가 없어졌기 때문에 useEffect의 반환값으로 실행되는 것이다. 그래서 컴포넌트의 처음과 끝에만 실행된다.

#### dependency array

말 그대로 useEffect 내부에서 돌아가는 로직이 어떠한 state에 의존되어있는 지를 명시할 수 있는 array이다.
명시하지 않아도 된다. 하지만 이로인한 side effect는 장담할 수 없다.

**_SSR 관점에서 useEffect는 client side에서 실행되는 것을 보장해준다고 하였다._**
client에서 계산이 필요한 경우 useEffect로 감싸서 던져주면 분리가 될 것으로 보이는데, SSR을 안해봐서 이 부분은 잘 상상이 안된다.

근데 어차피 SSR을 하는거면 그냥 안 쓰는 방향으로 가는 게 맞을지도...

책에서의 useEffect 내부 코드 예시를 봤을 때, dependency array에 있는 state들의 이전 값과 현재 값의 얕은 비교를 수행한다.

이는, 1개의 useEffect라면 별 문제 없어보이지만 다수의 컴포넌트에서 다수의 useEffect를 사용했을 때 (심지어 state도 무거웠을 때) render 이후 퍼포먼스 저하가 있을 것으로 보인다.

생각보다 똑똑한 것보다는 무식에 가까운 것이라는 정리가 된다.

그러니 꼭 state 변화에 대응하기 위해서만 사용하자...!...!...!!!!!!!!!!

책의 저자는 useEffect의 과도한 사용을 막기 위해 여러가지 방법을 알려주었다.

1. react-hooks/exhaustive-deps - useEffect의 로직에서 사용되는 state는 dependency array에 있는 것만 사용하는 것을 강제한다. -> 숨이 턱 막힐 수 있지만, 어지간한 영역들은 컴포넌트를 쪼개면 해결될 것이다.
   -> 그럼에도 불구하고 해결이 되지 않을 것 같다면, 내가 처리하는 영역이 UI의 영역인지 아닌지를 확인하자

2. useEffect의 첫 번째 인수에 함수명을 부여하라 - 이거는 직접 보면 뭔말인지 알듯

```JavaScript
useEffect(
    function logActiveUser() {
    logging(user.id)
}, [user.id]) // 근데 좀 보기 싫은 형태인듯
```

위와 같이 함수 명칭을 작성하면 useEffect를 왜 사용하였는지를 알 수 있을 것이다.

3. 거대한 useEffect를 만들지 말것 - 이거는 1번이랑 거의 일맥상통하는 내용이다.

4. 불필요한 외부 함수를 만들지 말 것 fetch의 예시를 보자

```JavaScript

function Component({id} : {id : string}) {
    const [info, setInfo] = useState<number | null>(null)

    useEffect(() => {

        const controller = new AbortController()

        (async () => {
            const result = await fetchInfo(id, { signal : controller : signal })
            setInfo(await result.json())
        })()

        return () => controller.abort()
    }, [id])

    return <div>{/** */}</div>
}

```

위 코드는 정리된 코드이며, 이전이라하면 저 fetchInfo가 component 내부에서 useCallback으로 감싸져있는 형태였다.
저자는 useEffect를 통해서 나오는 effect라면, useEffect 내부에서 처리하라는 의견이다.

중간에 IIFE를 useEffect 내부에서 선언한 이유는 useEffect에 전해주는 callback은 기본적으로 async를 거는 것을 권고하고 있지 않다. state 변화로 인한 경쟁 상태가 일어날 수 있기 때문이다.

책에서 clean up을 활용해 state 변화에 따른 중복 요청이라던가 비동기 시 일어날 수 있는 문제들을 해결할 수 있는 방법을 알려줬지만

사실 예제 코드는 매우 단편적인 부분이고 useEffect 내부에서 위와 같은 상황을 안만드는 방향으로 먼저 생각하는 것이 좋을 것으로 보인다.

useEffect는 렌더링 단계에서 Commit Phase 이후 (DOM에 반영이 된 이후) **_비동기적으로 수행_**된다.

이는 useEffect 에 직접적으로 DOM에 영향을 주는 코드가 있을 경우 문제가 될 수 있는 부분이다.

### useMemo

useMemo는 비용이 큰 연산에 대한 결과를 저장(메모이제이션)해 두고, 이 저장된 값을 반환하는 훅이다.
이를 언제 사용하는 지, 얼마나 효과가 있을 것인지는 사람에 따라 다르기 때문에 직접 확인해야한다.

컴포넌트는 `useMemo` 보다 `React.memo`로 메모이제이션 하는 것이 조금 더 현명한 방법일 것이다.
props를 전부 비교하긴 하지만 비교방식 수정도 가능하기때문이다. (부모가 업데이트 되어도 막을 수 있다.)

### useCallback

useMemo는 값을 저장했었다면, useCallback은 함수를 저장한다.

즉, 리렌더링이 일어나서 컴포넌트 업데이트가 일어날 때마다 함수가 재생성 되지 않는다.

useMemo를 통해 useCallback을 구현할 수 있다. JS에서는 결국 함수도 값으로 표현이 되기 때문이다.

### useRef

useRef는 useState와 동일하게 컴포넌트 내부에서 렌더링이 일어나도 유지와 변경이 가능한 상태값을 저장한다는 공통점이 있다. (컴포넌트 내부에서 사용하는 변수는 모두 컴포넌트에 영향을 끼칠 수 있으니 상태라 칭하는 것으로 보임)

useState와 구별되는 차이점은 두 가지이다.

- useRef는 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경할 수 있다.
- useRef는 그 값이 변하더라도 **렌더링을 발생시키지 않는다.**

기본적으로 우리가 사용하는 variable과 유사하게 사용이 가능하다.
컴포넌트가 렌더링 될 때만 생성되며, 컴포넌트 인스턴스가 여러 개라도 각각 별개의 값만을 바라보고 있다.

useRef는 보통 DOM Element 접근 시 사용된다.
직접적으로 DOM을 조작할 일이 있을 경우 이는 useState에서 사용하는 렌더링을 유발하는 state가 연결되면 side effect에 대한 염려가 있을 것이다.

useRef는 commit phase 이후 업데이트 되기 때문에, 이러한 염려가 없다.
하지만 commit phase 이후이기 때문에 ref 자체를 rendering에 태우게 된다면 문제가 발생할 것이다.

```JavaScript
const a = () => {

    const a = useRef(0);
    a.current = 3;
    // ...

    return (<div>{a.current}</div>)
}
```

위와 같이 current를 사용하면 렌더링 과정에서 side effect가 일어날 수 있다는 것이다.
컴포넌트의 렌더링과 관련된 상태는 useState로, 그 외 렌더링과 관련이 없는 것들은 useRef를 사용하면 된다.

### useContext

Props drilling hell을 해결할 수 있는 방법이지만, Context의 내부 state가 변경되면 ContextProvider가 감싸고 있는 모든 컴포넌트는 리렌더링 된다.

또한, context provider 아래에 있는 자식들은 context에 종속되는 결과를 가져오기 때문에 재사용성이 어려워진다.

장점이라면 장점일 수도 있겠지만, context는 어지간하면 정말 전역적인 상황에서만 사용되어야 할 것으로 보인다.

Context를 통해 전역 상태관리자를 사용하지 않을 수는 있지만 정말 어려울 것으로 보인다.

### useReducer

반환값은 useState와 동일하게 길이가 2인 배열이며, 3개의 인수를 필요로 한다.

반환값은 아래와 같다.

- state : 현재 useReducer가 가지고 있는 값을 의미
- dispatcher : state를 업데이트 하는 함수, setState는 값을 넘겨주지만 dispatcher는 action을 넘겨줘야 한다.

인수는 아래와 같다.

- reducer : useReducer의 기본 action을 정의하는 함수
- initialState : useReducer의 초기값
- init : 옵셔널하며, 게으른 초기화를 할 수 있다. 이 인자에 callback을 넘기면 initialState은 init 함수가 실행된 반환값을 가지게 된다.

간단한 예제만 보자

```TypeScript
type State = {
    count : number
}

type Action = { type : 'up' | 'down' | 'reset'; payload?: State}

function init(count: State) : State {
    return count;
}

count initialState : State = { count : 0 }

function reducer(state : State, action : Action) : State {
    switch (action.type) {
        case 'up':
            return { count : state.count + 1}
        case 'down':
            return { count : state.count - 1 > 0 ? state.count - 1 : 0}
        case 'reset':
            return init(action.payload || {count : 0})
        default:
            throw new Error(`Unexpected action type ${action.type}`)
    }
}

export default function App() {
    const [state, dispatcher] = useReducer(reducer, initialState, init)

    function handleUpButtonClick() {
        dispatcher({ type : 'up'})
    }
        function handleDownButtonClick() {
        dispatcher({ type : 'down'})
    }
        function handleResetButtonClick() {
        dispatcher({ type : 'reset', payload: { count : 1}})
    }

    // ...

}
```

위와 같이 사용하며, useReducer의 사용법은 useState에 비하여 복잡성을 띄고 있지만, 결국 state의 변형을 사전에 정의된 대로만 움직이고 싶다는 의미로서 사용된다.

### useImperativeHandle

잠깐 `forwardRef`를 알아보자

`forwardRef`는 부모가 자식의 ref 들을 통제할 수 있도록 하는 것이다.

이렇게 되었을 때 부모는 자식들이 가진 ref를 받아서 총괄을 할 수 있으며, 자식들은 더욱 자신의 UI 표현에 집중할 수 있는 컴포넌트가 된다. (props로 내리면 명칭을 맞춰줘야하니... forwardRef를 사용하면 ref를 확실하게 올려 보내겠다는 의사표현이 될 수도 있다.)

`useImperativeHandle`는 부모에게서 넘겨받은 ref를 자식이 원하는 대로 수정할 수 있는 훅이다.
이거는 자식 컴포넌트가 가지고 있는 특징을 부모가 사용해야할 때 쓸 수 있을 것으로 보인다.
가끔은 자식이 가진 것들에 의존해야할 수 있기 때문인 것으로 보인다.

```JavaScript
const Input = forwardRef((props, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            alert : () => alert(props.value)
        }),
        [props.value]
    )

    return <input ref ={ref} {...props}/>
})

function App() {

    const inputRef = useRef()
    const [text, setText] = useState('')

    function handleClick() {
        inputRef.current.alert()
    }

    function handleChange(e) {
        setText(e.target.value)
    }

    return (
        <>
            <Input ref={inputRef} value ={text} onChange={handleChange} />
            <button onClick={handleClick}>Focus</button>
        </>
    )
}

```

예제 코드를 보니 조금 요상한 형태로 보인다.
결국 부모가 자식전용 ref를 만들어서 넘겨주고, 자식은 이 ref를 `useImperativeHandle`로 감싸서 부모도 제어할 수 있도록 하는 방법인 것으로 보인다.
일반적인 상황에서는 잘 못쓰겠다만, 언젠가 쓰임세는 있을 것으로 보인다.

### useLayoutEffect

useLayoutEffect는 commit phase 직전에 동기적으로 실행된다.
그러니, DOM이 완전히 업데이트 되기 전에 실행되는 것이라 보면 좋다.

useEffect는 DOM이 업데이트 된 이후 비동기적으로 실행되는 부분이었으니 확실한 차이가 발생하며
일반적으로 useLayoutEffect는 useEffect 이전에 실행되는 것으로 보인다.

보통 DOM이 완전히 업데이트 되기 직전에 무언가 작업을 하고싶을 때 해주면 좋을 것으로 보인다.
보통 직접적으로 DOM 요소를 기반으로 한 애니메이션, 스크롤 위치 제어 등을 예로 들었다.

### useDebugValue

개발과정에서 사용할 수 있는 훅이며 DevTools에 표현되는 것으로 보인다.
다른 훅 내부에서만 실행할 수 있으며, 컴포넌트 레벨에서는 작동되지 않는다.

### 훅의 규칙

훅 사용 시 규칙이다.

> - 최상위에서만 훅을 호출해야 한다. (이 규칙을 따라야만 컴포넌트 렌더링 시 항상 동일한 순서로 훅이 호출되는 것을 보장할 수 있다.)

이는 파이버 객체 내에서 순서에 의존해 state나 effect의 결과에 대한 값을 저장하고 있기 때문이며, 이를 어길 경우 리액트 코드는 에러를 발생시킨다.

> - 훅을 호출할 수 있는 것은 React Functional Component, Custom Hooks 뿐이다. 일반적인 Vanilla 환경에서는 사용할 수 없다.

## 사용자 정의 훅 (Custom Hook)

다른 컴포넌트간에 공통적으로 사용될 수 있는 react state를 정의하며, state에 대한 로직 또한 공유가 가능하다.
React hook은 이름의 앞에 use를 꼭 붙이는 네이밍 법이 있으며, 만약 이를 어기고 사용하게 된다면 에러가 발생하게 된다.

## HOC

컴포넌트 자체의 로직을 재사용하기 위한 방법이다.
컴포넌트를 인자로 받아 새로운 컴포넌트를 내뱉는 방법이다.

주로 공통된 로직이 필요한 경우 사용되지만, 단점으로는 이러한 로직들을 죄다 HOC처럼 만들게 된다면
컴포넌트마다 죄다 고차컴포넌트를 감싸야한다는 것이다.

## 뭘 써야하나요?

둘 모두 유사하나

**Hook은 React State를 비롯하여 컴포넌트 내부에서 조정을 해야하는 경우 자주 사용될 것으로 보인다.**

- 실제로 react hook을 사용할 때 hook이 export하는 state나 함수들을 적재적소에 사용할 수 있는 것이 장점인 것 같다.(뇌피셜)

**고차함수는 컴포넌트 내부에서 조정 필요없이 한번에 컴포넌트를 감싸줄 필요가 있을 때 사용될 것으로 보인다.**

- props로 받을 수 있지않나 ? -> 그런거라면 hook이 더 명확해보임
