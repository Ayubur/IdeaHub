import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3090'
});

instance.defaults.headers.post['Content-Type'] ='application/json';
instance.defaults.headers.post['Access-Control-Allow-Methods'] = 'PATCH, DELETE, POST, GET, OPTIONS';

export default instance;