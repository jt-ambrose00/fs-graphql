import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_BOOK_BY_GENRE } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const allGenres = new Set()

  const booksByGenre = useQuery(GET_BOOK_BY_GENRE, {
    variables: { genre: genre }
  })

  props.books.forEach(b => {
    b.genres.forEach(g => {
      allGenres.add(g)
    })
  })

  const genres = [...allGenres]

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <div>in genre: {genre ? genre : 'all genres'}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.data?.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div>
        {genres.map(g =>
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        )}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
