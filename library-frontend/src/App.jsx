import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client/react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import Notify from './components/Notify'
import { ALL_AUTHORS, ALL_BOOKS, GET_USER, BOOK_ADDED } from './queries'
import { addBookToCache } from './utils/apolloCache'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(GET_USER, { skip: !token })
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      alert(`${addedBook.title} added`)
      addBookToCache(client.cache, addedBook)
    },
  })

  if (authors.loading) {
    return <div>Loading...</div>
  }
  if (books.loading) {
    return <div>Loading...</div>
  }
  if (user.loading) {
    return <div>Loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommendations')}>recommendations</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={onLogout}>logout</button>}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors authors={authors.data.allAuthors} token={token} show={page === 'authors'} />
      <Books books={books.data.allBooks} show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommendations books={books.data.allBooks} user={user.data?.me} show={page === 'recommendations'} />
      <LoginForm setToken={setToken} setPage={setPage} setError={notify} show={page === 'login'} />
    </div>
  )
}

export default App
