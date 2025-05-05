const API_BASE_URL = 'https://knowyourfanapp.onrender.com/api';

async function fetchAPI(endpoint, method = 'GET', body = null, isFormData = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {},
    };

    if (body) {
        if (isFormData) {
            options.body = body;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error(`API Error ${response.status}:`, responseData);
            throw new Error(responseData.error || `Erro ${response.status} na requisição para ${endpoint}`);
        }

        return responseData;

    } catch (error) {
        console.error(`Fetch error for ${method} ${endpoint}:`, error);
        throw error;
    }
}

async function findUserByCpf(cpf) {
    console.warn("findUserByCpf não implementado diretamente, use saveBasicInfo com CPF para carregar/criar.");
    return null;
}

async function saveBasicInfo(userData) {
    return fetchAPI('/users', 'POST', userData);
}

async function uploadIdDocument(userId, formData) {
    return fetchAPI(`/users/${userId}/upload_id`, 'POST', formData, true);
}

async function triggerIdValidation(userId) {
    return fetchAPI(`/users/${userId}/validate_id`, 'POST');
}

async function saveSocialLinks(userId, socialLinksData) {
    return fetchAPI(`/users/${userId}/link_social`, 'POST', socialLinksData);
}

async function triggerSocialAnalysis(userId) {
    return fetchAPI(`/users/${userId}/analyze_social`, 'POST');
}

async function saveEsportsProfiles(userId, profileLinksData) {
    return fetchAPI(`/users/${userId}/link_profile`, 'POST', profileLinksData);
}

async function triggerProfileValidation(userId) {
    return fetchAPI(`/users/${userId}/validate_profile`, 'POST');
}

async function getUserData(userId) {
    return fetchAPI(`/users/${userId}`, 'GET');
}
