import { createSharedState, useSharedState } from '..'
import { renderHook, waitFor } from '@testing-library/react'

describe("useSharedState", () => {
  it("boardcasts state using setState", async () => {
    const s = createSharedState()
    const { result: result1 } = renderHook(() => useSharedState(s))
    const { result: result2 } = renderHook(() => useSharedState(s))

    expect(result1.current[0]).toBeUndefined()
    expect(result2.current[0]).toBeUndefined()

    await waitFor(() => result1.current[1]("test"))

    expect(result1.current[0]).toEqual("test")
    expect(result2.current[0]).toEqual("test")

    const { result: result3 } = renderHook(() => useSharedState(s))

    expect(result3.current[0]).toEqual("test")

    await waitFor(() => result3.current[1]("test 1"))

    expect(result1.current[0]).toEqual("test 1")
    expect(result2.current[0]).toEqual("test 1")
    expect(result3.current[0]).toEqual("test 1")
  })

  it("set initialState as an object", async () => {
    const s = createSharedState()
    const { result: result1 } = renderHook(() => useSharedState(s, "test"))
    const { result: result2 } = renderHook(() => useSharedState(s))

    expect(result1.current[0]).toEqual("test")
    expect(result2.current[0]).toEqual("test")
  })

  it("set initialState as a function", async () => {
    const s = createSharedState()
    const { result: result1 } = renderHook(() => useSharedState(s, () => "test"))
    const { result: result2 } = renderHook(() => useSharedState(s, "not test"))

    expect(result1.current[0]).toEqual("test")
    expect(result2.current[0]).toEqual("test")
  })
})