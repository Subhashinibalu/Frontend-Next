export default async function getfooterdata(token){
    return await fetch('/api/getfooter', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }