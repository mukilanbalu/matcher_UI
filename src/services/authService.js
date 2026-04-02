import apiService from "./axios";

const authService = {
    login: (payload) => apiService.post("/login", payload),
    logout: (payload) => apiService.post("/logout", payload),
    register: (payload) => apiService.post("/register", payload),

}

export default authService;