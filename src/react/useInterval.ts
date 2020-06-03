import { useEffect, useRef } from "react";

export function useInterval(callback: CallableFunction, delay: number): void {

  useEffect(() => {
    callback()
  },[])
  const savedCallback: any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => {
        return clearInterval(id);
      };
    }
  }, [delay]);
}
