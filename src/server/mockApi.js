import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/mock'
});

export const switchToLoginPage = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') window.location = '/login';
};

const throwServerError = (error) => {
    console.error(error);
    throw new Error('Unexpected Server Error');
};

async function fetchJsonHandleUnauthorized(url, body, token) {
    const response = await apiClient.post(
        url, 
        body, 
        { headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`
        }
        }).catch(error => error?.response?.status === 401
            ? switchToLoginPage()
            : throwServerError(error));
    return response?.status === 200
        ? response.data
        : throwServerError(response);
}

export const getToken = () => {
    const postData = {
        'Username': 'c0n4p4n$AppSIPAMUser',
        'Password': 'c0n4p4n$AppSIPAMpass'
    };
    try {
        return apiClient.post('/Authenticate', postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }

};


export const getUser = (user, password, token) => {
    const body = {
        usuario: user,
        password
    };
    console.log(body);
    return fetchJsonHandleUnauthorized('/GetUsuario', body, token);
};

export const validateToken = (token) => {
    const postData = {
        token
    };
    try {
        return apiClient.post('/validateToken', postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getUserData = (token, userId) => {
    const body = {
        userId
    };
    return fetchJsonHandleUnauthorized('/getUserData', body, token);
};

export const getBlogPreview = (token) => {
    return fetchJsonHandleUnauthorized('/getBlogPreview', {}, token);
};


export const getBlogById = (blogId, token) => {
    const body = {
        blogId
    };
    try {
        return apiClient.post('/getBlogById', body, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
};