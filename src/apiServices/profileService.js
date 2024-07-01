import apiService from "./axios";
import { profile } from "../constants/apiRoutes";

const profileService = {
    createProfile: (payload) => apiService.post(profile.CREATE_PROFILE, payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),
    getProfile: (payload) => apiService.post(profile.GET_PROFILE, payload),
    searchProfiles: (payload) => apiService.post(profile.SEARCH_PROFILE, payload),
    patchProfile: (payload) => apiService.patch(profile.EDIT_PROFILE, payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),
    deleteProfile: (payload) => apiService.post(profile.DELETE_PROFILE, payload),

}

export default profileService;