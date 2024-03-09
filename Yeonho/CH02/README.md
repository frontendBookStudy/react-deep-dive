# Chapter 02 - React Core

---

# 개요

저는 사실 예전에 한번 Fiber를 살짝 맛 본적이 있습니다.

그래서 조금 더 이야기 하고 싶은 부분이 많았습니다.

과감하게 오늘 날에는 살짝 힘을 덜 줘야할 것 같은 내용은 제쳐두고

자칫 책만 보고 따라가기에는 의문점이 많이 남을 만한 곳들을 저만의 스타일로 좀 긁어보는 정리를 해보려 합니다.

(중간에 먼길 돈다는 뜻)

---

# 1. JSX ?

JSX ( Javascript XML 혹은 JavaScript Syntax eXtension)는 XML과 유사한 구문을 사용하며, **DOM 트리를 생성** 할 수 있는 JavaScript의 확장 표현 _(XML은 eXtensible Markup Language, 확장 가능한 마크업 언어)_ 이라고 위키백과에 적혀져있다.

**_하지만, 사실은 조금 다르다._**

[facebook 공식 JSX 사양 링크](https://facebook.github.io/jsx/)

JSX는 Facebook이 제안하였으며, XML과 유사한 것은 HTML 형태로 마크업 하는 것(~~코?딩?~~)이 친숙하니 형태를 유지한 것으로 보인다.

위의 사양 소개를 보면, JSX 구문은 결국 ECMAScript로 변환하는 것을 목표로 한다.

ECMAScript로 변환하면, 누가 ? HTML로 변환할 것인가 ? -> 이 역할은 React가 해준다.

React는 JSX로 정의한 구문을 Compile하여 React 객체를 만들어주는 React.createElement(...) 를 반환하도록 한다.

> _(그럼 이건 누가 변환해서 브라우저 호환을 시켜주나요 ? => Babel, SWC 등등..의 역할)_

React.createElement()는? React에서 사용하는 객체로 만들어준다. 이건 뒤 이어서 나올 챕터에서 더 자세하게 다룰 것으로 보인다.

### 정리

위 내용을 정리하면 React를 사용할 때 DOM 트리를 생성하는 것은 React가 하는 것이며, JSX는 표현의 영역만을 담당한다.

---

# 2. JSX Component

JSX는 기본적으로 `JSXElement`, `JSXAttributes`, `JSXChildren`, `JSXString` 라는 4가지 컴포넌트를 기반으로 구성되어 있다.

### JSXElement

JSX를 구성하는 가장 기본적인 요소이며, HTML Element와 유사한 역할을 한다.
JSXElement를 구성하는 컴포넌트들도 존재하는데, 아래 표현 방법에서 각각 어떤 것을 의미하는지 적어보았다.

```JavaScript
EX) Test 컴포넌트 정의 할때의 각 JSX 요소들 (부가적으로 Another, Member 와 같은 컴포넌트 명도 사용)

Test - JSXIdentifier, 컴포넌트 식별자
<Test> - JSXOpeningElement
</Test> - JSXClosingElement
<Test> </Test> - JSXOpeningElement JSXClosingElement
<Test/> - JSXSelfClosingElement
<><> - JSXFragment 표현

JSXNamespacedName (<foo:bar></foo:bar>), JSXMemberExpression(<foo.bar></foo.bar>) 와 같은 형태도 있음
아래는 간단 예제

import Components from 'Components';
// import {Button} from 'Components';
function App() {

    return (
        <>

            <Components:Button></Components:Button> - JSXNamespacedName (JSXIdentifier:JSXIdentifier)
            <Components.Button></Components.Button> - JSXMemberExpression (JSXIdentifier.JSXIdentifier)
        </>
    )
}

```

### JSXAttributes

JSXElement에 부여할 수 있는 속성을 의미하며, Optional 하다
JSXSpreadAttributes, JSXAttribute, JSXAttributeName 등으로 구성된다.

```JavaScript
여기 또한 Test Component로...

props = {
    name : "yeonho"
}

JSXSpreadAttributes - <Test {...props}/>
JSXAttribute - <Test name="yeonho2">  여기서 name은 JSXAttributeName, "yeonho2" 는 JSXAttibuteValue

JSXAttributeName : JSXIdentifier JSXNamespacedName
JSXAttributeValue : "", '', {AssignMentExpression}, JSXElement, JSXFragment 사용가능

JSXAttributeValue가 JSXElement를 갖는 경우가 뭔가요?

function Parent({children}) {   /* react context api 등에서 활용 */
    return <div>{children}</div>
}

export default function App() {
    return (
        <div>
            <Parent attribute={<div>Test</div>}/>
        </div>
    )
}

```

### JSXChildren

JSXElement 안에서 표현할 수 있는 자식을 표현하는 것을 JSXChildren이라 한다.
JSXChildren 안에는 여러 개(없을 수도 있음)의 JSXChild로 구성된다.

```JavaScript

<Test> Hello {namelist.map((name : string) => <NameComponent name/>)}</Test>

JSXChild : JSXText, JSXElement, JSXFragment, {JSXChildExpression} 로 구성될 수 있다.
```

### JSXString

JSXElement에서 표현하는 String을 의미한다.
JS와 다른 점이라면, JS에서의 String 시 `\n` `\r`와 같은 특수한 역할을 하는 이스케이프 문자 형태가 있는데, JS에서는 string에 `let i = "\"` 을 선언하면 SyntaxError가 발생하여 `let i = "\\"` 와 같이 표현해야지만 `\`가 표현이 된다.
하지만 JSX안에서는 그냥 표현이 가능하다. `<Test>\</Test>`
여기서 JSXIdentifier 같은 경우도 `<await/>` 과 같은 컴포넌트명을 사용할 수 있다. JS에서의 예약된 키워드랑 별개이기 때문이다.

---

위 내용은 https://facebook.github.io/jsx/ 에서 확인하면 더 좋을 것이다.

# 3. JSX To ECMAScript

Babel을 사용해서 JSX로 구성한 React Component가 결국 무엇으로 변환되는 지 확인해보자.
이 코드는 src/babel-test.js 에서 구현될 것이다.

`npm run babel-test` 로 실행 가능하도록 구성하였다.

```JavaScript
const Babel = require("@babel/standalone");
Babel.registerPlugin("@babel/plugin-transform-react-jsx", require("@babel/plugin-transform-react-jsx"));

const BABEL_CONFIG = {
  presets: [],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        throwIfNamespace: false,
        runtime: "automatic",
        importSource: "custom-jsx-library",
      },
    ],
  ],
};

