import { useState, useCallback, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'

class SharedState<S> {
  #subscriptions: Set<Dispatch<SetStateAction<S | undefined>>> = new Set()
  #state: S | undefined

  constructor(state?: S) {
    this.#state = state
  }

  subscribe = (dispatch: Dispatch<SetStateAction<S | undefined>>) => {
    this.#subscriptions.add(dispatch)
    return () => this.unsubscribe(dispatch)
  }

  unsubscribe = (dispatch: Dispatch<SetStateAction<S | undefined>>) => {
    this.#subscriptions.delete(dispatch)
  }

  broadcast = () => {
    this.#subscriptions.forEach(dispatch => dispatch(this.#state))
  }

  get = () => {
    return this.#state
  }

  set = (state: S | undefined) => {
    this.#state = state
    this.broadcast()
  }
}

export function createSharedState<S>(initialState?: S) {
  return new SharedState<S>(initialState)
}

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