import { gql } from '@apollo/client';

// to add new query define one here, 
// and add the method to the resolver.js in the schemas folder in the server.js file
// add the query to the type Query obj in the typeDefs.js file in the server.js file

export const QUERY_PRODUCTS = gql`
    query getProducts($category: ID) {
        products(category: $category) {
            _id
            name
            description
            price
            quantity
            image
            category {
                _id
            }
        }
    }
`;

export const QUERY_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(_id: $id) {
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
        }
    }
`;

export const QUERY_PRODUCT_BY_ID = gql`
    query getProductById($id: ID!) {
        product(id: $id) {
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
            _id
            name
            description
            price
            quantity
            image
            category {
                _id
                name
            }
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
            firstName
            lastName
            orders {
                _id
                purchaseDate
                products {
                    _id
                    name
                    description
                    price
                    quantity
                    image
                }
            }
        }
    }
`;

export const QUERY_PRODUCTS_BY_SEARCH_TERM = gql`
    query getProductsBySearchTerm($searchTerm: String!) {
        products(searchTerm: $searchTerm) {
            _id
            name
            description
            price
            quantity
            image
            category {
                _id
                name
            }
        }
    }
`;

