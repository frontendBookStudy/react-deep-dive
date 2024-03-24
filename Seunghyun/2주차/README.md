# 🐻 03. 리액트 훅 깊게 살펴보기



## 새로 알게된 내용들, 실무에서 적용할 수 있는 부분

AuthHOC을 만드는중인데, 많은 도움이 되었다! 일찍 봐서 다행이다!
- 중첩이 많이 생기면 리렌더링이 많이 생기고 순서를 보장할 수 없다. -> userRoleHoc을 만들려고 했는데, 하나로 만들어야 겠다. 
- 전역 관리할 값을 memo로 감싸주자. react.memo는 useMemo와 다르다.
- 나머지 permissions 값들은,,, hooks로 처리하는 방법을 고려해봐야겠다.
- studio 특정로직에 with~로 시작하는 HOC를 만들어서 감싸면 되겠다!


- context는 그 자체로 최적화를 해주지 않으며, 그냥 값을 내려줄 뿐이다.


## 이해가 안되거나 궁금했던 점
- 왜 이벤트를 추가했을 때 클린업 함수를 시작해야 하는지..? 이해하지 못했다..!
- js 기본 개념 틈틈히 보충하자..!


## 책 내용 정리

- 3.1 리액트의 모든 훅 파헤치기
    - useState
    - useEffect
    - useMemo useCallback
    - useRef
    - useContext
    - useReducer
    - useImperativeHandle, useLayoutEffect, useDebugValue
- 3.2 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?
---
 ### 3.1 리액트의 모든 훅 파헤치기

#### useState
 함수 컴포넌트는 
 1. <b>return</b>을 (클래스 컴포넌트 - render함수) 실행한다 === 함수를 실행한다
 2. 함수 내부의 값은 함수가 실행될 때마다 다시 초기화 된다.

 렌더링은
 1. 이 함수의 실행 결과를 이전의 리액트 트리와 비교해 리렌더링이 필요한 부분만 업데이트 한다.

 리액트는 useState를 상수처럼 사용하기 위해 <b>클로저</b>를 이용했다.

클로저는 어떤 함수 내부에 선언된 함수(setState)가 함수의 실행이 종료된 이후에도(usestate가 호출된 이후에도), 지역변수인 state를 계속 참조할 수 있다.
클로저 내부에 useState오ㅏ 관련된 정보를 저장해두고, 이를 필요할때마다 꺼내놓는다.

<b>게으른 초기화: lazy initialization</b>

useState의 초기값으로 함수를 넘기는것
```js
const [count,setCount] = useState(()=> Number.parseInt(window.localStorage.getItem(catchKey)))
```
초기값이 복잡or무거울 때, 사용한다. 왜냐하면, 초기값에 함수를 넣으면 리렌더링이 발생했을때 이 함수는 실행되지 않기 때문!

> 게으른 최적화를 사용할 때 : 무거운 연산이 요구될 때
> - sessionStorage, localStorage 접근
> - map, filter,find 같은 배열에 접근
> - 함수 호출이 필요할 때

#### useEffect
useEffect는 애플리케이션 내 컴포넌트의 여러 값들을 활용해 동기적으로 부수요과를 만드는 매커니즘.

부수효과가 '어떤 상태값'과 함께 실행되는지가 더 중요함.

useEffect는 두번째 인자값인 의존성 배열이 변경될 때 마다 첫번째 인수인 콜백을 실행하는데, 의존성 배열이 변경된것은 어떻게 알까??
> hint! 함수 컴포넌트는 매번 함수를 실행해 렌더링을 수행한다!
> - =>함수 컴포넌트는 렌더링 시 마다 고유의 state와 props 값을 갖고 있다.
> - 따라서 렌더링 할때마다, 의존성 배열 내의 값이 변경되면(고유값을 갖고있으니까 알 수 있음) 부수효과를 실행하는것이다!
> - 렌더링을 하면, 렌더링 시 갖게된 state, props 값들중에서 내 의존성 배열에 있는 값이 이전과 바뀌면, 콜백을 실행한다!!


<b>clean-up function</b>
실행시점 : 렌더링 된 뒤 실행, 하만 함수가 정의됐을 당시에 선언됐던 이전값을 보고 실행됨
클린업 함수는 이전 state를 참조해 실행된다!

```js
// 1: 렌더링 시 :
// - server-side rendering 시에도 실행
// - 무거운 작업일 경우 렌더링 지연 (=>동기적으로 실행?????)
function Component() {
    console.log('rendering!')
}


// 2: 렌더링이 완료된 이후
// - client-side 실행을 보장
function Component() {
    useEffect(()=>{
        console.log('rendering!')
    })
}
```
useEffect는 의존성배열의 이전값과 현재값의 얕은 비교를 한다!

<b>useEffect사용 팁!</b>
- []빈 배열은 사용하지 않는다!!
    - 마운트했을때만 사용한다는 접근법은 클래스형 컴포넌트와 섞어 생각한것으로 가급적 사용해서는 안된다!
    - [] 를 꼭 사용해야 한다면, 부모 컴포넌트에서 실행되는것이 옳은지 확인해보기
