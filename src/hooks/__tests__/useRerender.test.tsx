import useRerender from '../useRerender'
import { act, render } from '@testing-library/react'

describe("useRerender", () => {
  test("forces component be rerendered ", () => {
    let rerender: () => void
    const check = jest.fn()
    function Component() {
      rerender = useRerender()
      check()
      return null
    }

    render(<Component />)

    expect(check).toBeCalledTimes(1)

    act(() => rerender())

    expect(check).toBeCalledTimes(2)
  })
})