const SOURCE_CODE = `const ComponentA = <A>HELLO.</A>`;

const { code } = Babel.transform(SOURCE_CODE, BABEL_CONFIG);

console.log(code);
```

**결과 화면**

![alt text](./img/babel-run.png)

## React는 어떻게 나올까..?

책에 있는 구성을 통해서 해보려 하였으나, 정확한 `@babel` 에 대한 설정에 대한 설명이 부실하여.. 나름 검색을 해서 구성해보았다.

필요한 패키지는 `@babel/core, @babel/preset-env, @babel/preset-react` 이며 cli 사용을 위해 `@babel/cli` 를 추가적으로 설치하였다.

아래는 .babelrc 파일이다.

```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

package.json 파일 내용이다.

```
{
  "name": "ch02",
  "version": "1.0.0",
  "description": "---",
  "main": "src/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "babel-test": "node src/babel-test.js",
    "react-test": "babel src/react-test.js -o dist/react-test.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "7.24.0",
    "@babel/plugin-transform-react-jsx": "7.23.4",
    "@babel/preset-env": "7.24.0",
    "@babel/preset-react": "7.23.3",
    "@babel/standalone": "7.24.0",
    "@babel/cli": "7.24.0"
  }
}
```

`npm run react-test` 를 실행하면 dist/react-test.js로 변환된 코드가 나온 것을 볼 수 있다.

```JavaScript
/** 간단한 React 코드 변환을 위함 */
function TestComponent() {
  return <span> React </span>;
}

function MyComponent() {
  return (
    <h1>
      <TestComponent /> 컴포넌트로 변해라!
    </h1>
  );
}


/* 위 코드는 아래와 같이 변환 됩니다. */

"use strict";

/** 간단한 React 코드 변환을 위함 */
function TestComponent() {
  return /*#__PURE__*/React.createElement("span", null, " React ");
}
function MyComponent() {
  return /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement(TestComponent, null), " \uCEF4\uD3EC\uB10C\uD2B8\uB85C \uBCC0\uD574\uB77C!");
}



```

결과를 보면 React.createElement()를 호출하며 인자로 처음에 구성한 내용들이 들어간 것을 볼 수 있다.
React.createElement()는 무엇을 하는걸까?

---

# React.createElement() ?

