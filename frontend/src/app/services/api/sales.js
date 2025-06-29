import axios from "axios";

const API_URL = 'http://localhost:8085/api/sales';

// Helper para headers con JWT
const authHeaders = (token) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

// Helper para headers con JWT para descargas
const authHeadersForDownload = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // Importante para archivos binarios
});

export async function checkConnection(token) {
    try {
        const res = await axios.get(`${API_URL}/all`, authHeaders(token));
        return res.status === 200;
    } catch {
        return false;
    }
}

export async function getAllSales(token) {
    const res = await axios.get(`${API_URL}/all`, authHeaders(token));
    return res.data;
}

// Función mejorada para generar PDF con datos de ventas
export async function ReportPdf(token, salesData = null) {
    try {
        let url = `${API_URL}/report/pdf`;
        let requestConfig = authHeadersForDownload(token);
        
        // Si no se proporcionan datos, el backend debería obtenerlos
        // Si se proporcionan datos, los enviamos en el body
        if (salesData && salesData.length > 0) {
            // Cambiar a POST para enviar datos
            url = `${API_URL}/report/pdf-with-data`;
            requestConfig = {
                ...authHeaders(token),
                responseType: 'blob'
            };
            
            const res = await axios.post(url, { sales: salesData }, requestConfig);
            return handlePdfDownload(res);
        } else {
            // GET normal - el backend obtiene los datos
            const res = await axios.get(url, requestConfig);
            return handlePdfDownload(res);
        }
    } catch (error) {
        console.error('Error generating PDF report:', error);
        throw error;
    }
}

// Función para generar PDF con filtros específicos
export async function ReportPdfWithFilters(token, filters = {}) {
    try {
        const res = await axios.post(
            `${API_URL}/report/pdf-filtered`, 
            filters, 
            {
                ...authHeaders(token),
                responseType: 'blob'
            }
        );
        return handlePdfDownload(res);
    } catch (error) {
        console.error('Error generating filtered PDF report:', error);
        throw error;
    }
}

// Función helper para manejar la descarga del PDF
function handlePdfDownload(response) {
    // Verificar que la respuesta sea un PDF válido
    if (response.data.size === 0) {
        throw new Error('El archivo PDF está vacío');
    }
    
    // Crear blob y descargar
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento de descarga temporal
    const link = document.createElement('a');
    link.href = url;
    
    // Generar nombre del archivo con fecha actual
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    link.download = `reporte-ventas-${dateStr}-${timeStr}.pdf`;
    
    // Añadir al DOM temporalmente y hacer click
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response.data;
}

// Función para obtener preview del PDF (sin descargar)
export async function getReportPdfPreview(token, salesData = null) {
    try {
        const config = {
            ...authHeaders(token),
            responseType: 'blob'
        };
        
        let res;
        if (salesData && salesData.length > 0) {
            res = await axios.post(`${API_URL}/report/pdf-preview`, { sales: salesData }, config);
        } else {
            res = await axios.get(`${API_URL}/report/pdf-preview`, config);
        }
        
        // Retornar URL del blob para mostrar en iframe o nueva ventana
        const blob = new Blob([res.data], { type: 'application/pdf' });
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error getting PDF preview:', error);
        throw error;
    }
}

const SalesService = {
    checkConnection,
    getAllSales,
    ReportPdf,
    ReportPdfWithFilters,
    getReportPdfPreview,
};

export default SalesService;