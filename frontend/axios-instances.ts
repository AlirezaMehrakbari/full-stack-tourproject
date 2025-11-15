import Axios from 'axios';

export const tripTourApi = Axios.create({
    baseURL: 'http://localhost:5000/api/',
});