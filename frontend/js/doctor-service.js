const doctorService = (() => {
    const API_URL = "http://localhost:5000/api/doctors";

    async function getAll() {
        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to fetch doctors."
            );
        }

        return result.data;
    }

    async function getById(id) {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to fetch doctor details."
            );
        }

        return result.data;
    }

    async function search(query = "") {
        const url = new URL(API_URL);

        if (query.trim()) {
            url.searchParams.set("search", query.trim());
        }

        const response = await fetch(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to search doctors."
            );
        }

        return result.data;
    }

    async function filterBySpecialization(specialization) {
        const url = new URL(API_URL);

        if (
            specialization &&
            specialization.toLowerCase() !== "all"
        ) {
            url.searchParams.set(
                "specialization",
                specialization
            );
        }

        const response = await fetch(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to filter doctors."
            );
        }

        return result.data;
    }

    async function searchAndFilter(query = "", specialization = "all") {
        const url = new URL(API_URL);

        if (query.trim()) {
            url.searchParams.set("search", query.trim());
        }

        if (
            specialization &&
            specialization.toLowerCase() !== "all"
        ) {
            url.searchParams.set(
                "specialization",
                specialization
            );
        }

        const response = await fetch(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to fetch doctors."
            );
        }

        return result.data;
    }

    async function getAvailable() {
        const doctors = await getAll();

        return doctors.filter(
            doctor => doctor.isAvailable
        );
    }

    return {
        getAll,
        getById,
        search,
        filterBySpecialization,
        searchAndFilter,
        getAvailable
    };
})();