import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [changeAuthor] = useMutation(EDIT_AUTHOR)

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            born <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
