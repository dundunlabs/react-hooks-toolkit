import { useState, useCallback, useEffect } from 'react'
import { SharedState } from '../utils/createSharedState'
import type { Dispatch, SetStateAction } from 'react'

function isFunc<S>(action: SetStateAction<S>): action is (prevState: S) => S {
  return typeof action === 'function'
}
export default function useSharedState<S>(sharedState: SharedState<S>) {
  const [state, dispatch] = useState(sharedState.get())

  const setState = useCallback<Dispatch<SetStateAction<S | undefined>>>(action => {
    const state = isFunc(action) ? action(sharedState.get()) : action
    sharedState.set(state)
  }, [sharedState])

  useEffect(() => sharedState.subscribe(dispatch), [sharedState, dispatch])

  return [state, setState] as const
}