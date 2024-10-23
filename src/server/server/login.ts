import axios from "axios";

export default async function postlogindata(data){

   
    return await axios.post(`${process.env.API}/users/login`, data)
}
