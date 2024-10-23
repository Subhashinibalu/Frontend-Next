export default async function getcontactdata(token){
    return await fetch('/api/getcontact', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }