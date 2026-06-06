const Recommendations = (props) => {
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre:&nbsp;
        <span>{props.user.favoriteGenre}</span>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books
            .filter(b => b.genres.includes(props.user.favoriteGenre))
            .map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
