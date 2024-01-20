import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

/**
 * 创建容器，用于将虚拟DOM转换为真实DOM并插入到容器中
 * @param {*} containerInfo - DOM容器信息
 * @returns {FiberRoot} - 创建FiberRoot
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器，将虚拟DOM转换为真实DOM并插入到容器中。
 * @param {*} element - 虚拟DOM元素。
 * @param {*} container - DOM容器，FiberRootNode。
 */
export function updateContainer(element, container) {
  // rootFiber
  const current = container.current;
  // TODO 优先级
  // 创建更新
  const update = createUpdate();
  // 要更新的虚拟DOM
  update.payload = { element };
  // 将更新添加到rootFiber的更新队列上，并返回根节点
  const root = enqueueUpdate(current, update);
  // TODO 在rootFiber上调度更新
  scheduleUpdateOnFiber(root);
}