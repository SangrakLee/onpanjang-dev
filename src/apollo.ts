// src/apollo.ts
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export const apolloClient = new ApolloClient({
  uri: 'https://wrcknousitrwfkukdgmr.supabase.co/graphql/v1', // ✅ 너의 GraphQL endpoint
  headers: {
    apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2tub3VzaXRyd2ZrdWtkZ21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzIyNDksImV4cCI6MjA1ODc0ODI0OX0.tb66Aw7mJ5AyTzNuqFMw5ohQDUSTPlyDRIIPnPh5eYE', // ✅ Supabase에서 복사한 anon 키
  },
  cache: new InMemoryCache(),
})
