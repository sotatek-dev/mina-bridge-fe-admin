type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never;

type IntersectionOfFunctionsToType<F> = F extends {
  (a: infer A): void;
  (b: infer B): void;
}
  ? [A, B]
  : never;

type SplitType<T> = IntersectionOfFunctionsToType<
  UnionToIntersection<UnionToFunctions<T>>
>;

type ReactNodeCreateFn<P> = (params: P) => React.ReactNode;

type Maybe<T> = T | never;
