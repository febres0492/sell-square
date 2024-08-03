const typeDefs = `
    type Category {
        _id: ID
        name: String
    }

    type Product {
        _id: ID
        user: User
        name: String
        description: String
        image: String
        quantity: Int
        price: Float
        category: Category
        zipcode: String
    }

    type Order {
        _id: ID
        purchaseDate: String
        products: [Product]
    }

    type User {
        _id: ID
        firstName: String
        lastName: String
        email: String
        orders: [Order]
        products: [Product]
        conversations: [Conversation]
    }

    type Message {
        text: String
        senderId: ID
        receiverId: ID
        createdAt: String
    }

    type Conversation {
        _id: ID!
        productId: Product!
        participants: [User]
        messages: [Message]
    }

    type Checkout { session: ID }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        categories: [Category]
        products(
            category: ID, 
            name: String, 
            searchTerm: String, 
            user: ID,
            getUserProducts: Boolean
        ): [Product]
        product(_id: ID!): Product
        user: User
        order(_id: ID!): Order
        checkout(products: [ID]!): Checkout
        userConversations: [Conversation]
    }

    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
        addOrder(products: [ID]!): Order
        updateUser(firstName: String, lastName: String, email: String, password: String): User
        updateProduct(
            _id: ID!, 
            name: String,
            description: String,
            image: String,
            quantity: Int,
            price: Float,
            category: ID,
            zipcode: Int
        ): Product
        login(email: String!, password: String!): Auth
        addProduct(
            name: String!,
            description: String!,
            image: String,
            quantity: Int!,
            price: Float!,
            category: ID!,
            zipcode: String!
        ): Product
        sendMessage(senderId: ID! receiverId: ID!, content: String!, productId: ID!): Conversation
        createConversation(productId: ID!, messages: [MessageInput!]!): Conversation
    }

    input MessageInput {
        text: String!
        senderId: ID!
        receiverId: ID!
    }
`;

module.exports = typeDefs;