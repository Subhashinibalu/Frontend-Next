
export default async function gethomeformdata(token) {
    
    
    try {
        const response = await fetch(`${process.env.API}/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });
  
        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            const errorMessage = await response.text(); // Get the error message if the response is not OK
            throw new Error(`Error: ${response.status} ${errorMessage}`);
        }
  
        return await response.json(); // Return the parsed JSON response
    } catch (error) {
        console.error('Error getting home form data:', error);
        throw error; // Re-throw the error for further handling
    }
  }
  