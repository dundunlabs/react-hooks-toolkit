import { useReducer } from "react";

const reducer = (s: number) => s + 1

export default function useRerender() {
  const [_, rerender] = useReducer(reducer, 0)
  return rerender
}