const doctors = [

    {
        id: 1,
        name: "Dr. Ananya Sharma",
        specialization: "General Physician",
        qualifications: "MBBS, MD",
        experience: 6,
        fee: 300,
        rating: 4.7,
        location: "Sahyadri Community Health Centre",
        available: true,
        bio: "Experienced general physician providing accessible primary care, preventive health guidance and routine consultations."
    },

    {
        id: 2,
        name: "Dr. Rahul Patil",
        specialization: "Pediatrician",
        qualifications: "MBBS, DCH",
        experience: 8,
        fee: 350,
        rating: 4.8,
        location: "Jeevan Jyoti Rural Hospital",
        available: true,
        bio: "Pediatrician focused on child health, preventive care and treatment of common childhood conditions."
    },

    {
        id: 3,
        name: "Dr. Priya Deshmukh",
        specialization: "Gynecologist",
        qualifications: "MBBS, MS",
        experience: 7,
        fee: 400,
        rating: 4.9,
        location: "Aarogya Women's Centre",
        available: true,
        bio: "Gynecologist providing women's health consultations, preventive care and reproductive health support."
    },

    {
        id: 4,
        name: "Dr. Vikram Kulkarni",
        specialization: "Cardiologist",
        qualifications: "MBBS, MD, DM",
        experience: 12,
        fee: 650,
        rating: 4.8,
        location: "Sahyadri Community Health Centre",
        available: false,
        bio: "Cardiologist specializing in cardiovascular consultations, preventive heart care and long-term cardiac management."
    },

    {
        id: 5,
        name: "Dr. Meera Joshi",
        specialization: "Dermatologist",
        qualifications: "MBBS, MD",
        experience: 9,
        fee: 500,
        rating: 4.7,
        location: "Jeevan Jyoti Rural Hospital",
        available: true,
        bio: "Dermatologist providing diagnosis and management of common skin, hair and nail conditions."
    },

    {
        id: 6,
        name: "Dr. Aditya More",
        specialization: "General Physician",
        qualifications: "MBBS, MD",
        experience: 5,
        fee: 250,
        rating: 4.6,
        location: "Aarogya Primary Care Centre",
        available: true,
        bio: "General physician focused on accessible primary healthcare and everyday medical concerns."
    },

    {
        id: 7,
        name: "Dr. Neha Pawar",
        specialization: "Pediatrician",
        qualifications: "MBBS, DNB",
        experience: 6,
        fee: 350,
        rating: 4.9,
        location: "Sahyadri Community Health Centre",
        available: true,
        bio: "Pediatrician offering child wellness consultations, growth monitoring and routine pediatric care."
    },

    {
        id: 8,
        name: "Dr. Sameer Jadhav",
        specialization: "Cardiologist",
        qualifications: "MBBS, MD",
        experience: 10,
        fee: 600,
        rating: 4.7,
        location: "Jeevan Jyoti Rural Hospital",
        available: false,
        bio: "Cardiologist focused on cardiovascular screening, consultation and preventive heart health."
    },

    {
        id: 9,
        name: "Dr. Riya Chavan",
        specialization: "Dermatologist",
        qualifications: "MBBS, DVD",
        experience: 5,
        fee: 450,
        rating: 4.8,
        location: "Aarogya Primary Care Centre",
        available: true,
        bio: "Dermatologist providing accessible care for common skin and hair concerns."
    },

    {
        id: 10,
        name: "Dr. Kunal Desai",
        specialization: "General Physician",
        qualifications: "MBBS, MD",
        experience: 11,
        fee: 350,
        rating: 4.8,
        location: "Jeevan Jyoti Rural Hospital",
        available: true,
        bio: "General physician with extensive experience in primary care and chronic condition management."
    },

    {
        id: 11,
        name: "Dr. Snehal Shinde",
        specialization: "Gynecologist",
        qualifications: "MBBS, DGO",
        experience: 8,
        fee: 400,
        rating: 4.8,
        location: "Aarogya Women's Centre",
        available: true,
        bio: "Gynecologist providing women's healthcare consultations and preventive health services."
    },

    {
        id: 12,
        name: "Dr. Arjun Wagh",
        specialization: "General Physician",
        qualifications: "MBBS, MD",
        experience: 4,
        fee: 250,
        rating: 4.6,
        location: "Sahyadri Community Health Centre",
        available: false,
        bio: "General physician providing primary consultations and routine healthcare support."
    }

];


/* =========================================================
   GET ALL
========================================================= */

function getAllDoctors() {

    return doctors;
}


/* =========================================================
   GET BY ID
========================================================= */

function getDoctorById(id) {

    const doctorId =
        Number(id);


    return doctors.find(
        doctor => doctor.id === doctorId
    ) || null;
}


/* =========================================================
   SEARCH
========================================================= */

function searchDoctors(query) {

    const value =
        String(query || "")
            .trim()
            .toLowerCase();


    if (!value) {

        return doctors;
    }


    return doctors.filter(
        doctor =>
            doctor.name
                .toLowerCase()
                .includes(value)

            ||

            doctor.specialization
                .toLowerCase()
                .includes(value)

            ||

            doctor.location
                .toLowerCase()
                .includes(value)
    );
}


/* =========================================================
   SPECIALIZATION
========================================================= */

function getDoctorsBySpecialization(
    specialization
) {

    const value =
        String(specialization || "")
            .trim()
            .toLowerCase();


    if (!value) {

        return doctors;
    }


    return doctors.filter(
        doctor =>
            doctor.specialization
                .toLowerCase() === value
    );
}


/* =========================================================
   AVAILABLE
========================================================= */

function getAvailableDoctors() {

    return doctors.filter(
        doctor => doctor.available === true
    );
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    getAllDoctors: getAllDoctors,

    getDoctorById: getDoctorById,

    searchDoctors: searchDoctors,

    getDoctorsBySpecialization:
        getDoctorsBySpecialization,

    getAvailableDoctors:
        getAvailableDoctors

};