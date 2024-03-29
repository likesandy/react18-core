import isArray from "shared/isArray";
import { FiberNode, createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { Placement } from "./ReactFiberFlags";

// 更新的时候
export const reconcileChildFibers = createChildReconciler(true);
// 初次挂载的时候
export const mountChildFibers = createChildReconciler(false);


/**
 * 创建Child Reconciler的函数
 * @param {boolean} shouldTrackSideEffects - 是否需要跟踪副作用
 * @return {function} reconcileChildFibers - 用于处理子fiber的函数
 *
 * 这个函数会根据传入的shouldTrackSideEffects参数返回一个函数reconcileChildFibers，
 * reconcileChildFibers函数可以根据新旧Fiber进行比较并返回处理结果。
 */
function createChildReconciler(shouldTrackSideEffects) {
  /**
   * 比较子Fibers
   *
   * @param {Fiber} returnFiber - 新的父Fiber
   * @param {Fiber} currentFirstFiber - 老fiber第一个子fiber
   * @param {object} newChild - 新的子虚拟DOM
   * @return {Fiber | null} result - 返回的新的子Fiber，或null
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    // TODO 新老DOM Diff
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild))
        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  function createChild(returnFiber, newChild) {
    if ((typeof newChild === "string" && newChild !== "") || typeof newChild === "number") {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChild) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIdx = 0;
    for (; newIdx < newChild.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChild[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      // 链表
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }


  /**
   * 为新创建的Fiber设置索引，并在必要时设置副作用(打标记)
   * 
   * @param {FiberNode} newFiber 新创建的Fiber
   * @param {number} newIdx  新的索引
   */
  function placeChild(newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    return newFiber
  }

  /**
   * 将新创建的元素转换为fiber
   *
   * @param {Fiber} returnFiber - 新的父Fiber
   * @param {Fiber} currentFirstFiber - 老fiber第一个子fiber
   * @param {object} element - 新的子虚拟DOM元素
   * @return {Fiber} created - 返回新创建的Fiber
   */
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  return reconcileChildFibers
}
