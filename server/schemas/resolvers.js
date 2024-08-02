const { User, Product, Category, Order } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },
        products: async (parent, { id, category, name, searchTerm, user }) => {
            let filter = {};
        
            if (id) { 
                console.log('product id -----', id);
                const product = await Product.findById(id).populate('category');
                if (!product) {
                    console.error(`Product with ID ${id} not found`);
                    throw new Error('Product not found');
                }
                return product ? [product] : [];
            }
        
            if (category) { filter.category = category; }
        
            if (name) { filter.name = { $regex: name, $options: 'i' }; }
        
            if (searchTerm) {
                filter.$or = [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ];
            }
        
            if (user) { filter.user = user; }
        
            return await Product.find(filter).populate('category');
        },
        product: async (parent, { _id }) => {
            try {
                console.log('product id', _id);
                const product = await Product.findById(_id).populate('category');
                if (!product) {
                    console.error(`Product with ID ${_id} not found`);
                    throw new Error('Product not found');
                }
                return product;
            } catch (error) {
                console.error(`Error fetching product with ID ${_id}:`, error);
                throw new Error('Error fetching product');
            }
        },
        user: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate({
                    path: 'orders.products',
                    populate: 'category'
                });

                user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
                console.log('user', user);
                const products = await Product.find({ user: context.user._id }).populate('category');

                return {
                    ...user.toObject(),
                    products
                };
            }

            throw new AuthenticationError('Not authenticated');
        },
        order: async (parent, { _id }, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate({
                    path: 'orders.products',
                    populate: 'category'
                });

                return user.orders.id(_id);
            }

            throw AuthenticationError;
        },
        checkout: async (parent, args, context) => {
            const url = new URL(context.headers.referer).origin;
            const order = new Order({ products: args.products });
            const line_items = [];

            const { products } = await order.populate('products');

            for (let i = 0; i < products.length; i++) {
                const product = await stripe.products.create({
                    name: products[i].name,
                    description: products[i].description,
                    images: [`${url}/images/${products[i].image}`]
                });

                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: products[i].price * 100,
                    currency: 'usd',
                });

                line_items.push({
                    price: price.id,
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${url}/`
            });

            return { session: session.id };
        },
        
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        addProduct: async (parent, args, context) => {
            if (context.user) {
                try {
                    const product = await Product.create({
                        ...args,
                        user: context.user._id,
                    });
                    return product;
                } catch (error) {
                    throw new Error('Error adding product: ' + error.message);
                }
            }
            throw new AuthenticationError('Not logged in');
        },
        addOrder: async (parent, { products }, context) => {
            if (context.user) {
                const order = new Order({ products });

                await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

                return order;
            }

            throw AuthenticationError;
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }

            throw AuthenticationError;
        },
        updateProduct: async (parent, args, context) => {
            const updatedProduct = await Product.findByIdAndUpdate(
                args._id,
                { $set: args },
                { new: true }
            );
            return updatedProduct
            // if (context.user) {
            //     try {
            //         const updatedProduct = await Product.findByIdAndUpdate(
            //             args._id,
            //             { $set: args },
            //             { new: true }
            //         );
            //         return updatedProduct;
            //     } catch (error) {
            //         throw new Error('Error updating product: ' + error.message);
            //     }
            // }
            // throw new AuthenticationError;
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;
