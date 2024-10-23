export default async function contactdata(data,token){
    return await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
