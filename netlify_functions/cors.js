const fetch = require('node-fetch')

exports.handler = async (event, context) => {
    let uri = event.path

    uri = uri.split('.netlify/functions/cors/')[1]
    uri = decodeURIComponent(uri)
    uri = new URL(uri)

    for(let i in event.queryStringParameters){
        uri.searchParams.append(i, event.queryStringParameters[i])
    }

    let cookie_string = event.headers.cookie || ''
    let userAgent = event.headers['user-agent'] || ''
    
    let header_to_send = {
        'Cookie': cookie_string,
        'User-Agent': userAgent,
        'content-type': 'application/json',
        'accept': '*/*',
        'host': uri.host
    }

    let options = {
        method: event.httpMethod.toUpperCase(),
        headers: header_to_send,
        body: event.body
    }

    if(event.httpMethod.toUpperCase() == 'GET' || event.httpMethod.toUpperCase() == 'HEAD') delete options.body

    let res = await fetch(uri, options)
    let res_text = await res.text()
    let headers = res.headers.raw()

    let cookie_header = null
    if(headers['set-cookie']) cookie_header = headers['set-cookie']

    return{
        statusCode: 200,
        body: res_text,
        headers: {
            'content-type': String(header['content-type']) || 'text/plain'
        },
        multiValueHeaders: {
            'set-cookie': cookie_header || []
        }
    }

}