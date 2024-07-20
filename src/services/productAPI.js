import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const ProductAPI = {
    getUrl: (endpoint = '') => `${API_BASE_URL}/${endpoint}`,

    getFullUrl: (filePath = '') => {
        const baseUrl = 'http://localhost:5001';
        return `${baseUrl}/${filePath}`;
    },

    getAllProducts: async () => {
        try {
            const response = await axios.get(ProductAPI.getUrl());
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(ProductAPI.getUrl(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Add more methods as needed, like createProduct, updateProduct, deleteProduct
};

export default ProductAPI;
