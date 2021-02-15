import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  /** Query to get user by address */
  user?: Maybe<User>;
  venus?: Maybe<Venus>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryVenusArgs = {
  address: Scalars['ID'];
};

/** User is a someone who hold the wallet */
export type User = {
  __typename?: 'User';
  /** User's wallet address */
  id: Scalars['ID'];
  balances?: Maybe<Array<Maybe<Currency>>>;
};

export type Token = {
  /** Token's address */
  id: Scalars['ID'];
  /** Token's address */
  address: Scalars['String'];
  /** Token's name e.g. Ethereum, Pancake */
  name: Scalars['String'];
  /** Token's symbol e.g. ETH, BNB, CAKE */
  symbol: Scalars['String'];
  /** Token's decimal */
  decimals: Scalars['Int'];
  /** Token's logo */
  logoURI?: Maybe<Scalars['String']>;
};

/** Currency is a token that user have with can be Native or ERC20 */
export type Currency = Token & {
  __typename?: 'Currency';
  /** Currency's address */
  id: Scalars['ID'];
  /** Currency's address */
  address: Scalars['String'];
  /** Currency's name e.g. Ethereum, Pancake */
  name: Scalars['String'];
  /** Currency's symbol e.g. ETH, BNB, CAKE */
  symbol: Scalars['String'];
  /** Currency's decimal */
  decimals: Scalars['Int'];
  /** Currency's price per token */
  price?: Maybe<Scalars['String']>;
  /** Amount of token that user have */
  value: Scalars['String'];
  /** Currency's type 'ERC20' */
  tokenType?: Maybe<Scalars['String']>;
  /** Currency's logo */
  logoURI?: Maybe<Scalars['String']>;
};

export type VenusToken = Token & {
  __typename?: 'VenusToken';
  id: Scalars['ID'];
  address: Scalars['String'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  decimals: Scalars['Int'];
  price: Scalars['String'];
  /** Amount of token that user have */
  suppliedAmount?: Maybe<Scalars['String']>;
  borrowedAmount?: Maybe<Scalars['String']>;
  logoURI?: Maybe<Scalars['String']>;
  isCollateral?: Maybe<Scalars['Boolean']>;
  underlyingAddress?: Maybe<Scalars['String']>;
  underlyingName?: Maybe<Scalars['String']>;
  underlyingSymbol?: Maybe<Scalars['String']>;
  borrowApy?: Maybe<Scalars['String']>;
  borrowVenusApy?: Maybe<Scalars['String']>;
  supplyApy?: Maybe<Scalars['String']>;
  supplyVenusApy?: Maybe<Scalars['String']>;
};

export type Venus = {
  __typename?: 'Venus';
  userAddress: Scalars['ID'];
  totalSupplyBalance: Scalars['String'];
  totalBorrowBalance: Scalars['String'];
  vaiMintedAmount: Scalars['String'];
  suppliedTokens: Array<VenusToken>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  User: ResolverTypeWrapper<User>;
  Token: ResolversTypes['Currency'] | ResolversTypes['VenusToken'];
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Currency: ResolverTypeWrapper<Currency>;
  VenusToken: ResolverTypeWrapper<VenusToken>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Venus: ResolverTypeWrapper<Venus>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  ID: Scalars['ID'];
  User: User;
  Token: ResolversParentTypes['Currency'] | ResolversParentTypes['VenusToken'];
  String: Scalars['String'];
  Int: Scalars['Int'];
  Currency: Currency;
  VenusToken: VenusToken;
  Boolean: Scalars['Boolean'];
  Venus: Venus;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  venus?: Resolver<Maybe<ResolversTypes['Venus']>, ParentType, ContextType, RequireFields<QueryVenusArgs, 'address'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  balances?: Resolver<Maybe<Array<Maybe<ResolversTypes['Currency']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Currency' | 'VenusToken', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  logoURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type CurrencyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Currency'] = ResolversParentTypes['Currency']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VenusTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['VenusToken'] = ResolversParentTypes['VenusToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  suppliedAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  borrowedAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isCollateral?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  underlyingAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  underlyingName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  underlyingSymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  borrowApy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  borrowVenusApy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supplyApy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supplyVenusApy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VenusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Venus'] = ResolversParentTypes['Venus']> = ResolversObject<{
  userAddress?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalSupplyBalance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalBorrowBalance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vaiMintedAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  suppliedTokens?: Resolver<Array<ResolversTypes['VenusToken']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Currency?: CurrencyResolvers<ContextType>;
  VenusToken?: VenusTokenResolvers<ContextType>;
  Venus?: VenusResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
