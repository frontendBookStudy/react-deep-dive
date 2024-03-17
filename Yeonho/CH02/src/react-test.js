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
