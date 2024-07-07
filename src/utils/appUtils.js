export const calculateAge = (dob) => {
    if (dob) {
        const [day, month, year] = dob?.split('/')?.map(Number);
        const birthDate = new Date(year, month - 1, day);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    return ""
};