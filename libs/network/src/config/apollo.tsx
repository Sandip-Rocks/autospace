'use client'
import {
  ApolloClient,
  ApolloProvider as Provider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import { ReactNode } from 'react'

export interface IApolloProviderProps {
  children: ReactNode
}

export const ApolloProvider = ({ children }: IApolloProviderProps) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  })
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })
  return <Provider client={client}>{children}</Provider>
}
