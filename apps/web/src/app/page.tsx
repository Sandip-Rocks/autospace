'use client'
import { add } from '@parkpro/sample-lib'
import { useQuery } from '@apollo/client'
import { CompaniesDocument } from '@parkpro/network/src/gql/generated'

export default function Home() {
  const { data, loading } = useQuery(CompaniesDocument)

  return (
    <main>
      Hello {add(2, 2)}
      <div>{data?.companies.map((c) => c.displayName)}</div>
    </main>
  )
}
