export const raasiList = [
    "Mesham", "Rishabam", "Midhunam", "Kadagam", "Simmam", "Kanni", "Thulaam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam"
];

export const nakshatramList = [
    "Ashwini", "Bharani", "Krithigai", "Rohini", "Mrigashirisham", "Thiruvadhirai", "Punarpusam", "Pusam", "Ayilyam",
    "Magam", "Puram", "Uthiram", "Hastham", "Chithirai", "Swathi", "Visakam", "Anusham", "Kettai",
    "Moolam", "Puradam", "Uthiradam", "Thiruvonam", "Avittam", "Sadhayam", "Purattadhi", "Uthirattadhi", "Revathi"
];

export const nakshatrasWithPadas = nakshatramList.flatMap(n => [1, 2, 3, 4].map(p => `${n} ${p}`));

export const tamilYearsList = [
    "Prabhava", "Vibhava", "Sukla", "Pramodhootha", "Prajotpatti", "Angirasa", "Srimukha", "Bhava",
    "Yuva", "Dhadhu", "Easwara", "Vegudhaanya", "Pramadhi", "Vikrama", "Vishu", "Chithrabhanu",
    "Subhanu", "Tharana", "Parthiba", "Viyaya", "Sarvajith", "Sarvadhari", "Virodhi", "Vikruthi",
    "Kara", "Nandhana", "Vijaya", "Jaya", "Manmadha", "Dhunmukhi", "Hevilambi", "Vilambi",
    "Vikari", "Sarvari", "Plava", "Subhakruthu", "Sobhakruthu", "Krodhi", "Visuvasu", "Parabhava",
    "Plavanga", "Keelaka", "Saumya", "Sadhrana", "Virodhikruthu", "Paridhabhi", "Pramadheesa", "Anandha",
    "Rakshasa", "Nala", "Pingala", "Kalayukthi", "Siddharthi", "Raudhri", "Dhunmathi", "Dhundhubhi",
    "Rudhrodhgari", "Rakthakshi", "Krodhana", "Akshaya"
];

export const tamilMonthsList = [
    "Chithirai", "Vaikasi", "Aani", "Aadi", "Aavani", "Purattasi", "Aippasi", "Karthigai", "Margazhi", "Thai", "Maasi", "Panguni"
];

export const yesNoList = ["Yes", "No"];

export const skinColorsList = ["Fair", "Wheatish", "Dusky", "Black"];

export const daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const workStatusList = [
    "Working", "Not working", "Seeking Work", "Self-Employed / Business", "Exam Preparation"
];

export const martialStatusList = [
    "Single", "Widowed", "Widower", "Divorced", "Separated"
];

export const initialProfileValues = {
    name: "",
    email: "",
    profile_img: "",
    gender: "",
    height: "",
    weight: "",
    colour: "",
    marital_status: "",
    birth: {
        dob: "",
        time: "",
        day: "",
        place: "",
    },
    professional: {
        work_status: "",
        education: "",
        job: "",
        income: "",
        location: "",
    },
    family: {
        father_name: "",
        mother_name: "",
        father_job: "",
        mother_job: "",
        father_alive: "",
        mother_alive: "",
        poorvigam: "",
        gothram: "",
        kuladeivam: "",
        brothers: "",
        sisters: "",
        married_brothers: "",
        married_sisters: "",
        address: "",
        mobile: "",
    },
    astro: {
        tamil_year: "",
        tamil_month: "",
        tamil_date: "",
        rasi: "",
        nakshatram: "",
        patham: "",
        lagnam: "",
        desai: "",
        desai_year: "",
        desai_month: "",
        desai_date: "",
        img: "",
    },
};
