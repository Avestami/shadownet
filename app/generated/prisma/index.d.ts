
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Level
 * 
 */
export type Level = $Result.DefaultSelection<Prisma.$LevelPayload>
/**
 * Model LevelUnlock
 * 
 */
export type LevelUnlock = $Result.DefaultSelection<Prisma.$LevelUnlockPayload>
/**
 * Model PlayerChoice
 * 
 */
export type PlayerChoice = $Result.DefaultSelection<Prisma.$PlayerChoicePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.level`: Exposes CRUD operations for the **Level** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Levels
    * const levels = await prisma.level.findMany()
    * ```
    */
  get level(): Prisma.LevelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.levelUnlock`: Exposes CRUD operations for the **LevelUnlock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LevelUnlocks
    * const levelUnlocks = await prisma.levelUnlock.findMany()
    * ```
    */
  get levelUnlock(): Prisma.LevelUnlockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.playerChoice`: Exposes CRUD operations for the **PlayerChoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlayerChoices
    * const playerChoices = await prisma.playerChoice.findMany()
    * ```
    */
  get playerChoice(): Prisma.PlayerChoiceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Level: 'Level',
    LevelUnlock: 'LevelUnlock',
    PlayerChoice: 'PlayerChoice'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "level" | "levelUnlock" | "playerChoice"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Level: {
        payload: Prisma.$LevelPayload<ExtArgs>
        fields: Prisma.LevelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LevelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LevelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          findFirst: {
            args: Prisma.LevelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LevelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          findMany: {
            args: Prisma.LevelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          create: {
            args: Prisma.LevelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          createMany: {
            args: Prisma.LevelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LevelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          delete: {
            args: Prisma.LevelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          update: {
            args: Prisma.LevelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          deleteMany: {
            args: Prisma.LevelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LevelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LevelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          upsert: {
            args: Prisma.LevelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          aggregate: {
            args: Prisma.LevelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLevel>
          }
          groupBy: {
            args: Prisma.LevelGroupByArgs<ExtArgs>
            result: $Utils.Optional<LevelGroupByOutputType>[]
          }
          count: {
            args: Prisma.LevelCountArgs<ExtArgs>
            result: $Utils.Optional<LevelCountAggregateOutputType> | number
          }
        }
      }
      LevelUnlock: {
        payload: Prisma.$LevelUnlockPayload<ExtArgs>
        fields: Prisma.LevelUnlockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LevelUnlockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LevelUnlockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          findFirst: {
            args: Prisma.LevelUnlockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LevelUnlockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          findMany: {
            args: Prisma.LevelUnlockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>[]
          }
          create: {
            args: Prisma.LevelUnlockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          createMany: {
            args: Prisma.LevelUnlockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LevelUnlockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>[]
          }
          delete: {
            args: Prisma.LevelUnlockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          update: {
            args: Prisma.LevelUnlockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          deleteMany: {
            args: Prisma.LevelUnlockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LevelUnlockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LevelUnlockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>[]
          }
          upsert: {
            args: Prisma.LevelUnlockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelUnlockPayload>
          }
          aggregate: {
            args: Prisma.LevelUnlockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLevelUnlock>
          }
          groupBy: {
            args: Prisma.LevelUnlockGroupByArgs<ExtArgs>
            result: $Utils.Optional<LevelUnlockGroupByOutputType>[]
          }
          count: {
            args: Prisma.LevelUnlockCountArgs<ExtArgs>
            result: $Utils.Optional<LevelUnlockCountAggregateOutputType> | number
          }
        }
      }
      PlayerChoice: {
        payload: Prisma.$PlayerChoicePayload<ExtArgs>
        fields: Prisma.PlayerChoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerChoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerChoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          findFirst: {
            args: Prisma.PlayerChoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerChoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          findMany: {
            args: Prisma.PlayerChoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>[]
          }
          create: {
            args: Prisma.PlayerChoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          createMany: {
            args: Prisma.PlayerChoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerChoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>[]
          }
          delete: {
            args: Prisma.PlayerChoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          update: {
            args: Prisma.PlayerChoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          deleteMany: {
            args: Prisma.PlayerChoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerChoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerChoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>[]
          }
          upsert: {
            args: Prisma.PlayerChoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerChoicePayload>
          }
          aggregate: {
            args: Prisma.PlayerChoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayerChoice>
          }
          groupBy: {
            args: Prisma.PlayerChoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerChoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerChoiceCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerChoiceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    level?: LevelOmit
    levelUnlock?: LevelUnlockOmit
    playerChoice?: PlayerChoiceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    unlockedLevels: number
    choices: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    unlockedLevels?: boolean | UserCountOutputTypeCountUnlockedLevelsArgs
    choices?: boolean | UserCountOutputTypeCountChoicesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUnlockedLevelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelUnlockWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerChoiceWhereInput
  }


  /**
   * Count Type LevelCountOutputType
   */

  export type LevelCountOutputType = {
    unlockedBy: number
    choices: number
  }

  export type LevelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    unlockedBy?: boolean | LevelCountOutputTypeCountUnlockedByArgs
    choices?: boolean | LevelCountOutputTypeCountChoicesArgs
  }

  // Custom InputTypes
  /**
   * LevelCountOutputType without action
   */
  export type LevelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelCountOutputType
     */
    select?: LevelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LevelCountOutputType without action
   */
  export type LevelCountOutputTypeCountUnlockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelUnlockWhereInput
  }

  /**
   * LevelCountOutputType without action
   */
  export type LevelCountOutputTypeCountChoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerChoiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    score: number | null
  }

  export type UserSumAggregateOutputType = {
    score: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    score: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    score?: true
  }

  export type UserSumAggregateInputType = {
    score?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    score?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    score?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    score?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    email: string | null
    password: string
    score: number
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    score?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    unlockedLevels?: boolean | User$unlockedLevelsArgs<ExtArgs>
    choices?: boolean | User$choicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    score?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    score?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    score?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "password" | "score" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    unlockedLevels?: boolean | User$unlockedLevelsArgs<ExtArgs>
    choices?: boolean | User$choicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      unlockedLevels: Prisma.$LevelUnlockPayload<ExtArgs>[]
      choices: Prisma.$PlayerChoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string | null
      password: string
      score: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    unlockedLevels<T extends User$unlockedLevelsArgs<ExtArgs> = {}>(args?: Subset<T, User$unlockedLevelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    choices<T extends User$choicesArgs<ExtArgs> = {}>(args?: Subset<T, User$choicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly score: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.unlockedLevels
   */
  export type User$unlockedLevelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    where?: LevelUnlockWhereInput
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    cursor?: LevelUnlockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LevelUnlockScalarFieldEnum | LevelUnlockScalarFieldEnum[]
  }

  /**
   * User.choices
   */
  export type User$choicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    where?: PlayerChoiceWhereInput
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    cursor?: PlayerChoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerChoiceScalarFieldEnum | PlayerChoiceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "expiresAt" | "createdAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Level
   */

  export type AggregateLevel = {
    _count: LevelCountAggregateOutputType | null
    _avg: LevelAvgAggregateOutputType | null
    _sum: LevelSumAggregateOutputType | null
    _min: LevelMinAggregateOutputType | null
    _max: LevelMaxAggregateOutputType | null
  }

  export type LevelAvgAggregateOutputType = {
    scoreReward: number | null
    sequence: number | null
  }

  export type LevelSumAggregateOutputType = {
    scoreReward: number | null
    sequence: number | null
  }

  export type LevelMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    videoUrl: string | null
    audioUrl: string | null
    unlockCode: string | null
    scoreReward: number | null
    nextLevelId: string | null
    sequence: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LevelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    videoUrl: string | null
    audioUrl: string | null
    unlockCode: string | null
    scoreReward: number | null
    nextLevelId: string | null
    sequence: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LevelCountAggregateOutputType = {
    id: number
    name: number
    description: number
    videoUrl: number
    audioUrl: number
    unlockCode: number
    scoreReward: number
    nextLevelId: number
    sequence: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LevelAvgAggregateInputType = {
    scoreReward?: true
    sequence?: true
  }

  export type LevelSumAggregateInputType = {
    scoreReward?: true
    sequence?: true
  }

  export type LevelMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    videoUrl?: true
    audioUrl?: true
    unlockCode?: true
    scoreReward?: true
    nextLevelId?: true
    sequence?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LevelMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    videoUrl?: true
    audioUrl?: true
    unlockCode?: true
    scoreReward?: true
    nextLevelId?: true
    sequence?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LevelCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    videoUrl?: true
    audioUrl?: true
    unlockCode?: true
    scoreReward?: true
    nextLevelId?: true
    sequence?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LevelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Level to aggregate.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Levels
    **/
    _count?: true | LevelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LevelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LevelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LevelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LevelMaxAggregateInputType
  }

  export type GetLevelAggregateType<T extends LevelAggregateArgs> = {
        [P in keyof T & keyof AggregateLevel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLevel[P]>
      : GetScalarType<T[P], AggregateLevel[P]>
  }




  export type LevelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelWhereInput
    orderBy?: LevelOrderByWithAggregationInput | LevelOrderByWithAggregationInput[]
    by: LevelScalarFieldEnum[] | LevelScalarFieldEnum
    having?: LevelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LevelCountAggregateInputType | true
    _avg?: LevelAvgAggregateInputType
    _sum?: LevelSumAggregateInputType
    _min?: LevelMinAggregateInputType
    _max?: LevelMaxAggregateInputType
  }

  export type LevelGroupByOutputType = {
    id: string
    name: string
    description: string | null
    videoUrl: string | null
    audioUrl: string | null
    unlockCode: string
    scoreReward: number
    nextLevelId: string | null
    sequence: number
    createdAt: Date
    updatedAt: Date
    _count: LevelCountAggregateOutputType | null
    _avg: LevelAvgAggregateOutputType | null
    _sum: LevelSumAggregateOutputType | null
    _min: LevelMinAggregateOutputType | null
    _max: LevelMaxAggregateOutputType | null
  }

  type GetLevelGroupByPayload<T extends LevelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LevelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LevelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LevelGroupByOutputType[P]>
            : GetScalarType<T[P], LevelGroupByOutputType[P]>
        }
      >
    >


  export type LevelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    videoUrl?: boolean
    audioUrl?: boolean
    unlockCode?: boolean
    scoreReward?: boolean
    nextLevelId?: boolean
    sequence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
    previousLevel?: boolean | Level$previousLevelArgs<ExtArgs>
    unlockedBy?: boolean | Level$unlockedByArgs<ExtArgs>
    choices?: boolean | Level$choicesArgs<ExtArgs>
    _count?: boolean | LevelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    videoUrl?: boolean
    audioUrl?: boolean
    unlockCode?: boolean
    scoreReward?: boolean
    nextLevelId?: boolean
    sequence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    videoUrl?: boolean
    audioUrl?: boolean
    unlockCode?: boolean
    scoreReward?: boolean
    nextLevelId?: boolean
    sequence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    videoUrl?: boolean
    audioUrl?: boolean
    unlockCode?: boolean
    scoreReward?: boolean
    nextLevelId?: boolean
    sequence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LevelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "videoUrl" | "audioUrl" | "unlockCode" | "scoreReward" | "nextLevelId" | "sequence" | "createdAt" | "updatedAt", ExtArgs["result"]["level"]>
  export type LevelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
    previousLevel?: boolean | Level$previousLevelArgs<ExtArgs>
    unlockedBy?: boolean | Level$unlockedByArgs<ExtArgs>
    choices?: boolean | Level$choicesArgs<ExtArgs>
    _count?: boolean | LevelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LevelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
  }
  export type LevelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nextLevel?: boolean | Level$nextLevelArgs<ExtArgs>
  }

  export type $LevelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Level"
    objects: {
      nextLevel: Prisma.$LevelPayload<ExtArgs> | null
      previousLevel: Prisma.$LevelPayload<ExtArgs> | null
      unlockedBy: Prisma.$LevelUnlockPayload<ExtArgs>[]
      choices: Prisma.$PlayerChoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      videoUrl: string | null
      audioUrl: string | null
      unlockCode: string
      scoreReward: number
      nextLevelId: string | null
      sequence: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["level"]>
    composites: {}
  }

  type LevelGetPayload<S extends boolean | null | undefined | LevelDefaultArgs> = $Result.GetResult<Prisma.$LevelPayload, S>

  type LevelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LevelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LevelCountAggregateInputType | true
    }

  export interface LevelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Level'], meta: { name: 'Level' } }
    /**
     * Find zero or one Level that matches the filter.
     * @param {LevelFindUniqueArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LevelFindUniqueArgs>(args: SelectSubset<T, LevelFindUniqueArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Level that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LevelFindUniqueOrThrowArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LevelFindUniqueOrThrowArgs>(args: SelectSubset<T, LevelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Level that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindFirstArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LevelFindFirstArgs>(args?: SelectSubset<T, LevelFindFirstArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Level that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindFirstOrThrowArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LevelFindFirstOrThrowArgs>(args?: SelectSubset<T, LevelFindFirstOrThrowArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Levels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Levels
     * const levels = await prisma.level.findMany()
     * 
     * // Get first 10 Levels
     * const levels = await prisma.level.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const levelWithIdOnly = await prisma.level.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LevelFindManyArgs>(args?: SelectSubset<T, LevelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Level.
     * @param {LevelCreateArgs} args - Arguments to create a Level.
     * @example
     * // Create one Level
     * const Level = await prisma.level.create({
     *   data: {
     *     // ... data to create a Level
     *   }
     * })
     * 
     */
    create<T extends LevelCreateArgs>(args: SelectSubset<T, LevelCreateArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Levels.
     * @param {LevelCreateManyArgs} args - Arguments to create many Levels.
     * @example
     * // Create many Levels
     * const level = await prisma.level.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LevelCreateManyArgs>(args?: SelectSubset<T, LevelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Levels and returns the data saved in the database.
     * @param {LevelCreateManyAndReturnArgs} args - Arguments to create many Levels.
     * @example
     * // Create many Levels
     * const level = await prisma.level.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Levels and only return the `id`
     * const levelWithIdOnly = await prisma.level.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LevelCreateManyAndReturnArgs>(args?: SelectSubset<T, LevelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Level.
     * @param {LevelDeleteArgs} args - Arguments to delete one Level.
     * @example
     * // Delete one Level
     * const Level = await prisma.level.delete({
     *   where: {
     *     // ... filter to delete one Level
     *   }
     * })
     * 
     */
    delete<T extends LevelDeleteArgs>(args: SelectSubset<T, LevelDeleteArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Level.
     * @param {LevelUpdateArgs} args - Arguments to update one Level.
     * @example
     * // Update one Level
     * const level = await prisma.level.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LevelUpdateArgs>(args: SelectSubset<T, LevelUpdateArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Levels.
     * @param {LevelDeleteManyArgs} args - Arguments to filter Levels to delete.
     * @example
     * // Delete a few Levels
     * const { count } = await prisma.level.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LevelDeleteManyArgs>(args?: SelectSubset<T, LevelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Levels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Levels
     * const level = await prisma.level.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LevelUpdateManyArgs>(args: SelectSubset<T, LevelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Levels and returns the data updated in the database.
     * @param {LevelUpdateManyAndReturnArgs} args - Arguments to update many Levels.
     * @example
     * // Update many Levels
     * const level = await prisma.level.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Levels and only return the `id`
     * const levelWithIdOnly = await prisma.level.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LevelUpdateManyAndReturnArgs>(args: SelectSubset<T, LevelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Level.
     * @param {LevelUpsertArgs} args - Arguments to update or create a Level.
     * @example
     * // Update or create a Level
     * const level = await prisma.level.upsert({
     *   create: {
     *     // ... data to create a Level
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Level we want to update
     *   }
     * })
     */
    upsert<T extends LevelUpsertArgs>(args: SelectSubset<T, LevelUpsertArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Levels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelCountArgs} args - Arguments to filter Levels to count.
     * @example
     * // Count the number of Levels
     * const count = await prisma.level.count({
     *   where: {
     *     // ... the filter for the Levels we want to count
     *   }
     * })
    **/
    count<T extends LevelCountArgs>(
      args?: Subset<T, LevelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LevelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Level.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LevelAggregateArgs>(args: Subset<T, LevelAggregateArgs>): Prisma.PrismaPromise<GetLevelAggregateType<T>>

    /**
     * Group by Level.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LevelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LevelGroupByArgs['orderBy'] }
        : { orderBy?: LevelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LevelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLevelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Level model
   */
  readonly fields: LevelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Level.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LevelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    nextLevel<T extends Level$nextLevelArgs<ExtArgs> = {}>(args?: Subset<T, Level$nextLevelArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    previousLevel<T extends Level$previousLevelArgs<ExtArgs> = {}>(args?: Subset<T, Level$previousLevelArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    unlockedBy<T extends Level$unlockedByArgs<ExtArgs> = {}>(args?: Subset<T, Level$unlockedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    choices<T extends Level$choicesArgs<ExtArgs> = {}>(args?: Subset<T, Level$choicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Level model
   */
  interface LevelFieldRefs {
    readonly id: FieldRef<"Level", 'String'>
    readonly name: FieldRef<"Level", 'String'>
    readonly description: FieldRef<"Level", 'String'>
    readonly videoUrl: FieldRef<"Level", 'String'>
    readonly audioUrl: FieldRef<"Level", 'String'>
    readonly unlockCode: FieldRef<"Level", 'String'>
    readonly scoreReward: FieldRef<"Level", 'Int'>
    readonly nextLevelId: FieldRef<"Level", 'String'>
    readonly sequence: FieldRef<"Level", 'Int'>
    readonly createdAt: FieldRef<"Level", 'DateTime'>
    readonly updatedAt: FieldRef<"Level", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Level findUnique
   */
  export type LevelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level findUniqueOrThrow
   */
  export type LevelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level findFirst
   */
  export type LevelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Levels.
     */
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level findFirstOrThrow
   */
  export type LevelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Levels.
     */
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level findMany
   */
  export type LevelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Levels to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level create
   */
  export type LevelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The data needed to create a Level.
     */
    data: XOR<LevelCreateInput, LevelUncheckedCreateInput>
  }

  /**
   * Level createMany
   */
  export type LevelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Levels.
     */
    data: LevelCreateManyInput | LevelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Level createManyAndReturn
   */
  export type LevelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * The data used to create many Levels.
     */
    data: LevelCreateManyInput | LevelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Level update
   */
  export type LevelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The data needed to update a Level.
     */
    data: XOR<LevelUpdateInput, LevelUncheckedUpdateInput>
    /**
     * Choose, which Level to update.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level updateMany
   */
  export type LevelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Levels.
     */
    data: XOR<LevelUpdateManyMutationInput, LevelUncheckedUpdateManyInput>
    /**
     * Filter which Levels to update
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to update.
     */
    limit?: number
  }

  /**
   * Level updateManyAndReturn
   */
  export type LevelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * The data used to update Levels.
     */
    data: XOR<LevelUpdateManyMutationInput, LevelUncheckedUpdateManyInput>
    /**
     * Filter which Levels to update
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Level upsert
   */
  export type LevelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The filter to search for the Level to update in case it exists.
     */
    where: LevelWhereUniqueInput
    /**
     * In case the Level found by the `where` argument doesn't exist, create a new Level with this data.
     */
    create: XOR<LevelCreateInput, LevelUncheckedCreateInput>
    /**
     * In case the Level was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LevelUpdateInput, LevelUncheckedUpdateInput>
  }

  /**
   * Level delete
   */
  export type LevelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter which Level to delete.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level deleteMany
   */
  export type LevelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Levels to delete
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to delete.
     */
    limit?: number
  }

  /**
   * Level.nextLevel
   */
  export type Level$nextLevelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    where?: LevelWhereInput
  }

  /**
   * Level.previousLevel
   */
  export type Level$previousLevelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    where?: LevelWhereInput
  }

  /**
   * Level.unlockedBy
   */
  export type Level$unlockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    where?: LevelUnlockWhereInput
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    cursor?: LevelUnlockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LevelUnlockScalarFieldEnum | LevelUnlockScalarFieldEnum[]
  }

  /**
   * Level.choices
   */
  export type Level$choicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    where?: PlayerChoiceWhereInput
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    cursor?: PlayerChoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerChoiceScalarFieldEnum | PlayerChoiceScalarFieldEnum[]
  }

  /**
   * Level without action
   */
  export type LevelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
  }


  /**
   * Model LevelUnlock
   */

  export type AggregateLevelUnlock = {
    _count: LevelUnlockCountAggregateOutputType | null
    _min: LevelUnlockMinAggregateOutputType | null
    _max: LevelUnlockMaxAggregateOutputType | null
  }

  export type LevelUnlockMinAggregateOutputType = {
    id: string | null
    userId: string | null
    levelId: string | null
    unlockedAt: Date | null
  }

  export type LevelUnlockMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    levelId: string | null
    unlockedAt: Date | null
  }

  export type LevelUnlockCountAggregateOutputType = {
    id: number
    userId: number
    levelId: number
    unlockedAt: number
    _all: number
  }


  export type LevelUnlockMinAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    unlockedAt?: true
  }

  export type LevelUnlockMaxAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    unlockedAt?: true
  }

  export type LevelUnlockCountAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    unlockedAt?: true
    _all?: true
  }

  export type LevelUnlockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LevelUnlock to aggregate.
     */
    where?: LevelUnlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LevelUnlocks to fetch.
     */
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LevelUnlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LevelUnlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LevelUnlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LevelUnlocks
    **/
    _count?: true | LevelUnlockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LevelUnlockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LevelUnlockMaxAggregateInputType
  }

  export type GetLevelUnlockAggregateType<T extends LevelUnlockAggregateArgs> = {
        [P in keyof T & keyof AggregateLevelUnlock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLevelUnlock[P]>
      : GetScalarType<T[P], AggregateLevelUnlock[P]>
  }




  export type LevelUnlockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelUnlockWhereInput
    orderBy?: LevelUnlockOrderByWithAggregationInput | LevelUnlockOrderByWithAggregationInput[]
    by: LevelUnlockScalarFieldEnum[] | LevelUnlockScalarFieldEnum
    having?: LevelUnlockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LevelUnlockCountAggregateInputType | true
    _min?: LevelUnlockMinAggregateInputType
    _max?: LevelUnlockMaxAggregateInputType
  }

  export type LevelUnlockGroupByOutputType = {
    id: string
    userId: string
    levelId: string
    unlockedAt: Date
    _count: LevelUnlockCountAggregateOutputType | null
    _min: LevelUnlockMinAggregateOutputType | null
    _max: LevelUnlockMaxAggregateOutputType | null
  }

  type GetLevelUnlockGroupByPayload<T extends LevelUnlockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LevelUnlockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LevelUnlockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LevelUnlockGroupByOutputType[P]>
            : GetScalarType<T[P], LevelUnlockGroupByOutputType[P]>
        }
      >
    >


  export type LevelUnlockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["levelUnlock"]>

  export type LevelUnlockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["levelUnlock"]>

  export type LevelUnlockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    unlockedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["levelUnlock"]>

  export type LevelUnlockSelectScalar = {
    id?: boolean
    userId?: boolean
    levelId?: boolean
    unlockedAt?: boolean
  }

  export type LevelUnlockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "levelId" | "unlockedAt", ExtArgs["result"]["levelUnlock"]>
  export type LevelUnlockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }
  export type LevelUnlockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }
  export type LevelUnlockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }

  export type $LevelUnlockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LevelUnlock"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      level: Prisma.$LevelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      levelId: string
      unlockedAt: Date
    }, ExtArgs["result"]["levelUnlock"]>
    composites: {}
  }

  type LevelUnlockGetPayload<S extends boolean | null | undefined | LevelUnlockDefaultArgs> = $Result.GetResult<Prisma.$LevelUnlockPayload, S>

  type LevelUnlockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LevelUnlockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LevelUnlockCountAggregateInputType | true
    }

  export interface LevelUnlockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LevelUnlock'], meta: { name: 'LevelUnlock' } }
    /**
     * Find zero or one LevelUnlock that matches the filter.
     * @param {LevelUnlockFindUniqueArgs} args - Arguments to find a LevelUnlock
     * @example
     * // Get one LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LevelUnlockFindUniqueArgs>(args: SelectSubset<T, LevelUnlockFindUniqueArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LevelUnlock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LevelUnlockFindUniqueOrThrowArgs} args - Arguments to find a LevelUnlock
     * @example
     * // Get one LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LevelUnlockFindUniqueOrThrowArgs>(args: SelectSubset<T, LevelUnlockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LevelUnlock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockFindFirstArgs} args - Arguments to find a LevelUnlock
     * @example
     * // Get one LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LevelUnlockFindFirstArgs>(args?: SelectSubset<T, LevelUnlockFindFirstArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LevelUnlock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockFindFirstOrThrowArgs} args - Arguments to find a LevelUnlock
     * @example
     * // Get one LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LevelUnlockFindFirstOrThrowArgs>(args?: SelectSubset<T, LevelUnlockFindFirstOrThrowArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LevelUnlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LevelUnlocks
     * const levelUnlocks = await prisma.levelUnlock.findMany()
     * 
     * // Get first 10 LevelUnlocks
     * const levelUnlocks = await prisma.levelUnlock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const levelUnlockWithIdOnly = await prisma.levelUnlock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LevelUnlockFindManyArgs>(args?: SelectSubset<T, LevelUnlockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LevelUnlock.
     * @param {LevelUnlockCreateArgs} args - Arguments to create a LevelUnlock.
     * @example
     * // Create one LevelUnlock
     * const LevelUnlock = await prisma.levelUnlock.create({
     *   data: {
     *     // ... data to create a LevelUnlock
     *   }
     * })
     * 
     */
    create<T extends LevelUnlockCreateArgs>(args: SelectSubset<T, LevelUnlockCreateArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LevelUnlocks.
     * @param {LevelUnlockCreateManyArgs} args - Arguments to create many LevelUnlocks.
     * @example
     * // Create many LevelUnlocks
     * const levelUnlock = await prisma.levelUnlock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LevelUnlockCreateManyArgs>(args?: SelectSubset<T, LevelUnlockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LevelUnlocks and returns the data saved in the database.
     * @param {LevelUnlockCreateManyAndReturnArgs} args - Arguments to create many LevelUnlocks.
     * @example
     * // Create many LevelUnlocks
     * const levelUnlock = await prisma.levelUnlock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LevelUnlocks and only return the `id`
     * const levelUnlockWithIdOnly = await prisma.levelUnlock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LevelUnlockCreateManyAndReturnArgs>(args?: SelectSubset<T, LevelUnlockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LevelUnlock.
     * @param {LevelUnlockDeleteArgs} args - Arguments to delete one LevelUnlock.
     * @example
     * // Delete one LevelUnlock
     * const LevelUnlock = await prisma.levelUnlock.delete({
     *   where: {
     *     // ... filter to delete one LevelUnlock
     *   }
     * })
     * 
     */
    delete<T extends LevelUnlockDeleteArgs>(args: SelectSubset<T, LevelUnlockDeleteArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LevelUnlock.
     * @param {LevelUnlockUpdateArgs} args - Arguments to update one LevelUnlock.
     * @example
     * // Update one LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LevelUnlockUpdateArgs>(args: SelectSubset<T, LevelUnlockUpdateArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LevelUnlocks.
     * @param {LevelUnlockDeleteManyArgs} args - Arguments to filter LevelUnlocks to delete.
     * @example
     * // Delete a few LevelUnlocks
     * const { count } = await prisma.levelUnlock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LevelUnlockDeleteManyArgs>(args?: SelectSubset<T, LevelUnlockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LevelUnlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LevelUnlocks
     * const levelUnlock = await prisma.levelUnlock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LevelUnlockUpdateManyArgs>(args: SelectSubset<T, LevelUnlockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LevelUnlocks and returns the data updated in the database.
     * @param {LevelUnlockUpdateManyAndReturnArgs} args - Arguments to update many LevelUnlocks.
     * @example
     * // Update many LevelUnlocks
     * const levelUnlock = await prisma.levelUnlock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LevelUnlocks and only return the `id`
     * const levelUnlockWithIdOnly = await prisma.levelUnlock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LevelUnlockUpdateManyAndReturnArgs>(args: SelectSubset<T, LevelUnlockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LevelUnlock.
     * @param {LevelUnlockUpsertArgs} args - Arguments to update or create a LevelUnlock.
     * @example
     * // Update or create a LevelUnlock
     * const levelUnlock = await prisma.levelUnlock.upsert({
     *   create: {
     *     // ... data to create a LevelUnlock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LevelUnlock we want to update
     *   }
     * })
     */
    upsert<T extends LevelUnlockUpsertArgs>(args: SelectSubset<T, LevelUnlockUpsertArgs<ExtArgs>>): Prisma__LevelUnlockClient<$Result.GetResult<Prisma.$LevelUnlockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LevelUnlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockCountArgs} args - Arguments to filter LevelUnlocks to count.
     * @example
     * // Count the number of LevelUnlocks
     * const count = await prisma.levelUnlock.count({
     *   where: {
     *     // ... the filter for the LevelUnlocks we want to count
     *   }
     * })
    **/
    count<T extends LevelUnlockCountArgs>(
      args?: Subset<T, LevelUnlockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LevelUnlockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LevelUnlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LevelUnlockAggregateArgs>(args: Subset<T, LevelUnlockAggregateArgs>): Prisma.PrismaPromise<GetLevelUnlockAggregateType<T>>

    /**
     * Group by LevelUnlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUnlockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LevelUnlockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LevelUnlockGroupByArgs['orderBy'] }
        : { orderBy?: LevelUnlockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LevelUnlockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLevelUnlockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LevelUnlock model
   */
  readonly fields: LevelUnlockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LevelUnlock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LevelUnlockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    level<T extends LevelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LevelDefaultArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LevelUnlock model
   */
  interface LevelUnlockFieldRefs {
    readonly id: FieldRef<"LevelUnlock", 'String'>
    readonly userId: FieldRef<"LevelUnlock", 'String'>
    readonly levelId: FieldRef<"LevelUnlock", 'String'>
    readonly unlockedAt: FieldRef<"LevelUnlock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LevelUnlock findUnique
   */
  export type LevelUnlockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter, which LevelUnlock to fetch.
     */
    where: LevelUnlockWhereUniqueInput
  }

  /**
   * LevelUnlock findUniqueOrThrow
   */
  export type LevelUnlockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter, which LevelUnlock to fetch.
     */
    where: LevelUnlockWhereUniqueInput
  }

  /**
   * LevelUnlock findFirst
   */
  export type LevelUnlockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter, which LevelUnlock to fetch.
     */
    where?: LevelUnlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LevelUnlocks to fetch.
     */
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LevelUnlocks.
     */
    cursor?: LevelUnlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LevelUnlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LevelUnlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LevelUnlocks.
     */
    distinct?: LevelUnlockScalarFieldEnum | LevelUnlockScalarFieldEnum[]
  }

  /**
   * LevelUnlock findFirstOrThrow
   */
  export type LevelUnlockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter, which LevelUnlock to fetch.
     */
    where?: LevelUnlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LevelUnlocks to fetch.
     */
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LevelUnlocks.
     */
    cursor?: LevelUnlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LevelUnlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LevelUnlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LevelUnlocks.
     */
    distinct?: LevelUnlockScalarFieldEnum | LevelUnlockScalarFieldEnum[]
  }

  /**
   * LevelUnlock findMany
   */
  export type LevelUnlockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter, which LevelUnlocks to fetch.
     */
    where?: LevelUnlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LevelUnlocks to fetch.
     */
    orderBy?: LevelUnlockOrderByWithRelationInput | LevelUnlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LevelUnlocks.
     */
    cursor?: LevelUnlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LevelUnlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LevelUnlocks.
     */
    skip?: number
    distinct?: LevelUnlockScalarFieldEnum | LevelUnlockScalarFieldEnum[]
  }

  /**
   * LevelUnlock create
   */
  export type LevelUnlockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * The data needed to create a LevelUnlock.
     */
    data: XOR<LevelUnlockCreateInput, LevelUnlockUncheckedCreateInput>
  }

  /**
   * LevelUnlock createMany
   */
  export type LevelUnlockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LevelUnlocks.
     */
    data: LevelUnlockCreateManyInput | LevelUnlockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LevelUnlock createManyAndReturn
   */
  export type LevelUnlockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * The data used to create many LevelUnlocks.
     */
    data: LevelUnlockCreateManyInput | LevelUnlockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LevelUnlock update
   */
  export type LevelUnlockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * The data needed to update a LevelUnlock.
     */
    data: XOR<LevelUnlockUpdateInput, LevelUnlockUncheckedUpdateInput>
    /**
     * Choose, which LevelUnlock to update.
     */
    where: LevelUnlockWhereUniqueInput
  }

  /**
   * LevelUnlock updateMany
   */
  export type LevelUnlockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LevelUnlocks.
     */
    data: XOR<LevelUnlockUpdateManyMutationInput, LevelUnlockUncheckedUpdateManyInput>
    /**
     * Filter which LevelUnlocks to update
     */
    where?: LevelUnlockWhereInput
    /**
     * Limit how many LevelUnlocks to update.
     */
    limit?: number
  }

  /**
   * LevelUnlock updateManyAndReturn
   */
  export type LevelUnlockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * The data used to update LevelUnlocks.
     */
    data: XOR<LevelUnlockUpdateManyMutationInput, LevelUnlockUncheckedUpdateManyInput>
    /**
     * Filter which LevelUnlocks to update
     */
    where?: LevelUnlockWhereInput
    /**
     * Limit how many LevelUnlocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LevelUnlock upsert
   */
  export type LevelUnlockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * The filter to search for the LevelUnlock to update in case it exists.
     */
    where: LevelUnlockWhereUniqueInput
    /**
     * In case the LevelUnlock found by the `where` argument doesn't exist, create a new LevelUnlock with this data.
     */
    create: XOR<LevelUnlockCreateInput, LevelUnlockUncheckedCreateInput>
    /**
     * In case the LevelUnlock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LevelUnlockUpdateInput, LevelUnlockUncheckedUpdateInput>
  }

  /**
   * LevelUnlock delete
   */
  export type LevelUnlockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
    /**
     * Filter which LevelUnlock to delete.
     */
    where: LevelUnlockWhereUniqueInput
  }

  /**
   * LevelUnlock deleteMany
   */
  export type LevelUnlockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LevelUnlocks to delete
     */
    where?: LevelUnlockWhereInput
    /**
     * Limit how many LevelUnlocks to delete.
     */
    limit?: number
  }

  /**
   * LevelUnlock without action
   */
  export type LevelUnlockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelUnlock
     */
    select?: LevelUnlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LevelUnlock
     */
    omit?: LevelUnlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelUnlockInclude<ExtArgs> | null
  }


  /**
   * Model PlayerChoice
   */

  export type AggregatePlayerChoice = {
    _count: PlayerChoiceCountAggregateOutputType | null
    _min: PlayerChoiceMinAggregateOutputType | null
    _max: PlayerChoiceMaxAggregateOutputType | null
  }

  export type PlayerChoiceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    levelId: string | null
    choiceKey: string | null
    choiceValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerChoiceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    levelId: string | null
    choiceKey: string | null
    choiceValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerChoiceCountAggregateOutputType = {
    id: number
    userId: number
    levelId: number
    choiceKey: number
    choiceValue: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlayerChoiceMinAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    choiceKey?: true
    choiceValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayerChoiceMaxAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    choiceKey?: true
    choiceValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayerChoiceCountAggregateInputType = {
    id?: true
    userId?: true
    levelId?: true
    choiceKey?: true
    choiceValue?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlayerChoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerChoice to aggregate.
     */
    where?: PlayerChoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerChoices to fetch.
     */
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerChoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerChoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerChoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlayerChoices
    **/
    _count?: true | PlayerChoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerChoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerChoiceMaxAggregateInputType
  }

  export type GetPlayerChoiceAggregateType<T extends PlayerChoiceAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayerChoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayerChoice[P]>
      : GetScalarType<T[P], AggregatePlayerChoice[P]>
  }




  export type PlayerChoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerChoiceWhereInput
    orderBy?: PlayerChoiceOrderByWithAggregationInput | PlayerChoiceOrderByWithAggregationInput[]
    by: PlayerChoiceScalarFieldEnum[] | PlayerChoiceScalarFieldEnum
    having?: PlayerChoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerChoiceCountAggregateInputType | true
    _min?: PlayerChoiceMinAggregateInputType
    _max?: PlayerChoiceMaxAggregateInputType
  }

  export type PlayerChoiceGroupByOutputType = {
    id: string
    userId: string
    levelId: string
    choiceKey: string
    choiceValue: string
    createdAt: Date
    updatedAt: Date
    _count: PlayerChoiceCountAggregateOutputType | null
    _min: PlayerChoiceMinAggregateOutputType | null
    _max: PlayerChoiceMaxAggregateOutputType | null
  }

  type GetPlayerChoiceGroupByPayload<T extends PlayerChoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerChoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerChoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerChoiceGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerChoiceGroupByOutputType[P]>
        }
      >
    >


  export type PlayerChoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    choiceKey?: boolean
    choiceValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerChoice"]>

  export type PlayerChoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    choiceKey?: boolean
    choiceValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerChoice"]>

  export type PlayerChoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    levelId?: boolean
    choiceKey?: boolean
    choiceValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerChoice"]>

  export type PlayerChoiceSelectScalar = {
    id?: boolean
    userId?: boolean
    levelId?: boolean
    choiceKey?: boolean
    choiceValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlayerChoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "levelId" | "choiceKey" | "choiceValue" | "createdAt" | "updatedAt", ExtArgs["result"]["playerChoice"]>
  export type PlayerChoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }
  export type PlayerChoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }
  export type PlayerChoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    level?: boolean | LevelDefaultArgs<ExtArgs>
  }

  export type $PlayerChoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlayerChoice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      level: Prisma.$LevelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      levelId: string
      choiceKey: string
      choiceValue: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["playerChoice"]>
    composites: {}
  }

  type PlayerChoiceGetPayload<S extends boolean | null | undefined | PlayerChoiceDefaultArgs> = $Result.GetResult<Prisma.$PlayerChoicePayload, S>

  type PlayerChoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerChoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerChoiceCountAggregateInputType | true
    }

  export interface PlayerChoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlayerChoice'], meta: { name: 'PlayerChoice' } }
    /**
     * Find zero or one PlayerChoice that matches the filter.
     * @param {PlayerChoiceFindUniqueArgs} args - Arguments to find a PlayerChoice
     * @example
     * // Get one PlayerChoice
     * const playerChoice = await prisma.playerChoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerChoiceFindUniqueArgs>(args: SelectSubset<T, PlayerChoiceFindUniqueArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlayerChoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerChoiceFindUniqueOrThrowArgs} args - Arguments to find a PlayerChoice
     * @example
     * // Get one PlayerChoice
     * const playerChoice = await prisma.playerChoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerChoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerChoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerChoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceFindFirstArgs} args - Arguments to find a PlayerChoice
     * @example
     * // Get one PlayerChoice
     * const playerChoice = await prisma.playerChoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerChoiceFindFirstArgs>(args?: SelectSubset<T, PlayerChoiceFindFirstArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerChoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceFindFirstOrThrowArgs} args - Arguments to find a PlayerChoice
     * @example
     * // Get one PlayerChoice
     * const playerChoice = await prisma.playerChoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerChoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerChoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlayerChoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlayerChoices
     * const playerChoices = await prisma.playerChoice.findMany()
     * 
     * // Get first 10 PlayerChoices
     * const playerChoices = await prisma.playerChoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerChoiceWithIdOnly = await prisma.playerChoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerChoiceFindManyArgs>(args?: SelectSubset<T, PlayerChoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlayerChoice.
     * @param {PlayerChoiceCreateArgs} args - Arguments to create a PlayerChoice.
     * @example
     * // Create one PlayerChoice
     * const PlayerChoice = await prisma.playerChoice.create({
     *   data: {
     *     // ... data to create a PlayerChoice
     *   }
     * })
     * 
     */
    create<T extends PlayerChoiceCreateArgs>(args: SelectSubset<T, PlayerChoiceCreateArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlayerChoices.
     * @param {PlayerChoiceCreateManyArgs} args - Arguments to create many PlayerChoices.
     * @example
     * // Create many PlayerChoices
     * const playerChoice = await prisma.playerChoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerChoiceCreateManyArgs>(args?: SelectSubset<T, PlayerChoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlayerChoices and returns the data saved in the database.
     * @param {PlayerChoiceCreateManyAndReturnArgs} args - Arguments to create many PlayerChoices.
     * @example
     * // Create many PlayerChoices
     * const playerChoice = await prisma.playerChoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlayerChoices and only return the `id`
     * const playerChoiceWithIdOnly = await prisma.playerChoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerChoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerChoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlayerChoice.
     * @param {PlayerChoiceDeleteArgs} args - Arguments to delete one PlayerChoice.
     * @example
     * // Delete one PlayerChoice
     * const PlayerChoice = await prisma.playerChoice.delete({
     *   where: {
     *     // ... filter to delete one PlayerChoice
     *   }
     * })
     * 
     */
    delete<T extends PlayerChoiceDeleteArgs>(args: SelectSubset<T, PlayerChoiceDeleteArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlayerChoice.
     * @param {PlayerChoiceUpdateArgs} args - Arguments to update one PlayerChoice.
     * @example
     * // Update one PlayerChoice
     * const playerChoice = await prisma.playerChoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerChoiceUpdateArgs>(args: SelectSubset<T, PlayerChoiceUpdateArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlayerChoices.
     * @param {PlayerChoiceDeleteManyArgs} args - Arguments to filter PlayerChoices to delete.
     * @example
     * // Delete a few PlayerChoices
     * const { count } = await prisma.playerChoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerChoiceDeleteManyArgs>(args?: SelectSubset<T, PlayerChoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerChoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlayerChoices
     * const playerChoice = await prisma.playerChoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerChoiceUpdateManyArgs>(args: SelectSubset<T, PlayerChoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerChoices and returns the data updated in the database.
     * @param {PlayerChoiceUpdateManyAndReturnArgs} args - Arguments to update many PlayerChoices.
     * @example
     * // Update many PlayerChoices
     * const playerChoice = await prisma.playerChoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlayerChoices and only return the `id`
     * const playerChoiceWithIdOnly = await prisma.playerChoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerChoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerChoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlayerChoice.
     * @param {PlayerChoiceUpsertArgs} args - Arguments to update or create a PlayerChoice.
     * @example
     * // Update or create a PlayerChoice
     * const playerChoice = await prisma.playerChoice.upsert({
     *   create: {
     *     // ... data to create a PlayerChoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlayerChoice we want to update
     *   }
     * })
     */
    upsert<T extends PlayerChoiceUpsertArgs>(args: SelectSubset<T, PlayerChoiceUpsertArgs<ExtArgs>>): Prisma__PlayerChoiceClient<$Result.GetResult<Prisma.$PlayerChoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlayerChoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceCountArgs} args - Arguments to filter PlayerChoices to count.
     * @example
     * // Count the number of PlayerChoices
     * const count = await prisma.playerChoice.count({
     *   where: {
     *     // ... the filter for the PlayerChoices we want to count
     *   }
     * })
    **/
    count<T extends PlayerChoiceCountArgs>(
      args?: Subset<T, PlayerChoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerChoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlayerChoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerChoiceAggregateArgs>(args: Subset<T, PlayerChoiceAggregateArgs>): Prisma.PrismaPromise<GetPlayerChoiceAggregateType<T>>

    /**
     * Group by PlayerChoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerChoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerChoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerChoiceGroupByArgs['orderBy'] }
        : { orderBy?: PlayerChoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerChoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerChoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlayerChoice model
   */
  readonly fields: PlayerChoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlayerChoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerChoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    level<T extends LevelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LevelDefaultArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlayerChoice model
   */
  interface PlayerChoiceFieldRefs {
    readonly id: FieldRef<"PlayerChoice", 'String'>
    readonly userId: FieldRef<"PlayerChoice", 'String'>
    readonly levelId: FieldRef<"PlayerChoice", 'String'>
    readonly choiceKey: FieldRef<"PlayerChoice", 'String'>
    readonly choiceValue: FieldRef<"PlayerChoice", 'String'>
    readonly createdAt: FieldRef<"PlayerChoice", 'DateTime'>
    readonly updatedAt: FieldRef<"PlayerChoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlayerChoice findUnique
   */
  export type PlayerChoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter, which PlayerChoice to fetch.
     */
    where: PlayerChoiceWhereUniqueInput
  }

  /**
   * PlayerChoice findUniqueOrThrow
   */
  export type PlayerChoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter, which PlayerChoice to fetch.
     */
    where: PlayerChoiceWhereUniqueInput
  }

  /**
   * PlayerChoice findFirst
   */
  export type PlayerChoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter, which PlayerChoice to fetch.
     */
    where?: PlayerChoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerChoices to fetch.
     */
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerChoices.
     */
    cursor?: PlayerChoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerChoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerChoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerChoices.
     */
    distinct?: PlayerChoiceScalarFieldEnum | PlayerChoiceScalarFieldEnum[]
  }

  /**
   * PlayerChoice findFirstOrThrow
   */
  export type PlayerChoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter, which PlayerChoice to fetch.
     */
    where?: PlayerChoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerChoices to fetch.
     */
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerChoices.
     */
    cursor?: PlayerChoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerChoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerChoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerChoices.
     */
    distinct?: PlayerChoiceScalarFieldEnum | PlayerChoiceScalarFieldEnum[]
  }

  /**
   * PlayerChoice findMany
   */
  export type PlayerChoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter, which PlayerChoices to fetch.
     */
    where?: PlayerChoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerChoices to fetch.
     */
    orderBy?: PlayerChoiceOrderByWithRelationInput | PlayerChoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlayerChoices.
     */
    cursor?: PlayerChoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerChoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerChoices.
     */
    skip?: number
    distinct?: PlayerChoiceScalarFieldEnum | PlayerChoiceScalarFieldEnum[]
  }

  /**
   * PlayerChoice create
   */
  export type PlayerChoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a PlayerChoice.
     */
    data: XOR<PlayerChoiceCreateInput, PlayerChoiceUncheckedCreateInput>
  }

  /**
   * PlayerChoice createMany
   */
  export type PlayerChoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlayerChoices.
     */
    data: PlayerChoiceCreateManyInput | PlayerChoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlayerChoice createManyAndReturn
   */
  export type PlayerChoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * The data used to create many PlayerChoices.
     */
    data: PlayerChoiceCreateManyInput | PlayerChoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerChoice update
   */
  export type PlayerChoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a PlayerChoice.
     */
    data: XOR<PlayerChoiceUpdateInput, PlayerChoiceUncheckedUpdateInput>
    /**
     * Choose, which PlayerChoice to update.
     */
    where: PlayerChoiceWhereUniqueInput
  }

  /**
   * PlayerChoice updateMany
   */
  export type PlayerChoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlayerChoices.
     */
    data: XOR<PlayerChoiceUpdateManyMutationInput, PlayerChoiceUncheckedUpdateManyInput>
    /**
     * Filter which PlayerChoices to update
     */
    where?: PlayerChoiceWhereInput
    /**
     * Limit how many PlayerChoices to update.
     */
    limit?: number
  }

  /**
   * PlayerChoice updateManyAndReturn
   */
  export type PlayerChoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * The data used to update PlayerChoices.
     */
    data: XOR<PlayerChoiceUpdateManyMutationInput, PlayerChoiceUncheckedUpdateManyInput>
    /**
     * Filter which PlayerChoices to update
     */
    where?: PlayerChoiceWhereInput
    /**
     * Limit how many PlayerChoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerChoice upsert
   */
  export type PlayerChoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the PlayerChoice to update in case it exists.
     */
    where: PlayerChoiceWhereUniqueInput
    /**
     * In case the PlayerChoice found by the `where` argument doesn't exist, create a new PlayerChoice with this data.
     */
    create: XOR<PlayerChoiceCreateInput, PlayerChoiceUncheckedCreateInput>
    /**
     * In case the PlayerChoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerChoiceUpdateInput, PlayerChoiceUncheckedUpdateInput>
  }

  /**
   * PlayerChoice delete
   */
  export type PlayerChoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
    /**
     * Filter which PlayerChoice to delete.
     */
    where: PlayerChoiceWhereUniqueInput
  }

  /**
   * PlayerChoice deleteMany
   */
  export type PlayerChoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerChoices to delete
     */
    where?: PlayerChoiceWhereInput
    /**
     * Limit how many PlayerChoices to delete.
     */
    limit?: number
  }

  /**
   * PlayerChoice without action
   */
  export type PlayerChoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerChoice
     */
    select?: PlayerChoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerChoice
     */
    omit?: PlayerChoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerChoiceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    score: 'score',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const LevelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    videoUrl: 'videoUrl',
    audioUrl: 'audioUrl',
    unlockCode: 'unlockCode',
    scoreReward: 'scoreReward',
    nextLevelId: 'nextLevelId',
    sequence: 'sequence',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LevelScalarFieldEnum = (typeof LevelScalarFieldEnum)[keyof typeof LevelScalarFieldEnum]


  export const LevelUnlockScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    levelId: 'levelId',
    unlockedAt: 'unlockedAt'
  };

  export type LevelUnlockScalarFieldEnum = (typeof LevelUnlockScalarFieldEnum)[keyof typeof LevelUnlockScalarFieldEnum]


  export const PlayerChoiceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    levelId: 'levelId',
    choiceKey: 'choiceKey',
    choiceValue: 'choiceValue',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlayerChoiceScalarFieldEnum = (typeof PlayerChoiceScalarFieldEnum)[keyof typeof PlayerChoiceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    score?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    unlockedLevels?: LevelUnlockListRelationFilter
    choices?: PlayerChoiceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    unlockedLevels?: LevelUnlockOrderByRelationAggregateInput
    choices?: PlayerChoiceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    score?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    unlockedLevels?: LevelUnlockListRelationFilter
    choices?: PlayerChoiceListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    score?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type LevelWhereInput = {
    AND?: LevelWhereInput | LevelWhereInput[]
    OR?: LevelWhereInput[]
    NOT?: LevelWhereInput | LevelWhereInput[]
    id?: StringFilter<"Level"> | string
    name?: StringFilter<"Level"> | string
    description?: StringNullableFilter<"Level"> | string | null
    videoUrl?: StringNullableFilter<"Level"> | string | null
    audioUrl?: StringNullableFilter<"Level"> | string | null
    unlockCode?: StringFilter<"Level"> | string
    scoreReward?: IntFilter<"Level"> | number
    nextLevelId?: StringNullableFilter<"Level"> | string | null
    sequence?: IntFilter<"Level"> | number
    createdAt?: DateTimeFilter<"Level"> | Date | string
    updatedAt?: DateTimeFilter<"Level"> | Date | string
    nextLevel?: XOR<LevelNullableScalarRelationFilter, LevelWhereInput> | null
    previousLevel?: XOR<LevelNullableScalarRelationFilter, LevelWhereInput> | null
    unlockedBy?: LevelUnlockListRelationFilter
    choices?: PlayerChoiceListRelationFilter
  }

  export type LevelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    videoUrl?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    unlockCode?: SortOrder
    scoreReward?: SortOrder
    nextLevelId?: SortOrderInput | SortOrder
    sequence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    nextLevel?: LevelOrderByWithRelationInput
    previousLevel?: LevelOrderByWithRelationInput
    unlockedBy?: LevelUnlockOrderByRelationAggregateInput
    choices?: PlayerChoiceOrderByRelationAggregateInput
  }

  export type LevelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nextLevelId?: string
    AND?: LevelWhereInput | LevelWhereInput[]
    OR?: LevelWhereInput[]
    NOT?: LevelWhereInput | LevelWhereInput[]
    name?: StringFilter<"Level"> | string
    description?: StringNullableFilter<"Level"> | string | null
    videoUrl?: StringNullableFilter<"Level"> | string | null
    audioUrl?: StringNullableFilter<"Level"> | string | null
    unlockCode?: StringFilter<"Level"> | string
    scoreReward?: IntFilter<"Level"> | number
    sequence?: IntFilter<"Level"> | number
    createdAt?: DateTimeFilter<"Level"> | Date | string
    updatedAt?: DateTimeFilter<"Level"> | Date | string
    nextLevel?: XOR<LevelNullableScalarRelationFilter, LevelWhereInput> | null
    previousLevel?: XOR<LevelNullableScalarRelationFilter, LevelWhereInput> | null
    unlockedBy?: LevelUnlockListRelationFilter
    choices?: PlayerChoiceListRelationFilter
  }, "id" | "nextLevelId">

  export type LevelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    videoUrl?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    unlockCode?: SortOrder
    scoreReward?: SortOrder
    nextLevelId?: SortOrderInput | SortOrder
    sequence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LevelCountOrderByAggregateInput
    _avg?: LevelAvgOrderByAggregateInput
    _max?: LevelMaxOrderByAggregateInput
    _min?: LevelMinOrderByAggregateInput
    _sum?: LevelSumOrderByAggregateInput
  }

  export type LevelScalarWhereWithAggregatesInput = {
    AND?: LevelScalarWhereWithAggregatesInput | LevelScalarWhereWithAggregatesInput[]
    OR?: LevelScalarWhereWithAggregatesInput[]
    NOT?: LevelScalarWhereWithAggregatesInput | LevelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Level"> | string
    name?: StringWithAggregatesFilter<"Level"> | string
    description?: StringNullableWithAggregatesFilter<"Level"> | string | null
    videoUrl?: StringNullableWithAggregatesFilter<"Level"> | string | null
    audioUrl?: StringNullableWithAggregatesFilter<"Level"> | string | null
    unlockCode?: StringWithAggregatesFilter<"Level"> | string
    scoreReward?: IntWithAggregatesFilter<"Level"> | number
    nextLevelId?: StringNullableWithAggregatesFilter<"Level"> | string | null
    sequence?: IntWithAggregatesFilter<"Level"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Level"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Level"> | Date | string
  }

  export type LevelUnlockWhereInput = {
    AND?: LevelUnlockWhereInput | LevelUnlockWhereInput[]
    OR?: LevelUnlockWhereInput[]
    NOT?: LevelUnlockWhereInput | LevelUnlockWhereInput[]
    id?: StringFilter<"LevelUnlock"> | string
    userId?: StringFilter<"LevelUnlock"> | string
    levelId?: StringFilter<"LevelUnlock"> | string
    unlockedAt?: DateTimeFilter<"LevelUnlock"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
  }

  export type LevelUnlockOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    unlockedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    level?: LevelOrderByWithRelationInput
  }

  export type LevelUnlockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_levelId?: LevelUnlockUserIdLevelIdCompoundUniqueInput
    AND?: LevelUnlockWhereInput | LevelUnlockWhereInput[]
    OR?: LevelUnlockWhereInput[]
    NOT?: LevelUnlockWhereInput | LevelUnlockWhereInput[]
    userId?: StringFilter<"LevelUnlock"> | string
    levelId?: StringFilter<"LevelUnlock"> | string
    unlockedAt?: DateTimeFilter<"LevelUnlock"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
  }, "id" | "userId_levelId">

  export type LevelUnlockOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    unlockedAt?: SortOrder
    _count?: LevelUnlockCountOrderByAggregateInput
    _max?: LevelUnlockMaxOrderByAggregateInput
    _min?: LevelUnlockMinOrderByAggregateInput
  }

  export type LevelUnlockScalarWhereWithAggregatesInput = {
    AND?: LevelUnlockScalarWhereWithAggregatesInput | LevelUnlockScalarWhereWithAggregatesInput[]
    OR?: LevelUnlockScalarWhereWithAggregatesInput[]
    NOT?: LevelUnlockScalarWhereWithAggregatesInput | LevelUnlockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LevelUnlock"> | string
    userId?: StringWithAggregatesFilter<"LevelUnlock"> | string
    levelId?: StringWithAggregatesFilter<"LevelUnlock"> | string
    unlockedAt?: DateTimeWithAggregatesFilter<"LevelUnlock"> | Date | string
  }

  export type PlayerChoiceWhereInput = {
    AND?: PlayerChoiceWhereInput | PlayerChoiceWhereInput[]
    OR?: PlayerChoiceWhereInput[]
    NOT?: PlayerChoiceWhereInput | PlayerChoiceWhereInput[]
    id?: StringFilter<"PlayerChoice"> | string
    userId?: StringFilter<"PlayerChoice"> | string
    levelId?: StringFilter<"PlayerChoice"> | string
    choiceKey?: StringFilter<"PlayerChoice"> | string
    choiceValue?: StringFilter<"PlayerChoice"> | string
    createdAt?: DateTimeFilter<"PlayerChoice"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerChoice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
  }

  export type PlayerChoiceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    choiceKey?: SortOrder
    choiceValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    level?: LevelOrderByWithRelationInput
  }

  export type PlayerChoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_levelId_choiceKey?: PlayerChoiceUserIdLevelIdChoiceKeyCompoundUniqueInput
    AND?: PlayerChoiceWhereInput | PlayerChoiceWhereInput[]
    OR?: PlayerChoiceWhereInput[]
    NOT?: PlayerChoiceWhereInput | PlayerChoiceWhereInput[]
    userId?: StringFilter<"PlayerChoice"> | string
    levelId?: StringFilter<"PlayerChoice"> | string
    choiceKey?: StringFilter<"PlayerChoice"> | string
    choiceValue?: StringFilter<"PlayerChoice"> | string
    createdAt?: DateTimeFilter<"PlayerChoice"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerChoice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
  }, "id" | "userId_levelId_choiceKey">

  export type PlayerChoiceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    choiceKey?: SortOrder
    choiceValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlayerChoiceCountOrderByAggregateInput
    _max?: PlayerChoiceMaxOrderByAggregateInput
    _min?: PlayerChoiceMinOrderByAggregateInput
  }

  export type PlayerChoiceScalarWhereWithAggregatesInput = {
    AND?: PlayerChoiceScalarWhereWithAggregatesInput | PlayerChoiceScalarWhereWithAggregatesInput[]
    OR?: PlayerChoiceScalarWhereWithAggregatesInput[]
    NOT?: PlayerChoiceScalarWhereWithAggregatesInput | PlayerChoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlayerChoice"> | string
    userId?: StringWithAggregatesFilter<"PlayerChoice"> | string
    levelId?: StringWithAggregatesFilter<"PlayerChoice"> | string
    choiceKey?: StringWithAggregatesFilter<"PlayerChoice"> | string
    choiceValue?: StringWithAggregatesFilter<"PlayerChoice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PlayerChoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PlayerChoice"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    unlockedLevels?: LevelUnlockCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    unlockedLevels?: LevelUnlockUncheckedCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    unlockedLevels?: LevelUnlockUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    unlockedLevels?: LevelUnlockUncheckedUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelCreateInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nextLevel?: LevelCreateNestedOneWithoutPreviousLevelInput
    previousLevel?: LevelCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    nextLevelId?: string | null
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    previousLevel?: LevelUncheckedCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockUncheckedCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextLevel?: LevelUpdateOneWithoutPreviousLevelNestedInput
    previousLevel?: LevelUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    nextLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previousLevel?: LevelUncheckedUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUncheckedUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type LevelCreateManyInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    nextLevelId?: string | null
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LevelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    nextLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockCreateInput = {
    id?: string
    unlockedAt?: Date | string
    user: UserCreateNestedOneWithoutUnlockedLevelsInput
    level: LevelCreateNestedOneWithoutUnlockedByInput
  }

  export type LevelUnlockUncheckedCreateInput = {
    id?: string
    userId: string
    levelId: string
    unlockedAt?: Date | string
  }

  export type LevelUnlockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUnlockedLevelsNestedInput
    level?: LevelUpdateOneRequiredWithoutUnlockedByNestedInput
  }

  export type LevelUnlockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockCreateManyInput = {
    id?: string
    userId: string
    levelId: string
    unlockedAt?: Date | string
  }

  export type LevelUnlockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceCreateInput = {
    id?: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChoicesInput
    level: LevelCreateNestedOneWithoutChoicesInput
  }

  export type PlayerChoiceUncheckedCreateInput = {
    id?: string
    userId: string
    levelId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerChoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChoicesNestedInput
    level?: LevelUpdateOneRequiredWithoutChoicesNestedInput
  }

  export type PlayerChoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceCreateManyInput = {
    id?: string
    userId: string
    levelId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerChoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type LevelUnlockListRelationFilter = {
    every?: LevelUnlockWhereInput
    some?: LevelUnlockWhereInput
    none?: LevelUnlockWhereInput
  }

  export type PlayerChoiceListRelationFilter = {
    every?: PlayerChoiceWhereInput
    some?: PlayerChoiceWhereInput
    none?: PlayerChoiceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LevelUnlockOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerChoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LevelNullableScalarRelationFilter = {
    is?: LevelWhereInput | null
    isNot?: LevelWhereInput | null
  }

  export type LevelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    audioUrl?: SortOrder
    unlockCode?: SortOrder
    scoreReward?: SortOrder
    nextLevelId?: SortOrder
    sequence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LevelAvgOrderByAggregateInput = {
    scoreReward?: SortOrder
    sequence?: SortOrder
  }

  export type LevelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    audioUrl?: SortOrder
    unlockCode?: SortOrder
    scoreReward?: SortOrder
    nextLevelId?: SortOrder
    sequence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LevelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    audioUrl?: SortOrder
    unlockCode?: SortOrder
    scoreReward?: SortOrder
    nextLevelId?: SortOrder
    sequence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LevelSumOrderByAggregateInput = {
    scoreReward?: SortOrder
    sequence?: SortOrder
  }

  export type LevelScalarRelationFilter = {
    is?: LevelWhereInput
    isNot?: LevelWhereInput
  }

  export type LevelUnlockUserIdLevelIdCompoundUniqueInput = {
    userId: string
    levelId: string
  }

  export type LevelUnlockCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    unlockedAt?: SortOrder
  }

  export type LevelUnlockMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    unlockedAt?: SortOrder
  }

  export type LevelUnlockMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    unlockedAt?: SortOrder
  }

  export type PlayerChoiceUserIdLevelIdChoiceKeyCompoundUniqueInput = {
    userId: string
    levelId: string
    choiceKey: string
  }

  export type PlayerChoiceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    choiceKey?: SortOrder
    choiceValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerChoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    choiceKey?: SortOrder
    choiceValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerChoiceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    levelId?: SortOrder
    choiceKey?: SortOrder
    choiceValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type LevelUnlockCreateNestedManyWithoutUserInput = {
    create?: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput> | LevelUnlockCreateWithoutUserInput[] | LevelUnlockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutUserInput | LevelUnlockCreateOrConnectWithoutUserInput[]
    createMany?: LevelUnlockCreateManyUserInputEnvelope
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
  }

  export type PlayerChoiceCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput> | PlayerChoiceCreateWithoutUserInput[] | PlayerChoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutUserInput | PlayerChoiceCreateOrConnectWithoutUserInput[]
    createMany?: PlayerChoiceCreateManyUserInputEnvelope
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type LevelUnlockUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput> | LevelUnlockCreateWithoutUserInput[] | LevelUnlockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutUserInput | LevelUnlockCreateOrConnectWithoutUserInput[]
    createMany?: LevelUnlockCreateManyUserInputEnvelope
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
  }

  export type PlayerChoiceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput> | PlayerChoiceCreateWithoutUserInput[] | PlayerChoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutUserInput | PlayerChoiceCreateOrConnectWithoutUserInput[]
    createMany?: PlayerChoiceCreateManyUserInputEnvelope
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type LevelUnlockUpdateManyWithoutUserNestedInput = {
    create?: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput> | LevelUnlockCreateWithoutUserInput[] | LevelUnlockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutUserInput | LevelUnlockCreateOrConnectWithoutUserInput[]
    upsert?: LevelUnlockUpsertWithWhereUniqueWithoutUserInput | LevelUnlockUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LevelUnlockCreateManyUserInputEnvelope
    set?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    disconnect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    delete?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    update?: LevelUnlockUpdateWithWhereUniqueWithoutUserInput | LevelUnlockUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LevelUnlockUpdateManyWithWhereWithoutUserInput | LevelUnlockUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
  }

  export type PlayerChoiceUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput> | PlayerChoiceCreateWithoutUserInput[] | PlayerChoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutUserInput | PlayerChoiceCreateOrConnectWithoutUserInput[]
    upsert?: PlayerChoiceUpsertWithWhereUniqueWithoutUserInput | PlayerChoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerChoiceCreateManyUserInputEnvelope
    set?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    disconnect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    delete?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    update?: PlayerChoiceUpdateWithWhereUniqueWithoutUserInput | PlayerChoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerChoiceUpdateManyWithWhereWithoutUserInput | PlayerChoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type LevelUnlockUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput> | LevelUnlockCreateWithoutUserInput[] | LevelUnlockUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutUserInput | LevelUnlockCreateOrConnectWithoutUserInput[]
    upsert?: LevelUnlockUpsertWithWhereUniqueWithoutUserInput | LevelUnlockUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LevelUnlockCreateManyUserInputEnvelope
    set?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    disconnect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    delete?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    update?: LevelUnlockUpdateWithWhereUniqueWithoutUserInput | LevelUnlockUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LevelUnlockUpdateManyWithWhereWithoutUserInput | LevelUnlockUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
  }

  export type PlayerChoiceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput> | PlayerChoiceCreateWithoutUserInput[] | PlayerChoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutUserInput | PlayerChoiceCreateOrConnectWithoutUserInput[]
    upsert?: PlayerChoiceUpsertWithWhereUniqueWithoutUserInput | PlayerChoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerChoiceCreateManyUserInputEnvelope
    set?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    disconnect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    delete?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    update?: PlayerChoiceUpdateWithWhereUniqueWithoutUserInput | PlayerChoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerChoiceUpdateManyWithWhereWithoutUserInput | PlayerChoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type LevelCreateNestedOneWithoutPreviousLevelInput = {
    create?: XOR<LevelCreateWithoutPreviousLevelInput, LevelUncheckedCreateWithoutPreviousLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutPreviousLevelInput
    connect?: LevelWhereUniqueInput
  }

  export type LevelCreateNestedOneWithoutNextLevelInput = {
    create?: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutNextLevelInput
    connect?: LevelWhereUniqueInput
  }

  export type LevelUnlockCreateNestedManyWithoutLevelInput = {
    create?: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput> | LevelUnlockCreateWithoutLevelInput[] | LevelUnlockUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutLevelInput | LevelUnlockCreateOrConnectWithoutLevelInput[]
    createMany?: LevelUnlockCreateManyLevelInputEnvelope
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
  }

  export type PlayerChoiceCreateNestedManyWithoutLevelInput = {
    create?: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput> | PlayerChoiceCreateWithoutLevelInput[] | PlayerChoiceUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutLevelInput | PlayerChoiceCreateOrConnectWithoutLevelInput[]
    createMany?: PlayerChoiceCreateManyLevelInputEnvelope
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
  }

  export type LevelUncheckedCreateNestedOneWithoutNextLevelInput = {
    create?: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutNextLevelInput
    connect?: LevelWhereUniqueInput
  }

  export type LevelUnlockUncheckedCreateNestedManyWithoutLevelInput = {
    create?: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput> | LevelUnlockCreateWithoutLevelInput[] | LevelUnlockUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutLevelInput | LevelUnlockCreateOrConnectWithoutLevelInput[]
    createMany?: LevelUnlockCreateManyLevelInputEnvelope
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
  }

  export type PlayerChoiceUncheckedCreateNestedManyWithoutLevelInput = {
    create?: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput> | PlayerChoiceCreateWithoutLevelInput[] | PlayerChoiceUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutLevelInput | PlayerChoiceCreateOrConnectWithoutLevelInput[]
    createMany?: PlayerChoiceCreateManyLevelInputEnvelope
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
  }

  export type LevelUpdateOneWithoutPreviousLevelNestedInput = {
    create?: XOR<LevelCreateWithoutPreviousLevelInput, LevelUncheckedCreateWithoutPreviousLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutPreviousLevelInput
    upsert?: LevelUpsertWithoutPreviousLevelInput
    disconnect?: LevelWhereInput | boolean
    delete?: LevelWhereInput | boolean
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutPreviousLevelInput, LevelUpdateWithoutPreviousLevelInput>, LevelUncheckedUpdateWithoutPreviousLevelInput>
  }

  export type LevelUpdateOneWithoutNextLevelNestedInput = {
    create?: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutNextLevelInput
    upsert?: LevelUpsertWithoutNextLevelInput
    disconnect?: LevelWhereInput | boolean
    delete?: LevelWhereInput | boolean
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutNextLevelInput, LevelUpdateWithoutNextLevelInput>, LevelUncheckedUpdateWithoutNextLevelInput>
  }

  export type LevelUnlockUpdateManyWithoutLevelNestedInput = {
    create?: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput> | LevelUnlockCreateWithoutLevelInput[] | LevelUnlockUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutLevelInput | LevelUnlockCreateOrConnectWithoutLevelInput[]
    upsert?: LevelUnlockUpsertWithWhereUniqueWithoutLevelInput | LevelUnlockUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: LevelUnlockCreateManyLevelInputEnvelope
    set?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    disconnect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    delete?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    update?: LevelUnlockUpdateWithWhereUniqueWithoutLevelInput | LevelUnlockUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: LevelUnlockUpdateManyWithWhereWithoutLevelInput | LevelUnlockUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
  }

  export type PlayerChoiceUpdateManyWithoutLevelNestedInput = {
    create?: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput> | PlayerChoiceCreateWithoutLevelInput[] | PlayerChoiceUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutLevelInput | PlayerChoiceCreateOrConnectWithoutLevelInput[]
    upsert?: PlayerChoiceUpsertWithWhereUniqueWithoutLevelInput | PlayerChoiceUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: PlayerChoiceCreateManyLevelInputEnvelope
    set?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    disconnect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    delete?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    update?: PlayerChoiceUpdateWithWhereUniqueWithoutLevelInput | PlayerChoiceUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: PlayerChoiceUpdateManyWithWhereWithoutLevelInput | PlayerChoiceUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
  }

  export type LevelUncheckedUpdateOneWithoutNextLevelNestedInput = {
    create?: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
    connectOrCreate?: LevelCreateOrConnectWithoutNextLevelInput
    upsert?: LevelUpsertWithoutNextLevelInput
    disconnect?: LevelWhereInput | boolean
    delete?: LevelWhereInput | boolean
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutNextLevelInput, LevelUpdateWithoutNextLevelInput>, LevelUncheckedUpdateWithoutNextLevelInput>
  }

  export type LevelUnlockUncheckedUpdateManyWithoutLevelNestedInput = {
    create?: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput> | LevelUnlockCreateWithoutLevelInput[] | LevelUnlockUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: LevelUnlockCreateOrConnectWithoutLevelInput | LevelUnlockCreateOrConnectWithoutLevelInput[]
    upsert?: LevelUnlockUpsertWithWhereUniqueWithoutLevelInput | LevelUnlockUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: LevelUnlockCreateManyLevelInputEnvelope
    set?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    disconnect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    delete?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    connect?: LevelUnlockWhereUniqueInput | LevelUnlockWhereUniqueInput[]
    update?: LevelUnlockUpdateWithWhereUniqueWithoutLevelInput | LevelUnlockUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: LevelUnlockUpdateManyWithWhereWithoutLevelInput | LevelUnlockUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
  }

  export type PlayerChoiceUncheckedUpdateManyWithoutLevelNestedInput = {
    create?: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput> | PlayerChoiceCreateWithoutLevelInput[] | PlayerChoiceUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: PlayerChoiceCreateOrConnectWithoutLevelInput | PlayerChoiceCreateOrConnectWithoutLevelInput[]
    upsert?: PlayerChoiceUpsertWithWhereUniqueWithoutLevelInput | PlayerChoiceUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: PlayerChoiceCreateManyLevelInputEnvelope
    set?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    disconnect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    delete?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    connect?: PlayerChoiceWhereUniqueInput | PlayerChoiceWhereUniqueInput[]
    update?: PlayerChoiceUpdateWithWhereUniqueWithoutLevelInput | PlayerChoiceUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: PlayerChoiceUpdateManyWithWhereWithoutLevelInput | PlayerChoiceUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUnlockedLevelsInput = {
    create?: XOR<UserCreateWithoutUnlockedLevelsInput, UserUncheckedCreateWithoutUnlockedLevelsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUnlockedLevelsInput
    connect?: UserWhereUniqueInput
  }

  export type LevelCreateNestedOneWithoutUnlockedByInput = {
    create?: XOR<LevelCreateWithoutUnlockedByInput, LevelUncheckedCreateWithoutUnlockedByInput>
    connectOrCreate?: LevelCreateOrConnectWithoutUnlockedByInput
    connect?: LevelWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUnlockedLevelsNestedInput = {
    create?: XOR<UserCreateWithoutUnlockedLevelsInput, UserUncheckedCreateWithoutUnlockedLevelsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUnlockedLevelsInput
    upsert?: UserUpsertWithoutUnlockedLevelsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUnlockedLevelsInput, UserUpdateWithoutUnlockedLevelsInput>, UserUncheckedUpdateWithoutUnlockedLevelsInput>
  }

  export type LevelUpdateOneRequiredWithoutUnlockedByNestedInput = {
    create?: XOR<LevelCreateWithoutUnlockedByInput, LevelUncheckedCreateWithoutUnlockedByInput>
    connectOrCreate?: LevelCreateOrConnectWithoutUnlockedByInput
    upsert?: LevelUpsertWithoutUnlockedByInput
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutUnlockedByInput, LevelUpdateWithoutUnlockedByInput>, LevelUncheckedUpdateWithoutUnlockedByInput>
  }

  export type UserCreateNestedOneWithoutChoicesInput = {
    create?: XOR<UserCreateWithoutChoicesInput, UserUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutChoicesInput
    connect?: UserWhereUniqueInput
  }

  export type LevelCreateNestedOneWithoutChoicesInput = {
    create?: XOR<LevelCreateWithoutChoicesInput, LevelUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: LevelCreateOrConnectWithoutChoicesInput
    connect?: LevelWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutChoicesNestedInput = {
    create?: XOR<UserCreateWithoutChoicesInput, UserUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutChoicesInput
    upsert?: UserUpsertWithoutChoicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChoicesInput, UserUpdateWithoutChoicesInput>, UserUncheckedUpdateWithoutChoicesInput>
  }

  export type LevelUpdateOneRequiredWithoutChoicesNestedInput = {
    create?: XOR<LevelCreateWithoutChoicesInput, LevelUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: LevelCreateOrConnectWithoutChoicesInput
    upsert?: LevelUpsertWithoutChoicesInput
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutChoicesInput, LevelUpdateWithoutChoicesInput>, LevelUncheckedUpdateWithoutChoicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LevelUnlockCreateWithoutUserInput = {
    id?: string
    unlockedAt?: Date | string
    level: LevelCreateNestedOneWithoutUnlockedByInput
  }

  export type LevelUnlockUncheckedCreateWithoutUserInput = {
    id?: string
    levelId: string
    unlockedAt?: Date | string
  }

  export type LevelUnlockCreateOrConnectWithoutUserInput = {
    where: LevelUnlockWhereUniqueInput
    create: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput>
  }

  export type LevelUnlockCreateManyUserInputEnvelope = {
    data: LevelUnlockCreateManyUserInput | LevelUnlockCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PlayerChoiceCreateWithoutUserInput = {
    id?: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    level: LevelCreateNestedOneWithoutChoicesInput
  }

  export type PlayerChoiceUncheckedCreateWithoutUserInput = {
    id?: string
    levelId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerChoiceCreateOrConnectWithoutUserInput = {
    where: PlayerChoiceWhereUniqueInput
    create: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput>
  }

  export type PlayerChoiceCreateManyUserInputEnvelope = {
    data: PlayerChoiceCreateManyUserInput | PlayerChoiceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type LevelUnlockUpsertWithWhereUniqueWithoutUserInput = {
    where: LevelUnlockWhereUniqueInput
    update: XOR<LevelUnlockUpdateWithoutUserInput, LevelUnlockUncheckedUpdateWithoutUserInput>
    create: XOR<LevelUnlockCreateWithoutUserInput, LevelUnlockUncheckedCreateWithoutUserInput>
  }

  export type LevelUnlockUpdateWithWhereUniqueWithoutUserInput = {
    where: LevelUnlockWhereUniqueInput
    data: XOR<LevelUnlockUpdateWithoutUserInput, LevelUnlockUncheckedUpdateWithoutUserInput>
  }

  export type LevelUnlockUpdateManyWithWhereWithoutUserInput = {
    where: LevelUnlockScalarWhereInput
    data: XOR<LevelUnlockUpdateManyMutationInput, LevelUnlockUncheckedUpdateManyWithoutUserInput>
  }

  export type LevelUnlockScalarWhereInput = {
    AND?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
    OR?: LevelUnlockScalarWhereInput[]
    NOT?: LevelUnlockScalarWhereInput | LevelUnlockScalarWhereInput[]
    id?: StringFilter<"LevelUnlock"> | string
    userId?: StringFilter<"LevelUnlock"> | string
    levelId?: StringFilter<"LevelUnlock"> | string
    unlockedAt?: DateTimeFilter<"LevelUnlock"> | Date | string
  }

  export type PlayerChoiceUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayerChoiceWhereUniqueInput
    update: XOR<PlayerChoiceUpdateWithoutUserInput, PlayerChoiceUncheckedUpdateWithoutUserInput>
    create: XOR<PlayerChoiceCreateWithoutUserInput, PlayerChoiceUncheckedCreateWithoutUserInput>
  }

  export type PlayerChoiceUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayerChoiceWhereUniqueInput
    data: XOR<PlayerChoiceUpdateWithoutUserInput, PlayerChoiceUncheckedUpdateWithoutUserInput>
  }

  export type PlayerChoiceUpdateManyWithWhereWithoutUserInput = {
    where: PlayerChoiceScalarWhereInput
    data: XOR<PlayerChoiceUpdateManyMutationInput, PlayerChoiceUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayerChoiceScalarWhereInput = {
    AND?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
    OR?: PlayerChoiceScalarWhereInput[]
    NOT?: PlayerChoiceScalarWhereInput | PlayerChoiceScalarWhereInput[]
    id?: StringFilter<"PlayerChoice"> | string
    userId?: StringFilter<"PlayerChoice"> | string
    levelId?: StringFilter<"PlayerChoice"> | string
    choiceKey?: StringFilter<"PlayerChoice"> | string
    choiceValue?: StringFilter<"PlayerChoice"> | string
    createdAt?: DateTimeFilter<"PlayerChoice"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerChoice"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    unlockedLevels?: LevelUnlockCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    unlockedLevels?: LevelUnlockUncheckedCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unlockedLevels?: LevelUnlockUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unlockedLevels?: LevelUnlockUncheckedUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LevelCreateWithoutPreviousLevelInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nextLevel?: LevelCreateNestedOneWithoutPreviousLevelInput
    unlockedBy?: LevelUnlockCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateWithoutPreviousLevelInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    nextLevelId?: string | null
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    unlockedBy?: LevelUnlockUncheckedCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelCreateOrConnectWithoutPreviousLevelInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutPreviousLevelInput, LevelUncheckedCreateWithoutPreviousLevelInput>
  }

  export type LevelCreateWithoutNextLevelInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    previousLevel?: LevelCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateWithoutNextLevelInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    previousLevel?: LevelUncheckedCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockUncheckedCreateNestedManyWithoutLevelInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelCreateOrConnectWithoutNextLevelInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
  }

  export type LevelUnlockCreateWithoutLevelInput = {
    id?: string
    unlockedAt?: Date | string
    user: UserCreateNestedOneWithoutUnlockedLevelsInput
  }

  export type LevelUnlockUncheckedCreateWithoutLevelInput = {
    id?: string
    userId: string
    unlockedAt?: Date | string
  }

  export type LevelUnlockCreateOrConnectWithoutLevelInput = {
    where: LevelUnlockWhereUniqueInput
    create: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput>
  }

  export type LevelUnlockCreateManyLevelInputEnvelope = {
    data: LevelUnlockCreateManyLevelInput | LevelUnlockCreateManyLevelInput[]
    skipDuplicates?: boolean
  }

  export type PlayerChoiceCreateWithoutLevelInput = {
    id?: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChoicesInput
  }

  export type PlayerChoiceUncheckedCreateWithoutLevelInput = {
    id?: string
    userId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerChoiceCreateOrConnectWithoutLevelInput = {
    where: PlayerChoiceWhereUniqueInput
    create: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput>
  }

  export type PlayerChoiceCreateManyLevelInputEnvelope = {
    data: PlayerChoiceCreateManyLevelInput | PlayerChoiceCreateManyLevelInput[]
    skipDuplicates?: boolean
  }

  export type LevelUpsertWithoutPreviousLevelInput = {
    update: XOR<LevelUpdateWithoutPreviousLevelInput, LevelUncheckedUpdateWithoutPreviousLevelInput>
    create: XOR<LevelCreateWithoutPreviousLevelInput, LevelUncheckedCreateWithoutPreviousLevelInput>
    where?: LevelWhereInput
  }

  export type LevelUpdateToOneWithWhereWithoutPreviousLevelInput = {
    where?: LevelWhereInput
    data: XOR<LevelUpdateWithoutPreviousLevelInput, LevelUncheckedUpdateWithoutPreviousLevelInput>
  }

  export type LevelUpdateWithoutPreviousLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextLevel?: LevelUpdateOneWithoutPreviousLevelNestedInput
    unlockedBy?: LevelUnlockUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateWithoutPreviousLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    nextLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unlockedBy?: LevelUnlockUncheckedUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type LevelUpsertWithoutNextLevelInput = {
    update: XOR<LevelUpdateWithoutNextLevelInput, LevelUncheckedUpdateWithoutNextLevelInput>
    create: XOR<LevelCreateWithoutNextLevelInput, LevelUncheckedCreateWithoutNextLevelInput>
    where?: LevelWhereInput
  }

  export type LevelUpdateToOneWithWhereWithoutNextLevelInput = {
    where?: LevelWhereInput
    data: XOR<LevelUpdateWithoutNextLevelInput, LevelUncheckedUpdateWithoutNextLevelInput>
  }

  export type LevelUpdateWithoutNextLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previousLevel?: LevelUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateWithoutNextLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previousLevel?: LevelUncheckedUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUncheckedUpdateManyWithoutLevelNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type LevelUnlockUpsertWithWhereUniqueWithoutLevelInput = {
    where: LevelUnlockWhereUniqueInput
    update: XOR<LevelUnlockUpdateWithoutLevelInput, LevelUnlockUncheckedUpdateWithoutLevelInput>
    create: XOR<LevelUnlockCreateWithoutLevelInput, LevelUnlockUncheckedCreateWithoutLevelInput>
  }

  export type LevelUnlockUpdateWithWhereUniqueWithoutLevelInput = {
    where: LevelUnlockWhereUniqueInput
    data: XOR<LevelUnlockUpdateWithoutLevelInput, LevelUnlockUncheckedUpdateWithoutLevelInput>
  }

  export type LevelUnlockUpdateManyWithWhereWithoutLevelInput = {
    where: LevelUnlockScalarWhereInput
    data: XOR<LevelUnlockUpdateManyMutationInput, LevelUnlockUncheckedUpdateManyWithoutLevelInput>
  }

  export type PlayerChoiceUpsertWithWhereUniqueWithoutLevelInput = {
    where: PlayerChoiceWhereUniqueInput
    update: XOR<PlayerChoiceUpdateWithoutLevelInput, PlayerChoiceUncheckedUpdateWithoutLevelInput>
    create: XOR<PlayerChoiceCreateWithoutLevelInput, PlayerChoiceUncheckedCreateWithoutLevelInput>
  }

  export type PlayerChoiceUpdateWithWhereUniqueWithoutLevelInput = {
    where: PlayerChoiceWhereUniqueInput
    data: XOR<PlayerChoiceUpdateWithoutLevelInput, PlayerChoiceUncheckedUpdateWithoutLevelInput>
  }

  export type PlayerChoiceUpdateManyWithWhereWithoutLevelInput = {
    where: PlayerChoiceScalarWhereInput
    data: XOR<PlayerChoiceUpdateManyMutationInput, PlayerChoiceUncheckedUpdateManyWithoutLevelInput>
  }

  export type UserCreateWithoutUnlockedLevelsInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUnlockedLevelsInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUnlockedLevelsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUnlockedLevelsInput, UserUncheckedCreateWithoutUnlockedLevelsInput>
  }

  export type LevelCreateWithoutUnlockedByInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nextLevel?: LevelCreateNestedOneWithoutPreviousLevelInput
    previousLevel?: LevelCreateNestedOneWithoutNextLevelInput
    choices?: PlayerChoiceCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateWithoutUnlockedByInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    nextLevelId?: string | null
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    previousLevel?: LevelUncheckedCreateNestedOneWithoutNextLevelInput
    choices?: PlayerChoiceUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelCreateOrConnectWithoutUnlockedByInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutUnlockedByInput, LevelUncheckedCreateWithoutUnlockedByInput>
  }

  export type UserUpsertWithoutUnlockedLevelsInput = {
    update: XOR<UserUpdateWithoutUnlockedLevelsInput, UserUncheckedUpdateWithoutUnlockedLevelsInput>
    create: XOR<UserCreateWithoutUnlockedLevelsInput, UserUncheckedCreateWithoutUnlockedLevelsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUnlockedLevelsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUnlockedLevelsInput, UserUncheckedUpdateWithoutUnlockedLevelsInput>
  }

  export type UserUpdateWithoutUnlockedLevelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUnlockedLevelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LevelUpsertWithoutUnlockedByInput = {
    update: XOR<LevelUpdateWithoutUnlockedByInput, LevelUncheckedUpdateWithoutUnlockedByInput>
    create: XOR<LevelCreateWithoutUnlockedByInput, LevelUncheckedCreateWithoutUnlockedByInput>
    where?: LevelWhereInput
  }

  export type LevelUpdateToOneWithWhereWithoutUnlockedByInput = {
    where?: LevelWhereInput
    data: XOR<LevelUpdateWithoutUnlockedByInput, LevelUncheckedUpdateWithoutUnlockedByInput>
  }

  export type LevelUpdateWithoutUnlockedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextLevel?: LevelUpdateOneWithoutPreviousLevelNestedInput
    previousLevel?: LevelUpdateOneWithoutNextLevelNestedInput
    choices?: PlayerChoiceUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateWithoutUnlockedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    nextLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previousLevel?: LevelUncheckedUpdateOneWithoutNextLevelNestedInput
    choices?: PlayerChoiceUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type UserCreateWithoutChoicesInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    unlockedLevels?: LevelUnlockCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChoicesInput = {
    id?: string
    username: string
    email?: string | null
    password: string
    score?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    unlockedLevels?: LevelUnlockUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChoicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChoicesInput, UserUncheckedCreateWithoutChoicesInput>
  }

  export type LevelCreateWithoutChoicesInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nextLevel?: LevelCreateNestedOneWithoutPreviousLevelInput
    previousLevel?: LevelCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateWithoutChoicesInput = {
    id: string
    name: string
    description?: string | null
    videoUrl?: string | null
    audioUrl?: string | null
    unlockCode: string
    scoreReward?: number
    nextLevelId?: string | null
    sequence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    previousLevel?: LevelUncheckedCreateNestedOneWithoutNextLevelInput
    unlockedBy?: LevelUnlockUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelCreateOrConnectWithoutChoicesInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutChoicesInput, LevelUncheckedCreateWithoutChoicesInput>
  }

  export type UserUpsertWithoutChoicesInput = {
    update: XOR<UserUpdateWithoutChoicesInput, UserUncheckedUpdateWithoutChoicesInput>
    create: XOR<UserCreateWithoutChoicesInput, UserUncheckedCreateWithoutChoicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChoicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChoicesInput, UserUncheckedUpdateWithoutChoicesInput>
  }

  export type UserUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    unlockedLevels?: LevelUnlockUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    unlockedLevels?: LevelUnlockUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LevelUpsertWithoutChoicesInput = {
    update: XOR<LevelUpdateWithoutChoicesInput, LevelUncheckedUpdateWithoutChoicesInput>
    create: XOR<LevelCreateWithoutChoicesInput, LevelUncheckedCreateWithoutChoicesInput>
    where?: LevelWhereInput
  }

  export type LevelUpdateToOneWithWhereWithoutChoicesInput = {
    where?: LevelWhereInput
    data: XOR<LevelUpdateWithoutChoicesInput, LevelUncheckedUpdateWithoutChoicesInput>
  }

  export type LevelUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nextLevel?: LevelUpdateOneWithoutPreviousLevelNestedInput
    previousLevel?: LevelUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    unlockCode?: StringFieldUpdateOperationsInput | string
    scoreReward?: IntFieldUpdateOperationsInput | number
    nextLevelId?: NullableStringFieldUpdateOperationsInput | string | null
    sequence?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    previousLevel?: LevelUncheckedUpdateOneWithoutNextLevelNestedInput
    unlockedBy?: LevelUnlockUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type LevelUnlockCreateManyUserInput = {
    id?: string
    levelId: string
    unlockedAt?: Date | string
  }

  export type PlayerChoiceCreateManyUserInput = {
    id?: string
    levelId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    level?: LevelUpdateOneRequiredWithoutUnlockedByNestedInput
  }

  export type LevelUnlockUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    level?: LevelUpdateOneRequiredWithoutChoicesNestedInput
  }

  export type PlayerChoiceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    levelId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockCreateManyLevelInput = {
    id?: string
    userId: string
    unlockedAt?: Date | string
  }

  export type PlayerChoiceCreateManyLevelInput = {
    id?: string
    userId: string
    choiceKey: string
    choiceValue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LevelUnlockUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUnlockedLevelsNestedInput
  }

  export type LevelUnlockUncheckedUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelUnlockUncheckedUpdateManyWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChoicesNestedInput
  }

  export type PlayerChoiceUncheckedUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerChoiceUncheckedUpdateManyWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choiceKey?: StringFieldUpdateOperationsInput | string
    choiceValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}