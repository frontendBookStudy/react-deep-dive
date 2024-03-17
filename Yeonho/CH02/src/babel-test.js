/** 책에 있는 코드 구성을 바탕으로 실행 */
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
