import axios from "axios";
import { sys } from "typescript";

var passgen = require('generate-password');
var randomMobile = require('random-mobile');

(async function() {
    const url_extract_regex: RegExp = /\"(https:|http:|www\.)\S*\\"/gm;
    const guerrillamail_url: string = 'https://www.guerrillamail.com/ajax.php?';
    console.log('Starting Gizmos Generator');
    var response: axios.AxiosResponse = await axios.get(guerrillamail_url + 'f=get_email_address').then((response: axios.AxiosResponse) => response);
    var email_addr: string = response.data.email_addr;
    var session_token: string = (response.headers["set-cookie"] as string[])[0].split(';')[0].split('=')[1];
    console.log('Email: ' + email_addr, 'Session Token: ' + session_token);
    console.log('Sending request to register Gizmos account');
    response = await axios.post('https://services.explorelearning.com/platform/web/trial/signup/3?isFreemium=false', {
        "email": email_addr,
        "formInfo": {}
    }).then((response: axios.AxiosResponse) => response);
    if (response.data.MessageResponse) {
        if ((response.data.MessageResponse.message as string).includes('Email sent to')) {
            console.log('Successfully registered Gizmos account');
            console.log('Waiting for email');
            while (true) {
                var found: number = 0;
                response = await axios.get(guerrillamail_url + 'f=check_email&seq=0&email=' + email_addr + '&sid_token=' + session_token).then((response: axios.AxiosResponse) => response);
                if (response.data.list.length > 0) {
                    for (var i = 0; i < response.data.list.length; i++) {
                        if ((response.data.list[i].mail_from as string).includes('explorelearning')) {
                            var email: any = await axios.get(guerrillamail_url + 'f=fetch_email&email_id=' + response.data.list[i].mail_id + '&sid_token=' + session_token).then((response: axios.AxiosResponse) => response.data);
                            var mail_body: string = email.mail_body;
                            var activation_link: string = mail_body.split('href="')[1].split('"')[0];
                            //var activation_link: string = (url_extract_regex.exec(mail_body) as RegExpExecArray)[0].replace('">', '').replace('"', '');
                            if (activation_link.includes('http') && activation_link.includes('explorelearning.com')) {
                                console.log('Found activation link: ' + activation_link);
                                response = await (axios.get(activation_link).then((response: axios.AxiosResponse) => response).catch((error: axios.AxiosResponse) => {
                                    console.log('Failed to get activation link. error = ' + error);
                                    sys.exit(1);
                                }) as Promise<axios.AxiosResponse>);
                                var authCode: string = (response.request.res.responseUrl as string).split('/').pop() as string;
                                console.log('Found auth code: ' + authCode);
                                console.log('Sending request validate Gizmos account');
                                response = await (axios.options('https://services.explorelearning.com/platform/web/validate/' + authCode).then((response: axios.AxiosResponse) => response).catch((error: axios.AxiosError) => {
                                    console.log('Failed to validate code. error = ' + error);
                                    console.log('responce = ' + JSON.stringify((error.response as axios.AxiosResponse).data));
                                    sys.exit(1);
                                }) as Promise<axios.AxiosResponse>);
                                var theCookie: string[] = (response.headers["set-cookie"] as string[]);
                                console.log('Sending request to activate Gizmos account');
                                var password: string = passgen.generate({
                                    length: 10,
                                    numbers: true,
                                    symbols: true,
                                    uppercase: true
                                });
                                console.log('Generated password: ' + password);
                                response = await (axios.post('https://services.explorelearning.com/platform/web/trial/register?productID=3&regCode=' + authCode, {
                                    email: email_addr,
                                    //TODO: Request name/email from user
                                    firstName: 'Lima',
                                    lastName: 'Smith',
                                    password: password,
                                    titleID: "",
                                    username: "gizgen" + Math.random().toString().slice(2,10)
                                }, {
                                    headers: {
                                        'Cookie': theCookie,
                                        "accept": "application/json, text/plain, */*",
                                        "accept-language": "en-US,en;q=0.9",
                                        "content-type": "application/json;charset=UTF-8",
                                        'Origin': 'https://apps.explorelearning.com',
                                        'Referer': 'https://apps.explorelearning.com/'
                                    }
                                }).then((response: axios.AxiosResponse) => response).catch((error: axios.AxiosError) => {
                                    console.log('Failed to register account. error = ' + error);
                                    console.log('sent url = ' + 'https://services.explorelearning.com/platform/web/trial/register?productID=3&regCode=' + authCode);
                                    console.log('responce = ' + JSON.stringify((error.response as axios.AxiosResponse).data));
                                    sys.exit(1);
                                }) as Promise<axios.AxiosResponse>);
                                console.log('Successfully activated Gizmos account, completeing registration');
                                response = await (axios.post('https://services.explorelearning.com/platform/web/trial/complete?productID=3&regCode=' + authCode, {
                                    "firstName":'Gizmos',
                                    "lastName":'Generator',
                                    "email":email_addr,
                                    "phone":Math.random().toString().slice(2,12), //get random number, get string, slice off first two digits, keep next 10
                                    "phoneExt":null,
                                    "promoCode":null,
                                    "schoolInfo":{
                                        "countryCode":"USA",
                                        "gradeLevels":"9",
                                        "parentPid":null,
                                        "pid":"149864",
                                        "schoolCount":null,
                                        "schoolType":"public",
                                        "stateCode":"CO",
                                        "studentCount":null,
                                        "teacherCount":null,
                                        "unknownName":null,
                                        "titles":"Teacher",
                                        "zip":"80132"
                                    },
                                    "formInfo":{}
                                }).then((response: axios.AxiosResponse) => response).catch((error: any) => {
                                    console.log('Failed to get activation link. error = ' + error);
                                    sys.exit(1);
                                }) as Promise<axios.AxiosResponse>);
                                if (response.status != 200) {
                                    console.log('Failed to complete registration');
                                    sys.exit(1);
                                }
                            } else {
                                console.log('Invalid activation link: ' + activation_link);
                                sys.exit(1);
                            }
                            found = 1;
                            break;
                        }
                    }
                }
                if (found) break;
                console.log('No email found, waiting 10 seconds');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }
})();