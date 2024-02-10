import axios from 'axios';
import {GOOGLE_MAP_API_KEY} from '@/store/model';

const apiClient = axios.create({
    baseURL: '/googleapis'
});

const throwServerError = (error) => {
    console.error(error);
    throw new Error('Unexpected Server Error');
};

async function fetchJsonHandleUnauthorized(url) {
    const response = await apiClient.get(
        url, 
        { headers: {
            'Content-Type': 'application/json',
        }
        }).catch(error => throwServerError(error));
    return response?.status === 200
        ? response.data
        : throwServerError(response);
}



export const getLocationCoordinates = (provincia, distrito) => {
    const url = `/maps/api/geocode/json?components=locality:${provincia},${distrito}|country:CR&key=${GOOGLE_MAP_API_KEY}`;
    return fetchJsonHandleUnauthorized(url);
};
