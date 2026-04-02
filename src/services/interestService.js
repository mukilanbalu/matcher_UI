import apiService from "./axios";
import { interest } from "../constants/apiRoutes";

const interestService = {
    sendInterest: (payload) => apiService.post(interest.SEND, payload),
    getInterests: (email) => apiService.get(`${interest.LIST}?email=${email}`),
    updateStatus: (payload) => apiService.patch(interest.UPDATE, payload),
    toggleInterest: (payload) => apiService.post(interest.TOGGLE, payload),
    checkInterestStatus: (receiverEmail) => apiService.get(`${interest.CHECK}?receiver_email=${receiverEmail}`),
}

export default interestService;
