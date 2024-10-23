export default async function supportdata(data,token){
    return await fetch('/api/support', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
