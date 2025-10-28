import {useCallback, useRef} from 'react';

/**
 * useFunction 保证返回的函数在组件生命周期内引用稳定，
 * 并始终调用最新版本的 handler。
 *
 * @param handler 最新的函数逻辑（会随 props/state 变化而变化）
 * @returns 引用稳定的函数，用于传给 useEffect、事件绑定等
 */
export function useFunction<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef<T>(handler);

  // 每次渲染都更新 handler 的最新引用
  handlerRef.current = handler;

  // 返回一个只在首次渲染时创建的函数引用
  const stableFn = useCallback((...args: Parameters<T>): ReturnType<T> => {
    return handlerRef.current(...args);
  }, []);

  return stableFn as T;
}
