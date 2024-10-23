export default async function aboutdata(data,token){
    return await fetch('/api/about', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
