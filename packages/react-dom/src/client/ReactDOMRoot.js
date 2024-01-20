import {
  createContainer,
  updateContainer
} from 'react-reconciler/src/ReactFiberReconciler';

/**
 * ReactDOMRoot构造函数
 * @param {FiberRoot} internalRoot - React Fiber树的根节点
 */
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

/**
 * render方法，负责更新或渲染React组件树
 *
 * @param {ReactElement|ReactComponent} children - 需要渲染的React元素或组件
 *
 * render方法是挂载在ReactDOMRoot原型链上的，每个ReactDOMRoot实例对象都可以调用这个方法
 * 当调用render方法时，会通过调用updateContainer函数，将传入的React元素或组件(children参数)更新或渲染到当前的Fiber树(_internalRoot属性对应的Fiber树)中
 */
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
}


/**
 * 创建fiberRoot
 * @param {HTMLElement} container 渲染的元素
 * @returns {ReactDOMRoot} ReactDOMRoot对象
 */
export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}