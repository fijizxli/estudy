import axios from 'axios';

export default axios.create({
				baseURL: 'http://localhost:8080',
				headers: {'X-API-KEY' : 'key'}
});

export const fileupload = axios.create({
	baseURL: 'http://localhost:8082',
	timeout: 1000,
});