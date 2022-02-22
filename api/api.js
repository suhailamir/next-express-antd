
const apiUrl = 'http://localhost:3000/api/';
const api = async (method = "get", endpoint = '/', requestData = {}, queryParams = '') => {
    try {
        const url = `${apiUrl}${endpoint}${queryParams}`;
        const options = method === 'get' ? {
            method,

        } : { method, body: JSON.stringify(requestData), headers: { "Content-Type": "application/json" } }
        return await fetch(url, options).then((res) => { return res.json() })
            .then(({ data, error }) => {
                return { data, error }
            }).catch(err => {
                return { data: null, error: err }
            });

    } catch (e) {
        console.log("error", e);
        return { data: null, error: e }
    }
}

export default api