import { prokerala } from "constants/apiRoutes";
import apiService from "./axios";
import axios from "axios";

const pokeralaService = {
    getToken: (payload) => apiService.post(prokerala.GET_TOKEN),
    getMatch: (payload) => apiService.get(prokerala.GET_MATCH, payload),
}

export default pokeralaService;