Chapter 02 - React Core
===================
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

***하지만, 사실은 조금 다르다.***

[facebook 공식 JSX 사양 링크](https://facebook.github.io/jsx/)

JSX는 Facebook이 제안하였으며, XML과 유사한 것은 HTML 형태로 마크업 하는 것(코?딩?)이 친숙하니 형태를 유지한 것으로 보인다.

위의 사양 소개를 보면, JSX 구문은 결국 ECMAScript로 변환하는 것을 목표로 한다.

ECMAScript로 변환하면, 누가 ? HTML로 변환할 것인가 ? -> 이 역할은 React가 해준다.

React는 JSX로 정의한 구문을 Compile하여 React.createElement()를 호출하는 변환한다. _(그럼 이건 누가 변환해서 브라우저 호환을 시켜주나요 ? => Babel, SWC 등등..의 역할)_

React.createElement()는? React에서 사용하는 객체로 만들어준다. 이건 뒤 이어서 나올 챕터에서 더 자세하게 다룰 것으로 보인다.
React.createElement()를 생성한다 하더라도 바로 DOM 트리에 등록시키는 과정은 아니다.

### 정리
이를 풀면 React를 사용할 때 DOM 트리를 생성하는 것은 React가 하는 것이며, JSX는 표현의 영역만을 담당한다.

---
# 2. JSX를 변환해보자.
ㅎㅎ아직

---

# 3. React.createElement() 는 결국 무엇을 만들어내는가?
ㅎㅎ 아직

--- 
# Vitrual DOM ? React Fiber ?
ㅎㅎ 아직
--- 
# React Fiber
ㅎㅎ 아직
---
# Reconciler
ㅎㅎ 아직
---
# Class, Function Component
ㅎㅎ 아직
