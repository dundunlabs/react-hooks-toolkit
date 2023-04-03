import useSharedState from '../useSharedState'
import createSharedState from '../../utils/createSharedState'
import { renderHook, act } from '@testing-library/react'

describe("useSharedState", () => {
  test("returns initial state based on createSharedState's param", () => {
    const s1 = createSharedState()
    const s2 = createSharedState("test")
    const { result: result1 } = renderHook(() => useSharedState(s1))
    const { result: result2 } = renderHook(() => useSharedState(s2))

    expect(result1.current[0]).toBeUndefined()
    expect(result2.current[0]).toEqual("test")
  })

  test("broadcasts new state to all subscribed component", async () => {
    const s = createSharedState()
    const { result: result1 } = renderHook(() => useSharedState(s))
    const { result: result2 } = renderHook(() => useSharedState(s))

    expect(result1.current[0]).toBeUndefined()
    expect(result2.current[0]).toBeUndefined()

    act(() => result1.current[1]("test"))

    expect(result1.current[0]).toEqual("test")
    expect(result2.current[0]).toEqual("test")

    act(() => result2.current[1]((prevState: string) => prevState + 1))

    expect(result1.current[0]).toEqual("test1")
    expect(result2.current[0]).toEqual("test1")
  })
})