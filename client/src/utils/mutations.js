import { gql } from '@apollo/client';

const keys = `
    _id
    name
    description
    price
    quantity
    image
    zipcode
    category {
        _id
        name
    }
`

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
            }
        }
    }
`;

export const ADD_ORDER = gql`
    mutation addOrder($products: [ID]!) {
        addOrder(products: $products) {
            purchaseDate
            products {
                _id
                name
                description
                price
                quantity
                category {
                    name
                }
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
    ) {
        addUser(
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
        ) {
            token
            user {
                _id
            }
        }
    }
`;

export const ADD_PRODUCT = gql`
    mutation addProduct(
        $name: String!
        $description: String!
        $price: Float!
        $quantity: Int!
        $category: ID!
        $zipcode: String!
        $image: String!
    ) {
        addProduct(
            name: $name
            description: $description
            price: $price
            quantity: $quantity
            category: $category
            zipcode: $zipcode
            image: $image
        ) {
            ${keys}
        }
    }
`;


export const UPDATE_PRODUCT = gql`
    mutation updateProduct(
        $id: ID!
        $name: String
        $description: String
        $price: Float
        $quantity: Int
        $category: ID
        $zipcode: Int
        $image: String
    ) {
        updateProduct(
            _id: $id
            name: $name
            description: $description
            price: $price
            quantity: $quantity
            category: $category
            zipcode: $zipcode
            image: $image
        ) {
            ${keys}
        }
    }
`;

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(_id: $id) { 
            _id 
            name
            description
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation SendMessage($receiverId: ID!, $productId: ID!, $content: String!) {
        sendMessage(receiverId: $receiverId, productId: $productId, content: $content) {
            _id
            text
            receiverId
            createdAt
            conversationId
        }
    }
`;

