export default async function getnavbardata(token){
    return await fetch('/api/getnavbar', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }