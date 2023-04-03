import type { Dispatch, SetStateAction } from "react"

export class SharedState<S> {
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

export default function createSharedState<S>(initialState?: S) {
  return new SharedState<S>(initialState)
}