import axios from "axios";


// const EXERCISE_URL = "https://sdamgiaserver.onrender.com";
// const API_URL = "https://expressserver-pq6l.onrender.com";

const EXERCISE_URL = process.env.EXERCISE_URL_RENDER;
const API_URL = process.env.API_URL;
const EXTRACT_TEXT_URL = process.env.EXTRACT_TEXT_URL;


// const API_URL = process.env.API_URL;
// const API_URL = 'http://10.192.215.208';


// const API_URL = 'http://192.168.0.176:3000';


// const API_URL = 'http://optimistic-rene-alexos.koyeb.app';


export async function SendImage(imageUri) {
    try {
        console.log("api call started")
        await axios.get(`${EXTRACT_TEXT_URL}`)

        const formData = new FormData();
        formData.append('image', {
            name: 'texttoimage.jpeg',
            type: 'image/jpg',
            uri: imageUri,
        });
        console.log(EXTRACT_TEXT_URL)
        const response = await axios.post(`${EXTRACT_TEXT_URL}/getText`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        console.log("api call ended")
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function GetFeedbackOnEssayQuery(token, topic, topicContent) {
    console.log("calling")
    try {
        const response = await axios.post(
            `${API_URL}/user/getFeedbackOnEssayQuery`,
            {
                token: token,
                topic: topic,
                topicContent: topicContent
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export async function FixWrittenText(token, topic, topicContent) {
    try {
        console.log("calling")
        const response = await axios.post(
            `${API_URL}/user/fixUserWrittenTextQuery`,
            {
                token: token,
                topic: topic,
                topicContent: topicContent
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
