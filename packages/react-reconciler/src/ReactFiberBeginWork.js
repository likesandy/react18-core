import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { shouldSetTextContent } from "react-dom-bindings/ReactDOMHostConfig,";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

/**
 * 虚拟DOM -> Fiber树
 * @param {*} current 旧fiber节点
 * @param {*} workInProgress 新fiber节点
 * @returns 新fiber子节点或者null
 */
export function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}

/**
 * 更新根HostRoot类型的fiber节点
 * @param {*} current 旧fiber节点
 * @param {*} workInProgress 新fiber节点
 */
function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {FiberNode} current - 老的父Fiber节点
 * @param {FiberNode} workInProgress - 新的Fiber节点
 * @param {*} nextChildren - 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  }
}