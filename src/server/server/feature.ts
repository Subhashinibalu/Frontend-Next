

export default async function postfeaturedata(id, index, data, token){
    console.log(data);

console.log("++++++++++++++++++++++++++++++");

    try {
        const response = await fetch(`${process.env.API}/home/${id}/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
            body: JSON.stringify(data) // Stringify the data for the body
        });
  
        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            const errorMessage = await response.text(); // Get the error message if the response is not OK
            throw new Error(`Error: ${response.status} ${errorMessage}`);
        }
  
        return await response.json(); // Return the parsed JSON response
    } catch (error) {
        console.error('Error posting feature data:', error);
        throw error; // Re-throw the error for further handling
    }
  }
  