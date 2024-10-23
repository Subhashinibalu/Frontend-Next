export default async function getaboutdata(token){
    return await fetch('/api/getabout', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }