export default async function getsupportdata(token){
    return await fetch('/api/getsupport', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Add your token here
        }
    });
 }