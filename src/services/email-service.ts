import sgMail from '@sendgrid/mail';
import { appConfig } from '../util/config';

sgMail.setApiKey(appConfig.sendgrid.apiKey);

// TODO: just use discord instead
export async function sendEmail(data: sgMail.MailDataRequired) {
  sgMail.send(data);
}