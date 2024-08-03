import { gql } from '@apollo/client';

// to add new query define one here, 
// and add the method to the resolver.js in the schemas folder in the server.js file
// add the query to the type Query obj in the typeDefs.js file in the server.js file

const keys = `
    _id
    name
    description
    price
    quantity
    image
    zipcode
    user {
        _id
        firstName
        lastName
        email
    }
    category {
        _id
        name
    }
`

export const QUERY_PRODUCTS = gql`
    query getProducts($category: ID) {
        products(category: $category) {
            ${keys}
        }
    }
`;

export const QUERY_PRODUCT_BY_ID = gql`
     query getProduct($id: ID!) {
        product(_id: $id) {
            ${keys}
            user {
                _id
                firstName
                lastName
                email
            }
        }
    }
`;

export const QUERY_USER_PRODUCTS = gql`
    query Products {
        products(getUserProducts: true) {
            _id
            name
            description
            image
            quantity
            price
            category {
                _id
                name
            }
            zipcode
        }
    }
`;

export const QUERY_CHECKOUT = gql`
    query getCheckout($products: [ID]!) {
        checkout(products: $products) {
            session 
        }
    }
`;

export const QUERY_ALL_PRODUCTS = gql`
    { 
        products { 
            ${keys}
        } 
    }
`;

export const QUERY_CATEGORIES = gql`
    {
        categories {
            _id
            name
        }
    }
`;

export const QUERY_USER = gql`
    {
        user {
            _id
            firstName
            lastName
            email
            products { ${keys} }
        }
    }
`;

export const QUERY_USER_CONVERSATIONS = gql`
    query UserConversations {
        userConversations {
            _id
            productId {
                _id
                user {
                    _id
                    firstName
                    lastName
                    email
                }
            }
            participants {
                _id
                firstName
                lastName
                email
            }
            messages {
                text
                senderId
                receiverId
                createdAt
            }
        }
    }   
`;
// export const QUERY_USER_CONVERSATIONS = gql`
//     query User {
//         user {
//             _id
//             firstName
//             conversations {
//                 _id
//                 productId {
//                     _id
//                     name
//                     description
//                     image
//                     quantity
//                     price
//                     zipcode
//                 }
//                 participants {
//                     firstName
//                     lastName
//                     email
//                 }
//                 messages {
//                     text
//                     senderId
//                     receiverId
//                     createdAt
//                 }
//             }
//         }
//     }
// `;

export const QUERY_PRODUCTS_BY_SEARCH_TERM = gql`
    query getProductsBySearchTerm($searchTerm: String!) {
        products(searchTerm: $searchTerm) {
            ${keys}
        }
    }
`;

