
import axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost',
    headers: {
        'content-type':'application/octet-stream',
        'x-rapidapi-host':'example.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'Access-Control-Allow-Origin':  'http://127.0.0.1',
        'Access-Control-Allow-Credentials': 'true'
    },
});

export default {
    getData: (props) =>
    instance({
        'method':'GET',
        'url':props.url,
        'params': props.params,
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')
            const json = JSON.parse(data)
            return  {
                        data:json
                    };
        }],
    }),
    postData: (props) =>
    instance({
        'method': 'POST',
        'url':props.url,
        'data': props.params,
        'headers': { 'content-type':props.contentType }, // override instance defaults
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')
            const json = JSON.parse(data)
            return  {
                        data:json
                    };
        }]        
    }),
    deleteData: (props) =>
    instance({
        'method': 'DELETE',
        'url':props.url,
        'data': props.params,
        'headers': { 'content-type':props.contentType },
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')
            const json = JSON.parse(data)
            return  {
                        data:json
                    };
        }]        
    }),
    updateData: (props) =>
    instance({
        'method': 'PUT',
        'url':props.url,
        'data': props.params,
        'headers': { 'content-type':props.contentType }
    })
}