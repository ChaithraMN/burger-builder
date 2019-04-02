import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-backend-75b01.firebaseio.com/'
});

export default instance;