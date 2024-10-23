export default async function featuredata(id, index, data, token) {
    const requestBody = {
        id,        // Include ID
        index,     // Include index
        ...data    // Spread the existing data
    };
console.log("<<<<<<<<<<<<<<<<<<<<<<<<",requestBody,token);
    return await fetch(`/api/feature`, {
        
        method: 'POST', // Use PUT for updating
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Ensure the token is prefixed with 'Bearer'
        },
        body: JSON.stringify(requestBody) // Send the combined data in the body
    });
    
}
