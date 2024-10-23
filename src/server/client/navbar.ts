export default async function navbardata(data,token){
    return await fetch('/api/navbar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
