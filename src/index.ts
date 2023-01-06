import {
  chromium
} from '@playwright/test';
import axios, {
  AxiosResponse
} from 'axios';
import {uniqueNamesGenerator, names} from 'unique-names-generator';
import generatepassword from 'generate-password';
import {
  sys
} from 'typescript';

(async () => {
  const url_extract_regex: RegExp = /\"(https:|http:|www\.)\S*\\"/gm;
  const guerrillamail_url: string = 'https://www.guerrillamail.com/ajax.php?';
  console.log('Starting Gizmos Generator');
  var response: AxiosResponse = await axios.get(guerrillamail_url + 'f=get_email_address').then((response: AxiosResponse) => response);
  var email_addr: string = response.data.email_addr;
  var session_token: string = (response.headers["set-cookie"] as string[])[0].split(';')[0].split('=')[1];
  console.log('Email: ' + email_addr, 'Session Token: ' + session_token);
  console.log('Starting virtual browser');
  const browser = await chromium.launch({
      headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://apps.explorelearning.com/account/gizmos/trial');
  console.log('Opened Page');
  await page.getByRole('textbox', {
      name: 'Email Address'
  }).click();
  await page.getByRole('textbox', {
      name: 'Email Address'
  }).fill(email_addr);
  await page.locator('.v-input--selection-controls__ripple').click();
  await page.getByRole('button', {
      name: 'Submit'
  }).click();
  await page.locator('#emailSent i').click();
  console.log('Registered, waiting for email');
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
                      console.log('Activation link: ' + activation_link);
                      var fname: string = uniqueNamesGenerator({
                        dictionaries: [names]
                      }).replace(" ", "");
                      var lname: string = uniqueNamesGenerator({
                        dictionaries: [names]
                      }).replace(" ", "");
                      var username: string = "gizgen" + Math.random().toString().substring(2, 7);
                      var phone: string = Math.random().toString().substring(2, 12);
                      var password: string = generatepassword.generate({
                        length: 10,
                        numbers: true,
                        symbols: true,
                        uppercase: true,
                        strict: true
                      });
                      console.log('First Name: ' + fname, ', Last Name: ' + lname);
                      console.log('Phone: ' + phone);
                      await page.goto(activation_link);
                      await page.getByRole('textbox', {
                          name: 'First Name'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'First Name'
                      }).fill(fname); //first
                      await page.getByRole('textbox', {
                          name: 'Last Name'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'Last Name'
                      }).fill(lname); //last
                      await page.getByRole('textbox', {
                          name: 'Phone Number'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'Phone Number'
                      }).fill(phone); //phone
                      await page.getByRole('textbox', {
                          name: 'Username'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'Username'
                      }).fill(username); //username
                      await page.getByRole('textbox', {
                          name: 'Password'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'Password'
                      }).fill(password); //password
                      await page.getByRole('button', {
                          name: 'Next'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'ZIP/Postal Code'
                      }).click();
                      await page.getByRole('textbox', {
                          name: 'ZIP/Postal Code'
                      }).fill('80132'); //zip code
                      await page.getByRole('combobox', {
                          name: 'Institution'
                      }).click();
                      await page.locator('a').filter({
                          hasText: 'LEWIS-PALMER HIGH SCHOOL'
                      }).click(); //must be all caps, must be exact
                      await page.locator('.v-select__selections').first().click();
                      await page.getByText('check_box_outline_blankTeacher').click(); //set teacher role
                      await page.locator('div:nth-child(3) > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections').click();
                      await page.getByText('check_box_outline_blankGrade 9').click(); // select grade 9
                      await page.locator('.flex > .elevation-24').click();
                      await page.getByRole('button', {
                          name: 'Submit'
                      }).click();
                      await page.getByText('Welcome to ExploreLearning!').click();
                      console.log('Activated');
                      console.log('--------------------------------------------------');
                      console.log('Username: ' + username, ', Password: ' + password);
                  } else {
                      console.log('Invalid activation link: ' + activation_link);
                      console.log('Unable to proceed, exiting')
                      await context.close();
                      await browser.close();
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
  await context.close();
  await browser.close();
})();