- 빈배열이 아니더라도, 해당값의 변경시점을 피할 목적이라면 메모이제이션 활용하기.
- 첫 번째 인수에 적적한 이름을 사용한 기명함수로 바꾸기
- 훅이 너무 크다면, 적은 의존성 배열을 사용하는 여러개의 useEffect훅으로 분리하기
- 훅 내에서 사용할 정의는 내부에서 만들어서 정의하기, 불필요한 의존성 배열을 줄일 수 있다.



---
 ### 3.2 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

 개발자라면 누구나 중복코드를 피해야 한다.
 리액트에서는 재사용을 관리할 수 있는 두 가지 방법이 있는데, 
 - custom hook (React ONLY)
    - use~
 - higher order component
    - with~

이 두가지이다.

#### Custom Hooks
- use~로 시작
- 리액트의 훅의 규칙은 `react-hooks/rules-of-hooks` 에서 알 수 있음
- hook은 함수 컴포넌트 내부 or 사용자 정의 훅 내부에서만 사용할 수 있다.
- 커스텀 훅을 참고할만한 라이브러리 : use-Hooks, react-use, ahooks

#### HOC, Higher Order Component
- with~
- Higher Order Function의 일종으로, JS의 일급객체, 함수의 특징을 이용해서 JS호ㅏㄴ경이라면 널리 쓰일 수 있다.
- 다양한 최적화 or 중복로직 관리를 할 수 있다.
- react의 HOC중 가장 유명한 컴포넌트는 `React.memo`임.

<b>React.memo</b>

저번장에서, 리액트가 렌더링 되는 조건중의 하나로 '부모 컴포넌트가 렌더링 될 때'를 언급했었다. 이는 자식 컴포넌트의 props 변경 여부와 관계없이 발생한다.

부모의 handleFunction이 변경되면, 부모의 state가 업데이트 되고, 모든 자식들을(state를 쓰지 않는 컴포넌트들도) 렌더링 시킨다.

child component에 memo로 감싸면, 컴포넌트의 props를 비교해 이전과 props가 같다면 렌더링을 생략하고 memoization해둔(기억해둔) 컴포넌트를 반환한다.

```jsx
const ChildComponent = memo(({value}=>{value:string})=> {
    useEffect(()=>{
        console.log('렌더링!")
    })
    return <>안녕하세요! {value}</>
})
```

이렇게 하면, parentComponent에서 아무리 state가 변경되도, childComponent는 다시 렌더링 되지 않는다. memo가 props를 확인하고 변경되ㅣ 않았다는것을 알고 그대로 반환하기 때문이다.

(== 클래스 컴포넌트의 PureComponent와 유사)

- React.memo , useCallback은 모두 useMemo로 표현할 수 있다!

```
const ChildComponent = (({value}=>{value:string})=> {
    useEffect(()=>{
        console.log('렌더링!")
    })
    return <>안녕하세요! {value}</>
})

const MemoizedChildComponent = useMemo(()=>{
    return <ChildComponent value='hello'>
    // useMemo는 값을 반환받기 떄문에 JSX 함수 방식이 아닌 {}를 사용한 할당식을 사용한다는 차이점이 있다.
},[])
```

#### 고차함수 만들기
고차함수 === 함수 컴포넌트 === 함수

고차함수 : 함수를 인수로 받는 함수, 함수를 결과로 반환하는 함수

> (이해안됨)useState의 실행은 함수 호출과 동시에 끝났지만, state값은 별도로 선언한 환경,=== 클로저에 기억된다.

```
function withLoginComponent<T>(Component: ComponentType<T>){
    return function (props: T & LoginProps) {
        
        const {loginRequired, ...restProps } = props;

        if(loginRequired){
            return <>로그인이 필요합니다.</>
        }

        return <Component {...(restProps as T)}>
    }
}

const ExportComponent = withLoginComponent((props:{value:string}) =>{
    return <h3>{props.value}</h3>
})

export default function App() {
    const isLogin = true
    return <Component value='text' loginRequired={isLogin} />
}
```


#### 고차함수를 사용할 때 주의할 점

- 부수효과를 최소화해야 한다!!
    - 반드시 컴포넌트의 props를 임의로 수정, 추, 삭제하는 일은 없어야 한다. 
    - 만약 컴포넌트에 무언가 정보를 제공해줄 목적이라면, 별도 props로 내려주는것이 좋다.
- 여러개의 고차 컴포넌트로 컴포넌트를 감싸지 말라! 
    - 복잡성이 커진다!!

#### custom hook vs HOC

공통점 : 로직을 공통화해 별도로 관리할 수 있음.
> Custom hook을 사용하는 것이 유리할 때 :
>   - 동일한 로직으로 값을 제공
>   - 특정한 훅의 작동을 취할 때 
>       - 훅으로만 공통로직을 격리할 수 있을 경우 - 커스텀 훅 그 자체로는 렌더링에 영향을 미치지 못한다.

> HOC를 사용하는 것이 유리할 때 :
> - 애플리케이션 관점에서 다른 컴포넌트를 노출시킬때
> - 에러 바운더리와 비슷하게 특정 에러가 발생했음을 알리는 컴포넌트를 노출할 때
