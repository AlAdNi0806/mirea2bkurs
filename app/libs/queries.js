



export async function GetUserDetails(token) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/getUserDetails`,
            {
                token: token,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function ChangeUserFullName(token, fullName) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/changeUserFullName`,
            {
                token: token,
                fullName: fullName
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}



export async function GetExercises(token, subject, exercises) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${EXERCISE_URL}/get${subject}Exercises`,
            {
                token: token,
                exercises: exercises
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function MakeBecomeTesterRequest(token, request) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/makeBecomeTesterRequest`,
            {
                token: token,
                request: request
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function GiveFeedback(token, request) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/giveFeedback`,
            {
                token: token,
                request: request
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function ChangeLanguage(token, language) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/changeLanguage`,
            {
                token: token,
                language: language
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("finished calling")

        return response.data
    } catch (error) {
        console.error(error);
    }
}
