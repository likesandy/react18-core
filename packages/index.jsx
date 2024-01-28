import { createRoot } from 'react-dom/src/client/ReactDOMRoot'
let element = (
  <div>
    <div>hello world</div>
    <div>hello react</div>
    <div>
      学习react 18 core
      <a style={{ color: 'red' }} href="https://github.com/likesandy/react18-core">
        Github地址
      </a>
    </div>
  </div>
)
const root = createRoot(document.getElementById('root'))
root.render(element)