[React 공식 - React.createElement](https://ko.react.dev/reference/react/createElement)

`createElement(type, props, ...children)` 은 인수를 비롯하여 React Element **객체**를 생성한다.

아래는 createElement를 다시 JSX 문법으로 변환 해본 예다.

```JavaScript

import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}

// 이를 JSX 표현으로 다시 바꿔보면

function Greeting({name}) {
    return <h1 className={"greeting"}>Hello</h1>
}
```

#### createElement 매개변수

**_type_** : 유효한 React Component여야 한다. HTML 태그, Fragment도 가능하다.
**_props_** : 객체 또는 null 이어야 한다. (빈 객체와 null은 동일하게 처리된다.) `React`는 전달한 props와 일치하는 프로퍼티를 가진 엘리먼트를 생성한다. 전달한 props 객체의 `ref`와 `key`는 특수하기에 props를 통한 접근이 불가하다.
접근하려면 `element.ref, element.key` 와 같이 element에서 직접 접근해야한다.
**_...children_** : optional 하며, React Element, 문자열, 숫자, portal, 빈 노드(null, undefined, true, false) 그리고 React Node Array를 포함한 모든 React Node가 될 수 있다. (React Node는 가장 기본적인 단위이다. React Element도 React Node에 포함된다.)

#### createElement 반환값

**_tpye_** : 전달받은 type
**_props_** : ref와 key를 제외한 전달받은 props. type이 type.defaultProps를 가지는 컴포넌트라면, 누락되거나 정의되지 않은 props는 type.defaultProps의 값을 가져온다. (요즘 함수형에 익숙해져서 잘 모르겠지만 class 형태로 컴포넌트를 만들 때는 defaultProps를 따로 설정해줬었다.)
**_ref_** : 전달받은 ref, 누락된다면 null
**_key_** : 전달받은 key를 강제로 문자열로 변환시킨 값, 누락되었다면 null

### 주의 사항

- 반드시 ** React 엘리먼트와 프로퍼티는 불변하게 취급 ** 해야 한다. (직접적으로 변경하면 안된다.) React는 이를 강제하기 위해 엘리먼트와 프로퍼티를 얕게 freeze 한다. _(DOM Element에서 react element를 찾아내서 props를 변경하지 말라는 의미)_

- JSX를 사용한다면 컴포넌트의 명은 무조건 대문자이다. 이유는 JSX 문법을 createElement로 변환시 아래와 같이 변환되기 때문이다.

```JavaScript
<Something/> = > createElement(Something)
<something/> => createElement('something') // XXXXXXXXXXXXXX
```

- `createElement('h1', {}, child1, child2, child3)` 과 같이 호출할 경우 child가 모두 정적이어야 한다. 어지간한 동적인 컴포넌트들이라면 []를 통해 spread로 전달해야한다. 그냥 넣으면 컴포넌트 업데이트가 일어나지 않음

### 그래서 결국 React.createElement()가 생성하는 객체가 어떻게 생긴건데 ?

```JavaScript
<Greeting name="yeonho"/> // 는 아래와 같이 변환된다.
React.createElement(Greeting, { name : 'Taylor' }) // 이 함수를 호출하면 아래와 같은 객체가 반환된다.
// 약간 단순화 됨
{
    type : Greeting,
    props : {
        name : 'Taylor'
    },
    key : null,
    ref : null
}

```

엥 근데 이 객체 생성해서 뭐하는거죠?

> 이 객체를 생성해도 컴포넌트가 `DOM Element`로 바로 생성이 되는 것은 아니다.

> `React`는 이렇게 만들어진 엘리먼트를 나중에 렌더링하도록 지시하기 위해 위와 같은 객체로 미리 변환을 해두는 것이다.

> 최종적으로 `App` 컴포넌트에서 위와 같은 객체를 반환함으로서 React가 다음에 할 일을 실행(렌더링 할 준비)한다.

> 엘리먼트 생성 비용은 매우 저렴한 편이니 생성을 최적화 하거나 피하려고 노력할 필요 없다 -> **_컴포넌트를 나눠서 작성해도 큰 비용이 들지 않음, React에서 Atomic Pattern이 왜 유리한지 알 수 있다._**

---

# Vitrual DOM ? React Fiber ?

ㅎㅎ 아직

---

# React Fiber

ㅎㅎ 아직

# Reconciler

ㅎㅎ 아직

# Class, Function Component

ㅎㅎ 아직
