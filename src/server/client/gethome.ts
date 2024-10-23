export default async function gethomedata(token){
    return await fetch('/api/gethome', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }