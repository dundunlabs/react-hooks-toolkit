import type { Dispatch, SetStateAction } from "react";

type SharedStateSetter<S> = (s: S | undefined) => void;
type SharedStateMiddleware<S> = (
  next: SharedStateSetter<S>
) => SharedStateSetter<S>;

export class SharedState<S> {
  #subscriptions: Set<Dispatch<SetStateAction<S | undefined>>> = new Set();
  #state: S | undefined;
  #middleware: SharedStateMiddleware<S> | undefined;

  #_set: SharedStateSetter<S> = (state) => {
    this.#state = state;
    this.broadcast();
  };

  constructor(state?: S, midleware?: SharedStateMiddleware<S>) {
    this.#state = state;
    this.#middleware = midleware;
  }

  subscribe = (dispatch: Dispatch<SetStateAction<S | undefined>>) => {
    this.#subscriptions.add(dispatch);
    return () => this.unsubscribe(dispatch);
  };

  unsubscribe = (dispatch: Dispatch<SetStateAction<S | undefined>>) => {
    this.#subscriptions.delete(dispatch);
  };

  broadcast = () => {
    this.#subscriptions.forEach((dispatch) => dispatch(this.#state));
  };

  get = () => {
    return this.#state;
  };

  set = (state: S | undefined) => {
    if (this.#middleware) {
      this.#middleware(this.#_set)(state);
    } else {
      this.#_set(state);
    }
  };
}

export default function createSharedState<S>(
  initialState?: S,
  midleware?: SharedStateMiddleware<S>
) {
  return new SharedState<S>(initialState, midleware);
}
