"use client";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

const authHeaders = (token) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

const getUserLibrary = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/library`, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching user library:', error.response || error);
        throw error.response?.data || new Error('Error al obtener la biblioteca del usuario.');
    }
};

const LibraryService = {
  getUserLibrary,
};

export default LibraryService;
