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
        _id: ID!
        text: String!
        createdAt: String!
        receiverId: ID!
        conversationId: ID!
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
        conversation(_id: ID, userId: ID, productId: ID, participantId: ID): [Conversation]
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
        sendMessage(receiverId: ID!, content: String!, productId: ID!): Message
    }
`;

module.exports = typeDefs;