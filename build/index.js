"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var typescript_1 = require("typescript");
var passgen = require('generate-password');
var randomMobile = require('random-mobile');
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var url_extract_regex, guerrillamail_url, response, email_addr, session_token, found, i, email, mail_body, activation_link, authCode, theCookie, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url_extract_regex = /\"(https:|http:|www\.)\S*\\"/gm;
                    guerrillamail_url = 'https://www.guerrillamail.com/ajax.php?';
                    console.log('Starting Gizmos Generator');
                    return [4 /*yield*/, axios_1.default.get(guerrillamail_url + 'f=get_email_address').then(function (response) { return response; })];
                case 1:
                    response = _a.sent();
                    email_addr = response.data.email_addr;
                    session_token = response.headers["set-cookie"][0].split(';')[0].split('=')[1];
                    console.log('Email: ' + email_addr, 'Session Token: ' + session_token);
                    console.log('Sending request to register Gizmos account');
                    return [4 /*yield*/, axios_1.default.post('https://services.explorelearning.com/platform/web/trial/signup/3?isFreemium=false', {
                            "email": email_addr,
                            "formInfo": {}
                        }).then(function (response) { return response; })];
                case 2:
                    response = _a.sent();
                    if (!response.data.MessageResponse) return [3 /*break*/, 16];
                    if (!response.data.MessageResponse.message.includes('Email sent to')) return [3 /*break*/, 16];
                    console.log('Successfully registered Gizmos account');
                    console.log('Waiting for email');
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 16];
                    found = 0;
                    return [4 /*yield*/, axios_1.default.get(guerrillamail_url + 'f=check_email&seq=0&email=' + email_addr + '&sid_token=' + session_token).then(function (response) { return response; })];
                case 4:
                    response = _a.sent();
                    if (!(response.data.list.length > 0)) return [3 /*break*/, 14];
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < response.data.list.length)) return [3 /*break*/, 14];
                    if (!response.data.list[i].mail_from.includes('explorelearning')) return [3 /*break*/, 13];
                    return [4 /*yield*/, axios_1.default.get(guerrillamail_url + 'f=fetch_email&email_id=' + response.data.list[i].mail_id + '&sid_token=' + session_token).then(function (response) { return response.data; })];
                case 6:
                    email = _a.sent();
                    mail_body = email.mail_body;
                    activation_link = mail_body.split('href="')[1].split('"')[0];
                    if (!(activation_link.includes('http') && activation_link.includes('explorelearning.com'))) return [3 /*break*/, 11];
                    console.log('Found activation link: ' + activation_link);
                    return [4 /*yield*/, axios_1.default.get(activation_link).then(function (response) { return response; }).catch(function (error) {
                            console.log('Failed to get activation link. error = ' + error);
                            typescript_1.sys.exit(1);
                        })];
                case 7:
                    response = _a.sent();
                    authCode = response.request.res.responseUrl.split('/').pop();
                    console.log('Found auth code: ' + authCode);
                    console.log('Sending request validate Gizmos account');
                    return [4 /*yield*/, axios_1.default.options('https://services.explorelearning.com/platform/web/validate/' + authCode).then(function (response) { return response; }).catch(function (error) {
                            console.log('Failed to validate code. error = ' + error);
                            console.log('responce = ' + JSON.stringify(error.response.data));
                            typescript_1.sys.exit(1);
                        })];
                case 8:
                    response = _a.sent();
                    theCookie = response.headers["set-cookie"];
                    console.log('Sending request to activate Gizmos account');
                    password = passgen.generate({
                        length: 10,
                        numbers: true,
                        symbols: true,
                        uppercase: true
                    });
                    console.log('Generated password: ' + password);
                    return [4 /*yield*/, axios_1.default.post('https://services.explorelearning.com/platform/web/trial/register?productID=3&regCode=' + authCode, {
                            email: email_addr,
                            //TODO: Request name/email from user
                            firstName: 'Lima',
                            lastName: 'Smith',
                            password: password,
                            titleID: "",
                            username: "gizgen" + Math.random().toString().slice(2, 10)
                        }, {
                            headers: {
                                'Cookie': theCookie,
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "en-US,en;q=0.9",
                                "content-type": "application/json;charset=UTF-8",
                                'Origin': 'https://apps.explorelearning.com',
                                'Referer': 'https://apps.explorelearning.com/'
                            }
                        }).then(function (response) { return response; }).catch(function (error) {
                            console.log('Failed to register account. error = ' + error);
                            console.log('sent url = ' + 'https://services.explorelearning.com/platform/web/trial/register?productID=3&regCode=' + authCode);
                            console.log('responce = ' + JSON.stringify(error.response.data));
                            typescript_1.sys.exit(1);
                        })];
                case 9:
                    response = _a.sent();
                    console.log('Successfully activated Gizmos account, completeing registration');
                    return [4 /*yield*/, axios_1.default.post('https://services.explorelearning.com/platform/web/trial/complete?productID=3&regCode=' + authCode, {
                            "firstName": 'Gizmos',
                            "lastName": 'Generator',
                            "email": email_addr,
                            "phone": Math.random().toString().slice(2, 12),
                            "phoneExt": null,
                            "promoCode": null,
                            "schoolInfo": {
                                "countryCode": "USA",
                                "gradeLevels": "9",
                                "parentPid": null,
                                "pid": "149864",
                                "schoolCount": null,
                                "schoolType": "public",
                                "stateCode": "CO",
                                "studentCount": null,
                                "teacherCount": null,
                                "unknownName": null,
                                "titles": "Teacher",
                                "zip": "80132"
                            },
                            "formInfo": {}
                        }).then(function (response) { return response; }).catch(function (error) {
                            console.log('Failed to get activation link. error = ' + error);
                            typescript_1.sys.exit(1);
                        })];
                case 10:
                    response = _a.sent();
                    if (response.status != 200) {
                        console.log('Failed to complete registration');
                        typescript_1.sys.exit(1);
                    }
                    return [3 /*break*/, 12];
                case 11:
                    console.log('Invalid activation link: ' + activation_link);
                    typescript_1.sys.exit(1);
                    _a.label = 12;
                case 12:
                    found = 1;
                    return [3 /*break*/, 14];
                case 13:
                    i++;
                    return [3 /*break*/, 5];
                case 14:
                    if (found)
                        return [3 /*break*/, 16];
                    console.log('No email found, waiting 10 seconds');
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 16: return [2 /*return*/];
            }
        });
    });
})();
