import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

export default async function postContactData(data) {
    // Retrieve the token from cookies
    const token = Cookies.get('authToken'); // Assuming 'authToken' is the key used to store the token

    // Set the token in the request headers if it exists
    const config = {
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined, // Set Authorization header
        }
    };

    try {
        return await axios.post(`${process.env.API}/contact`, data, config);
    } catch (error) {
        console.error('Error posting contact data:', error);
        throw error; // Re-throw the error for further handling
    }
}
