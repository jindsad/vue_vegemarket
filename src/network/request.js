import axios from 'axios'
export function request(config){
    const instance =axios.create({
        baseURL:'http://119.45.146.98:9000',
        timeout:5000,
    })
    return instance(config)
}

// import {request} from "./network/request";
// request({
//     url:'/home/multidata'
// }.then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.log(err)
// })
// )