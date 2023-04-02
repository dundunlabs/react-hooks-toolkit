import { useState, useCallback, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'

class SharedState<S> {
  #subscriptions: Set<Dispatch<SetStateAction<S | undefined>>> = new Set()
  #state: S | undefined

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

  set = (value: S | undefined) => {
    this.#state = value
    this.broadcast()
  }
}

export function createSharedState<S>() {
  return new SharedState<S>()
}

function isFunc<S>(state: S | (() => S)): state is (() => S) {
  return typeof state === 'function'
}

export function useSharedState<S>(sharedState: SharedState<S>, initialState?: S | (() => S)) {
  const [state, dispatch] = useState(() => {
    let s = sharedState.get()
    if (s === undefined) {
      s = isFunc(initialState) ? initialState() : initialState
      if (s !== undefined) sharedState.set(s)
    }
    return s
  })

  const setState = useCallback((s: S | undefined) => sharedState.set(s), [sharedState])

  useEffect(() => sharedState.subscribe(dispatch), [sharedState, dispatch])

  return [state, setState] as const
}