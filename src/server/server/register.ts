import axios from "axios";

export default async function postregisterdata(data){
    return await axios.post(`${process.env.API}/users/register`, data)
}
