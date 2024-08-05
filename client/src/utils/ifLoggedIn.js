import { useQuery, useMutation } from '@apollo/client';
import Auth from "../utils/auth";

const ifLoggedIn = (operation, variables = {}, obj) => {
    const loggedIn = Auth.loggedIn()
    if (!loggedIn) {
        return { 
            error: { message: 'You need to be logged in to perform this action' },
            loading: false, 
            data: null
        }
    }

    if (obj?.isMutation) {
        const [mutateFunction, { loading, error, data }] = useMutation(operation, { variables })
        return { mutateFunction, loading, error, data }
    } else {
        console.log('variables', variables)
        const { loading, error, data } = useQuery(operation, { variables })
        return { loading, error, data }
    }
}

export default ifLoggedIn;