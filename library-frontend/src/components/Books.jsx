import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  const allGenres = new Set()

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
      <div>in genre: {genre}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books
            .filter(b => genre !== 'all genres' ? b.genres.includes(genre) : b)
            .map((b) => (
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
        <button onClick={() => setGenre('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
