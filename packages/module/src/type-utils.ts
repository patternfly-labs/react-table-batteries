import { TableFeature } from './types';

export type KeyWithValueType<T, V> = {
  [Key in keyof T]-?: T[Key] extends V ? Key : never;
}[keyof T];

export type DisallowCharacters<
  T extends string,
  TInvalidCharacter extends string
> = T extends `${string}${TInvalidCharacter}${string}` ? never : T;

export type DiscriminatedArgs<TBoolDiscriminatorKey extends string, TArgs> =
  | ({ [key in TBoolDiscriminatorKey]: true } & TArgs)
  | { [key in TBoolDiscriminatorKey]?: false };

export type MergedArgs<
  A extends Partial<Record<TableFeature, object>>,
  B extends Partial<Record<TableFeature, object>>,
  TIncludedFeatures extends TableFeature
> = Omit<A, TableFeature> &
  Omit<B, TableFeature> &
  Partial<{
    [key in TIncludedFeatures]: [A, B] extends [undefined, undefined] ? undefined : A[key] & B[key];
  }>;
