import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS } from './queries'

const App = () => {
  const result = useQuery(ALL_AUTHORS)
  const [page, setPage] = useState('authors')

  if (result.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Authors authors={result.data.allAuthors} show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
