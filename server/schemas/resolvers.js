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
                console.log(c.red,'getUserProducts');
                if (!context.user?._id) {
                    console.log(c.red,'You need to be logged in to view your conversations');
                    return [{ error: 'You need to be logged in to view your conversations' }];
                }
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
        conversation: async (parent, args, context) => {
            let filter = {};
        
            try {

                if(args._id){ filter._id = args._id; }
                if (args.productId) { filter.productId = args.productId; }
                if (args.userId) { filter.participants = args.userId; }
                if (args.participantId && context.user._id !== args.participantId) { 
                    filter.participants = [context.user._id, args.participantId ]; 
                }

                console.log('conversations', args, filter)
                
                const conversations = await Conversation.find(filter)
                    .populate('participants', 'firstName lastName email')
                    .populate('productId');
        
                console.log(c.red, 'conver res', args, conversations[0]?._id);
                return conversations;
            } catch (error) {
                console.error('Error fetching conversation:', error);
                throw new Error('Failed to fetch conversation');
            }
        },
        userConversations: async (parent, args, context) => {
            if (!context.user._id) {
                console.log(c.red,'You need to be logged in to view your conversations');
                return{ error: 'You need to be logged in to view your conversations' };
                throw new AuthenticationError 
            }
            try {
                const conversations = await Conversation.find({ participants: context.user._id })
                .populate('participants', 'firstName lastName email')
                .populate('productId')

                const filteredConversations = conversations.map(conversation => {
                    conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== context.user._id);
                    return conversation;
                });
        
                console.log(c.green, 'userConversations', filteredConversations);
                return filteredConversations;

                console.log(c.green,'userConversations', conversations);
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
        deleteProduct: async (parent, { _id }, context) => {
            if (!context.user) { throw AuthenticationError; }
            console.log('deleteProduct', context.user);
            const product = await Product.findByIdAndDelete(_id);
            return product;
        },
        addOrder: async (parent, { products }, context) => {
            if (!context.user) { throw AuthenticationError; }
            const order = new Order({ products });
            await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
            return order;
            
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
        sendMessage: async (parent, { receiverId, content, productId }, context) => {
            // Check if the senderId is provided
            if(!context.user) { 
                console.log(c.red, 'You need to be logged in to send messages');
                throw new AuthenticationError; 
            }
            const senderId = context.user._id;
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
                conversation = await conversation.save();
                console.log(c.green, 'newMessage', newMessage);
        
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                lastMessage.conversationId = conversation._id
                console.log(c.green, 'lastMessage', lastMessage);

                return lastMessage
            } catch (error) {
                // Log and rethrow the error for further handling
                console.error('Error updating conversation:', error);
                throw new Error('Failed to send message.');
            }
        },
        updateUser: async (_, { firstName, lastName, email, currentPassword, password }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const user = await User.findById(context.user._id);

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            if (currentPassword && password) {
                const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

                if (!isPasswordCorrect) {
                    throw new AuthenticationError('Current password is incorrect');
                }

                user.password = await bcrypt.hash(password, 10);
            }

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (email) user.email = email;

            await user.save();

            return {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };
        },
    }
};

module.exports = resolvers;
