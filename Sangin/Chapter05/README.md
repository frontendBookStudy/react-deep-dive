# 05 리액트와 상태 관리 라이브러리

## 5.1 상태 관리는 왜 필요한가?

### 5.1.1 리액트 상태 관리의 역사

리덕스: 알려주고 넘어가지...
Context: 그냥 드릴링만 피한 것. 책에서도 주입을 위한 것이라고 하는 것처럼 관리 측면에서 의미는 없어보임

## 5.2 리액트 훅으로 시작하는 상태 관리

### 5.2.1 가장 기본적인 방법: useStatedㅘ useReducer

useState, useReducer는 각 컴포넌트만을 위한 지역 상태만 관리할 수 있음

### 5.2.2 지역 상태의 한계를 벗어나보자: useState의 상태를 바깥으로 분리하기

createStore, useStore 무진장 복잡하네

1. state 초기 값을 설정함
2. callbacks set을 선언함
3. getter를 선언 -> 현재 state를 반환
4. setter를 선언 -> state를 바꿀 수 있는 setter를 반환함 -> useStore에서 반환하는 setter=useState에서 반환한 setter인데, 이 시점에 만들어진 이 setter를 호출함
5. useStore에서 반환된 setter를 호출하면 직접적으로 store의 state가 바뀌고 각 subscriber callback을 실행함 -> 이 때 useState에서 반환된 setter가 호출되면서 리렌더링 됨

useSubscriptiond는 한술 더 뜨네... pass

### 5.2.3 useState와 Context를 동시에 사용해 보기

🐶복잡해 🤣

### 5.2.4 상태 관리 라이브러리 Recoil, Jotai, Zustand 살펴보기

![alt text](image.png)
![alt text](image-1.png)

> 알려주세요.. 😳

쭉 보면서 든 생각인데 코드만 쭉 보고 구조를 보는게 딱히 의미가 없는 것 같음. 실제로 만들고자 하면 그 때 보면 될 것이고, 이런 구조가 다른 때에 영감을 줄 수는 있겠지만 굳이 이렇게까지 만들기에는 프레임워크, 라이브러리가 아니면 의미가 없을 정도로 복잡한 것 같음
