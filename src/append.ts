export default async function fileappend(e) {
    const files = e.target.files[0];
  
    if (files.size < 1000000) { // Check if the file size is less than 1MB
      const formData = new FormData();
    
      formData.append("file", files); // Append the file to the form data
      
    
  
      try {
        const response = await fetch("/api/upload", { // Use absolute path for Next.js API route
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Upload failed: ' + response.statusText);
        }
  
        const data = await response.json(); // Assuming your backend returns JSON
        console.log('File uploaded successfully:', data);
        return data; // Return the response data, which might include the file URL
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('File size exceeds 1MB limit');
    }
  }
  