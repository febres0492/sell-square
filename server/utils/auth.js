const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'fbiugidvoadioef984r9htyb98h93efh';
const expiration = '2h';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

module.exports = {
    // AuthenticationError: new GraphQLError('Could not authenticate user.', {
    //     extensions: {
    //         code: 'UNAUTHENTICATED',
    //     },
    // }),
    AuthenticationError: function (message = 'Could not authenticate user') {
        return new GraphQLError(message, {
            extensions: {
                code: 'UNAUTHENTICATED',
                message,
            },
        });
    },
    authMiddleware: function ({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;
        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) { return req; }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            console.log(c.green,'authMiddleware', data.firstName);
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        return req;
    },
    signToken: function ({ firstName, email, _id }) {
        const payload = { firstName, email, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
