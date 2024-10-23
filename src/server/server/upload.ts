export default async function uploadfiledata(file) {
  console.log("FILE NEED TO BE UPLOADED", file);

  try {


    const response = await fetch(`${process.env.API}/upload`, {
      method: 'POST',
      body: file, // Send the FormData directly
    });
    

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} ${errorMessage}`);
    }
    const data = await response.json();
    const blobUrl = data.blobUrl;
    return await blobUrl; // Return the parsed JSON response
  } catch (error) {
    console.error('Error posting file data:', error);
    throw error; // Re-throw the error for further handling
  }
}
