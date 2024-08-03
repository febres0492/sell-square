const { User, Product, Category, Order, Conversation } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

const resolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },
        products: async (parent, args, context) => {
            let filter = {};
        
            if (args.id) { 
                console.log('product args.id -----', args.id);
                const product = await Product.findById(args.id).populate('category');
                if (!product) {
                    console.error(`Product with ID ${id} not found`);
                    throw new Error('Product not found');
                }
                return product ? [product] : [];
            }
        
            if (args.category) { filter.category = args.category; }
        
            if (args.name) { filter.name = { $regex: args.name, $options: 'i' }; }
        
            if (args.searchTerm) {
                filter.$or = [
                    { name: { $regex: args.searchTerm, $options: 'i' } },
                    { description: { $regex: args.searchTerm, $options: 'i' } }
                ];
            }
        
            if (args.user) { 
                console.log(c.red,'products', user);
                filter.user = args.user;
            }

            if(args.getUserProducts){
                console.log(c.red,'getUserProducts', context.user);
                filter.user = context.user._id;
            }
        
            return await Product.find(filter).populate('category').populate('user');
        },
        product: async (parent, { _id }) => {
            try {
                console.log('product id', _id);
                const product = await Product.findById(_id)
                    .populate('category')
                    .populate('user');
                    
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
            console.log('user', context.user?.firstName, args);
            if (!context.user) { return {message: 'no user found'} }
        
            const user = await User.findById(context.user._id).populate({
                path: 'orders.products',
                populate: 'category'
            });
                
            const products = await Product.find({ user: context.user._id }).populate('category');
            // const conversations = await Conversation.find({ participants: context.user._id })

            // console.log(c.yellow,'conversations', conversations);
        
            return {
                ...user.toObject(),
                products,
                // conversations
            };
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
        userConversations: async (parent, args, context) => {
            console.log('userConversations', args);
            if (!context.user._id) {
                console.log(c.red,'You need to be logged in to view your conversations');
                return{ error: 'You need to be logged in to view your conversations' };
                throw new AuthenticationError 
            }
            try {
                const conversations = await Conversation.find({ participants: context.user._id })
                return conversations;
            } catch (error) {
                console.error('Error fetching conversations:', error);
                throw new Error('Failed to fetch conversations');
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            // Check if the email is already in use
            const existingUser = await User.findOne({ email: args.email });
            if (existingUser) {
                throw new Error('Email is already in use');
            }
        
            // Create the new user
            const user = await User.create(args);
            const token = signToken(user);
        
            return { token, user };
        },
        addProduct: async (parent, args, context) => {
            console.log('addProduct', context.user);
            if (!context.user) { throw AuthenticationError; }
            try {
                const product = await Product.create({
                    ...args,
                    user: context.user._id,
                });
                return product;
            } catch (error) {
                throw new Error('Error adding product: ' + error.message);
            }
        },
        addOrder: async (parent, { products }, context) => {
            if (!context.user) { throw AuthenticationError; }
            const order = new Order({ products });
            await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
            return order;
            
        },
        updateUser: async (parent, args, context) => {
            if (!context.user) { throw AuthenticationError; }
            return await User.findByIdAndUpdate(context.user._id, args, { new: true });
        },
        updateProduct: async (parent, args, context) => {
            if (!context.user) { throw AuthenticationError; }

            console.log('updateProduct', context.user);
            const updatedProduct = await Product.findByIdAndUpdate(
                args._id,
                { $set: args },
                { new: true }
            );
            return updatedProduct
        },
        login: async (parent, { email, password }, context) => {
            const user = await User.findOne({ email });
            if (!user) { throw AuthenticationError; }
            console.log(c.red, 'login', user);
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) { throw AuthenticationError; }
            context.user = user;
            const token = signToken(user);
            return { token, user };
        },
        createConversation: async (_, { productId, messages }) => {
            const newConversation = new Conversation({
                product: productId,
                messages: messages.map(message => ({
                    ...message,
                    createdAt: new Date().toISOString()
                }))
            });

            try {
                const savedConversation = await newConversation.save();
                return savedConversation;
            } catch (error) {
                throw new Error('Error creating conversation: ' + error.message);
            }
        },
        sendMessage: async (parent, { senderId, receiverId, content, productId }) => {
            // Check if the senderId is provided
            console.log(c.red, 'sendMessage', senderId, receiverId, content, productId);
            const newMessage = { text: content, senderId, receiverId, createdAt: new Date(), };
        
            try {
                // Checking if a conversation exists
                let conversation = await Conversation.findOne({
                    productId: productId,
                    $or: [
                        { 'messages.senderId': senderId, 'messages.receiverId': receiverId },
                        { 'messages.senderId': receiverId, 'messages.receiverId': senderId }
                    ]
                });
        
                if (!conversation) {
                    conversation = new Conversation({
                        participants: [senderId, receiverId],
                        productId: productId,
                        messages: []
                    });
                }
        
                conversation.messages.push(newMessage);
                console.log(c.red, 'conversation', conversation);
                conversation = await conversation.save();
                console.log(c.green, 'conversation', conversation);
                
        
                // Populate the senderId and receiverId fields in the messages
                // await conversation.populate({
                //     path: 'messages.senderId messages.receiverId',
                //     select: 'firstName lastName'
                // })
        
                return conversation;
            } catch (error) {
                // Log and rethrow the error for further handling
                console.error('Error updating conversation:', error);
                throw new Error('Failed to send message.');
            }
        },
    }
};

module.exports = resolvers;
