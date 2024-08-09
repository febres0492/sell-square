import { useQuery, useMutation } from '@apollo/client';
import Auth from "../utils/auth";
import { showModal } from '../components/Modal';

const ifLoggedIn = async (operation, variables = {}, obj) => {
    console.log('variables = ', variables)
    const loggedIn = Auth.loggedIn()
    if (!loggedIn) {
        await showModal('You need to login in to perform this action', {type: 'login'});
        return { 
            error: { message: 'Login Required' },
            loading: false, 
            data: null,
            loginRequired: false
        }
    }

    if(Object.keys(variables).length == 0) {
        return { 
            error: null,
            loading: false, 
            data: null
        }
    }

    if (obj?.isMutation) {
        const [mutateFunction, { loading, error, data }] = useMutation(operation, { variables })
        return { mutateFunction, loading, error, data }
    } else {
        const { loading, error, data } = useQuery(operation, { variables })
        return { loading, error, data }
    }
}

export default ifLoggedIn;