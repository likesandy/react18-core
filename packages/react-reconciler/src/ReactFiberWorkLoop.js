import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';

let workInProgress = null

/**
 * 调度更新
 * @param {*} root 
 */
export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);
}

/**
 * 调度应用
 * @param {*} root fiberRoot
 */
function ensureRootIsScheduled(root) {
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 执行fiberRoot上的并发工作
 * @param {*} root fiberRoot
 */
function performConcurrentWorkOnRoot(root) {
  // TODO 异步渲染
  renderRootSync(root)
  // 渲染后的workInProgress树
  root.finishedWork = root.current.alternate
  // commit阶段
  // commitRoot(root)
}


/**
 * 同步渲染fiberRoot
 * @param {*} root fiberRoot
 */
function renderRootSync(root) {
  prepareFreshStack(root)
  workLoopSync()
}

/**
 * 创建新的工作栈
 * @param {*} root fiberRoot
 */
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null)
}

/**
 * 工作循环（同步）
 */
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param {*} unitOfWork  工作单元
 */
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate
  // 子节点
  let next = beginWork(current, unitOfWork);
  if (next === null) {
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }
}


/**
 * Fiber树 -> 真实DOM
 */
function completeUnitOfWork(workInProgress) {
  let completedWork = workInProgress
  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return
    completeWork(current, completedWork)

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    completedWork = returnFiber;
    workInProgress = completedWork;

  } while (completeUnitOfWork !== null)
}