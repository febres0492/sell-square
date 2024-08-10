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
        return useMutation(operation, { variables })
    } else {
        return useQuery(operation, { variables })
    }
}

export default ifLoggedIn;