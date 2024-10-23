export default async function homedata(data,token){
    return await fetch('/api/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
