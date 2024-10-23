export default function protectedroute(req) {
    const token = req.cookies.authToken; // Assuming Bearer token

    // If no token, redirect to login
    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    // If token exists, return props or any data you want to pass
    return {
        props: { token }, // Pass the token as props (or any other necessary data)
    };
}