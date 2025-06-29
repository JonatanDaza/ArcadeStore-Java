import axios from "axios";

const API_URL = 'http://localhost:8085/api/agreements';

// Helper para headers con JWT
const authHeaders = (token) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

export async function checkConnection(token) {
    try {
        const res = await axios.get(`${API_URL}/all`, authHeaders(token));
        return res.status === 200;
    } catch {
        return false;
    }
}

export async function getAllAgreements(token) {
    const res = await axios.get(`${API_URL}/all`, authHeaders(token));
    return res.data;
}

export async function createAgreement(agreementData, token) {
    const res = await axios.post(`${API_URL}/create`, agreementData, authHeaders(token));
    return res.data;
}

export async function updateAgreement(id, agreementData, token) {
    const res = await axios.put(`${API_URL}/${id}/update`, agreementData, authHeaders(token));
    return res.data;
}

export async function deactivateAgreement(id, token) {
    const res = await axios.patch(`${API_URL}/${id}/status?active=false`, {}, authHeaders(token));
    return res.data;
}

export async function activateAgreement(id, token) {
    const res = await axios.patch(`${API_URL}/${id}/status?active=true`, {}, authHeaders(token));
    return res.data;
}

const AgreementService = {
    checkConnection,
    getAllAgreements,
    createAgreement,
    updateAgreement,
    deactivateAgreement,
    activateAgreement,
};

export default AgreementService;