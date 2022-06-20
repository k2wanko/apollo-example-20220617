// @ts-check
const {
    ApolloServer,
    gql
} = require('apollo-server');

const typeDefs = gql `

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type BooksResponse {
      items: [Book]
      total: Int
  }

  type Query {
    books: BooksResponse
  }
`;

const books = [{
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

/**
 * 
 * @param {number} ms 
 * @returns 
 */
const sleep = (ms) => new Promise(resolve => {
    setTimeout(resolve, ms)
})

/**
 * 重たい処理を想定
 */
async function getBookCount() {
    console.log('@@@getBookCount', 'call')
    await sleep(5000);
    return books.length
}

const resolvers = {
    Query: {
        books: (parent, args, context, info) => {
            return {
                items: books,
                /**
                 * Promiseを返すことで、Requestに含まれていなければ計算されない
                 */
                total: getBookCount
            };
        },
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
});

// The `listen` method launches a web server.
server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});