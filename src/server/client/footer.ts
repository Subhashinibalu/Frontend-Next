export default async function footerdata(data,token){
    return await fetch('/api/footer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}` // Add your token here
        },
        body: JSON.stringify(data)
    });

}
