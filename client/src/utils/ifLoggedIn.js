import { useQuery, useMutation } from '@apollo/client';
import Auth from "../utils/auth";
import { showModal } from '../components/Modal';

const ifLoggedIn = (operation, variables = {}, obj) => {
    const loggedIn = Auth.loggedIn()
    if (!loggedIn) {
        showModal('You need to login in to perform this action', {type: 'login'});
        return { 
            error: { message: 'Login Required' },
            loading: false, 
            data: null,
            loginRequired: false
        }
    }

    if (obj?.isMutation) {
        console.log('isMutation', variables)
        const [mutateFunction, { loading, error, data }] = useMutation(operation, {
            variables,
            // context: { headers: { authorization: `Bearer ${Auth.getToken()}` } },
        });
        console.log('error', error)
        return { mutateFunction, loading, error, data }
    } else {
        console.log('isQuery', variables)
        const { loading, error, data } = useQuery(operation, { variables })
        console.log('data = ', data)
        return { loading, error, data }
    }
}

export default ifLoggedIn;