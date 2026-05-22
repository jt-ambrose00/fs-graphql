const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { v4: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: String!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    # addAuthor(
    #   name: String!
    #   born: Int
    # ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let foundBooks = books
      if (args.author) {
        foundBooks = foundBooks.filter((book) => book.author === args.author)
      }
      if (args.genre) {
        foundBooks = foundBooks.filter((book) => book.genres.includes(args.genre))
      }
      return foundBooks
    },
    allAuthors: () => authors,
  },

  Author: {
    bookCount: ( { name }) => {
      return books.reduce((acc, book) => 
        (book.author === name ? acc + 1 : acc), 0
      )
    }
  },

  Mutation: {
    addBook: (root, args) => {
      if (books.find(book => book.title === args.title)) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const book = { ...args, id: uuid() }
      books = books.concat(book)

      if (!authors.find(author => author.name === args.author)) {
        const author = { name: args.author, id: uuid() }
        authors = authors.concat(author)
      }

      return book
    },

    // addAuthor: (root, args) => {
    //   const author = { ...args, id: uuid() }
    //   authors = authors.concat(author)
    //   return author
    // },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

// Implement mutation addBook, which can be used like this:

// mutation {
//   addBook(
//     title: "NoSQL Distilled",
//     author: "Martin Fowler",
//     published: 2012,
//     genres: ["database", "nosql"]
//   ) {
//     title,
//     author
//   }
// }

// The mutation works even if the author is not already saved to the server:

// mutation {
//   addBook(
//     title: "Pimeyden tango",
//     author: "Reijo Mäki",
//     published: 1997,
//     genres: ["crime"]
//   ) {
//     title,
//     author
//   }
// }

// If the author is not yet saved to the server, a new author is added to the system. The birth years of authors are not saved to the server yet, so the query

// query {
//   allAuthors {
//     name
//     born
//     bookCount
//   }
// }

// returns

// {
//   "data": {
//     "allAuthors": [
//       // ...
//       {
//         "name": "Reijo Mäki",
//         "born": null,
//         "bookCount": 1
//       }
//     ]
//   }
// }