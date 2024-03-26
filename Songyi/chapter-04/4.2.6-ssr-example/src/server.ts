import { createReadStream } from "fs";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { createElement } from "react";
import { renderToNodeStream, renderToString } from "react-dom/server";
import indexEnd from "../public/index-end.html";
import indexFront from "../public/index-front.html";
import html from "../public/index.html";
import App from "./components/App";
import { fetchTodo } from "./fetch";

const PORT = process.env.PORT || 3000;

// HTTP 서버가 라우드(주소)별로 어떻게 작성할지를 정의하는 함수
async function serverHandler(req: IncomingMessage, res: ServerResponse) {
  // req.url을 통해 사용자가 접근한 주소를 알 수 있는데, 각 주소별로 어떻게 작동할지 정의할 수 있다
  const { url } = req;

  switch (url) {
    // renderToString을 사용한 서버 사이드 렌더링
    case "/": {
      const result = await fetchTodo();

      const rootElement = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos: result })
      );
      const renderResult = renderToString(rootElement);

      const htmlResult = html.replace("__placeholder__", renderResult);

      res.setHeader("Content-Type", "text/html");
      res.write(htmlResult);
      res.end();
      return;
    }

    // renderToNodeStream을 사용한 서버 사이드 렌더링
    // /stream으로 접속해도 renderToString을 활용한 /와 완벽하게 동일한 결과물을 브라우저가 내려받는 것을 확인할 수 있다
    case "/stream": {
      res.setHeader("Content-Type", "text/html");
      res.write(indexFront);

      const result = await fetchTodo();
      const rootElement = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos: result })
      );

      const stream = renderToNodeStream(rootElement);
      stream.pipe(res, { end: false });
      stream.on("end", () => {
        res.write(indexEnd);
        res.end();
      });
      return;
    }

    // 브라우저에 제공되는 리액트 코드
    // 애플리케이션에서 작성한 리액트 및 관련 코드를 제공
    case "/browser.js": {
      res.setHeader("Content-Type", "application/javascript");
      createReadStream(`./dist/browser.js`).pipe(res);
      return;
    }

    // 위 파일의 소스맵
    // 디버깅 용도로 사용
    case "/browser.js.map": {
      res.setHeader("Content-Type", "application/javascript");
      createReadStream(`./dist/browser.js.map`).pipe(res);
      return;
    }

    default: {
      res.statusCode = 404;
      res.end("404 Not Found");
    }
  }
}

function main() {
  createServer(serverHandler).listen(PORT, () => {
    console.log(`Server has been started ${PORT}...`); // eslint-disable-line no-console
  });
}

main();
