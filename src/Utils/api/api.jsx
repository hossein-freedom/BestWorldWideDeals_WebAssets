
import axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type':'application/octet-stream',
        'x-rapidapi-host':'example.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'Access-Control-Allow-Origin':  'http://127.0.0.1:8080',
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
    // postData: () =>
    // instance({
    //     'method': 'POST',
    //     'url':'/api',
    //     'data': {
    //         'item1':'data1',
    //         'item2':'item2'
    //     },
    //     'headers': { 'content-type':'application/json' // override instance defaults
    //     },
    //})
}