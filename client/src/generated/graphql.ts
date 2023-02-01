import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type BooleanResponse = {
  __typename?: 'BooleanResponse';
  errors?: Maybe<Array<FieldErrors>>;
  isHappen?: Maybe<Scalars['Boolean']>;
};

export type Comment = {
  __typename?: 'Comment';
  children?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  likes?: Maybe<Array<Likes>>;
  message: Scalars['String'];
  parent?: Maybe<Comment>;
  parentId?: Maybe<Scalars['String']>;
  post?: Maybe<Post>;
  postId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type CommentModify = {
  commentId: Scalars['String'];
  msg: Scalars['String'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  comments?: Maybe<Comment>;
  errors?: Maybe<Array<FieldErrors>>;
};

export type CommentsInputs = {
  message: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
  postId: Scalars['String'];
};

export type FieldErrors = {
  __typename?: 'FieldErrors';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Likes = {
  __typename?: 'Likes';
  comment?: Maybe<Comment>;
  commentId: Scalars['String'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeLikeOnComment: BooleanResponse;
  changePoints: PointResponse;
  createComment: CommentResponse;
  createPost: PostResponse;
  deleteComment: BooleanResponse;
  deletePost: BooleanResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  signup: UserResponse;
  updateComment: BooleanResponse;
  updatePost: BooleanResponse;
};


export type MutationChangeLikeOnCommentArgs = {
  commentId: Scalars['String'];
};


export type MutationChangePointsArgs = {
  options: PointInput;
};


export type MutationCreateCommentArgs = {
  options: CommentsInputs;
};


export type MutationCreatePostArgs = {
  options: PostInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UserLoginInput;
};


export type MutationSignupArgs = {
  options: UserInput;
};


export type MutationUpdateCommentArgs = {
  options: CommentModify;
};


export type MutationUpdatePostArgs = {
  options: UpdatePostInput;
};

export type PointInput = {
  postId: Scalars['String'];
  updatePointToThis: Scalars['Int'];
  userId: Scalars['String'];
};

export type PointResponse = {
  __typename?: 'PointResponse';
  errors?: Maybe<Array<FieldErrors>>;
  point?: Maybe<Scalars['Int']>;
};

export type Points = {
  __typename?: 'Points';
  point: Scalars['Int'];
  post?: Maybe<Post>;
  postId: Scalars['String'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String'];
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  points?: Maybe<Array<Points>>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type PostInput = {
  body: Scalars['String'];
  title: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldErrors>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  me: UserResponse;
  post: Post;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};

export type UpdatePostInput = {
  body: Scalars['String'];
  postId: Scalars['String'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  likes?: Maybe<Array<Likes>>;
  points?: Maybe<Array<Points>>;
  post?: Maybe<Array<Post>>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserLoginInput = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldErrors>>;
  user?: Maybe<User>;
};

export type CommentDataFragment = { __typename?: 'Comment', id: string, createdAt: any, message: string, parentId?: string | null, likes?: Array<{ __typename?: 'Likes', userId: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null };

export type ErrorFragment = { __typename?: 'FieldErrors', message: string, field: string };

export type PostDataFragment = { __typename?: 'Post', id: string, body: string, title: string, createdAt: any, user?: { __typename?: 'User', username: string, id: string } | null };

export type UserDataFragment = { __typename?: 'User', id: string, username: string, email: string };

export type CreateCommentMutationVariables = Exact<{
  options: CommentsInputs;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null, comments?: { __typename?: 'Comment', id: string, createdAt: any, message: string, parentId?: string | null, likes?: Array<{ __typename?: 'Likes', userId: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } | null } };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['String'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'BooleanResponse', isHappen?: boolean | null, errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null } };

export type LoginMutationVariables = Exact<{
  options: UserLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null, user?: { __typename?: 'User', id: string, username: string, email: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SignupMutationVariables = Exact<{
  options: UserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null, user?: { __typename?: 'User', id: string, username: string, email: string } | null } };

export type ToggleLikeOnCommentMutationVariables = Exact<{
  commentId: Scalars['String'];
}>;


export type ToggleLikeOnCommentMutation = { __typename?: 'Mutation', changeLikeOnComment: { __typename?: 'BooleanResponse', isHappen?: boolean | null, errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null } };

export type UpdateCommentMutationVariables = Exact<{
  options: CommentModify;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'BooleanResponse', isHappen?: boolean | null, errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldErrors', message: string, field: string }> | null, user?: { __typename?: 'User', id: string, username: string, email: string } | null } };

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', id: string, body: string, title: string, createdAt: any, comments?: Array<{ __typename?: 'Comment', id: string, createdAt: any, message: string, parentId?: string | null, likes?: Array<{ __typename?: 'Likes', userId: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null }> | null, user?: { __typename?: 'User', username: string, id: string } | null } };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string, body: string, title: string, createdAt: any, comments?: Array<{ __typename?: 'Comment', id: string }> | null, user?: { __typename?: 'User', username: string, id: string } | null }> };

export const CommentDataFragmentDoc = `
    fragment commentData on Comment {
  id
  createdAt
  message
  parentId
  likes {
    userId
  }
  user {
    id
    username
  }
}
    `;
export const ErrorFragmentDoc = `
    fragment error on FieldErrors {
  message
  field
}
    `;
export const PostDataFragmentDoc = `
    fragment postData on Post {
  id
  body
  title
  createdAt
  user {
    username
    id
  }
}
    `;
export const UserDataFragmentDoc = `
    fragment userData on User {
  id
  username
  email
}
    `;
export const CreateCommentDocument = `
    mutation createComment($options: CommentsInputs!) {
  createComment(options: $options) {
    errors {
      ...error
    }
    comments {
      ...commentData
    }
  }
}
    ${ErrorFragmentDoc}
${CommentDataFragmentDoc}`;
export const useCreateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>(
      ['createComment'],
      (variables?: CreateCommentMutationVariables) => fetcher<CreateCommentMutation, CreateCommentMutationVariables>(client, CreateCommentDocument, variables, headers)(),
      options
    );
export const DeleteCommentDocument = `
    mutation deleteComment($commentId: String!) {
  deleteComment(commentId: $commentId) {
    errors {
      ...error
    }
    isHappen
  }
}
    ${ErrorFragmentDoc}`;
export const useDeleteCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>(
      ['deleteComment'],
      (variables?: DeleteCommentMutationVariables) => fetcher<DeleteCommentMutation, DeleteCommentMutationVariables>(client, DeleteCommentDocument, variables, headers)(),
      options
    );
export const LoginDocument = `
    mutation login($options: UserLoginInput!) {
  login(options: $options) {
    errors {
      ...error
    }
    user {
      ...userData
    }
  }
}
    ${ErrorFragmentDoc}
${UserDataFragmentDoc}`;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      ['login'],
      (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers)(),
      options
    );
export const LogoutDocument = `
    mutation logout {
  logout
}
    `;
export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      ['logout'],
      (variables?: LogoutMutationVariables) => fetcher<LogoutMutation, LogoutMutationVariables>(client, LogoutDocument, variables, headers)(),
      options
    );
export const SignupDocument = `
    mutation signup($options: UserInput!) {
  signup(options: $options) {
    errors {
      ...error
    }
    user {
      ...userData
    }
  }
}
    ${ErrorFragmentDoc}
${UserDataFragmentDoc}`;
export const useSignupMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<SignupMutation, TError, SignupMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<SignupMutation, TError, SignupMutationVariables, TContext>(
      ['signup'],
      (variables?: SignupMutationVariables) => fetcher<SignupMutation, SignupMutationVariables>(client, SignupDocument, variables, headers)(),
      options
    );
export const ToggleLikeOnCommentDocument = `
    mutation toggleLikeOnComment($commentId: String!) {
  changeLikeOnComment(commentId: $commentId) {
    errors {
      ...error
    }
    isHappen
  }
}
    ${ErrorFragmentDoc}`;
export const useToggleLikeOnCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<ToggleLikeOnCommentMutation, TError, ToggleLikeOnCommentMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<ToggleLikeOnCommentMutation, TError, ToggleLikeOnCommentMutationVariables, TContext>(
      ['toggleLikeOnComment'],
      (variables?: ToggleLikeOnCommentMutationVariables) => fetcher<ToggleLikeOnCommentMutation, ToggleLikeOnCommentMutationVariables>(client, ToggleLikeOnCommentDocument, variables, headers)(),
      options
    );
export const UpdateCommentDocument = `
    mutation updateComment($options: CommentModify!) {
  updateComment(options: $options) {
    errors {
      ...error
    }
    isHappen
  }
}
    ${ErrorFragmentDoc}`;
export const useUpdateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateCommentMutation, TError, UpdateCommentMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateCommentMutation, TError, UpdateCommentMutationVariables, TContext>(
      ['updateComment'],
      (variables?: UpdateCommentMutationVariables) => fetcher<UpdateCommentMutation, UpdateCommentMutationVariables>(client, UpdateCommentDocument, variables, headers)(),
      options
    );
export const MeDocument = `
    query me {
  me {
    errors {
      ...error
    }
    user {
      ...userData
    }
  }
}
    ${ErrorFragmentDoc}
${UserDataFragmentDoc}`;
export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: MeQueryVariables,
      options?: UseQueryOptions<MeQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<MeQuery, TError, TData>(
      variables === undefined ? ['me'] : ['me', variables],
      fetcher<MeQuery, MeQueryVariables>(client, MeDocument, variables, headers),
      options
    );
export const PostDocument = `
    query post($id: String!) {
  post(id: $id) {
    comments {
      ...commentData
    }
    ...postData
  }
}
    ${CommentDataFragmentDoc}
${PostDataFragmentDoc}`;
export const usePostQuery = <
      TData = PostQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: PostQueryVariables,
      options?: UseQueryOptions<PostQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<PostQuery, TError, TData>(
      ['post', variables],
      fetcher<PostQuery, PostQueryVariables>(client, PostDocument, variables, headers),
      options
    );
export const PostsDocument = `
    query posts {
  posts {
    ...postData
    comments {
      id
    }
  }
}
    ${PostDataFragmentDoc}`;
export const usePostsQuery = <
      TData = PostsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: PostsQueryVariables,
      options?: UseQueryOptions<PostsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<PostsQuery, TError, TData>(
      variables === undefined ? ['posts'] : ['posts', variables],
      fetcher<PostsQuery, PostsQueryVariables>(client, PostsDocument, variables, headers),
      options
    );