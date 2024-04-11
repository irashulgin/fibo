const nodemailer = require("nodemailer");

const UserModel = require("../models/user-model");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // type: "OAuth2",
        user: process.env.SMTP_USER,
        pass:'colm umxe zhdl cxqq',
        //   pass: 'lvcw cnfa tqli bptw',
        // clientId:
          // "746570733082-92bct0tihfe3hqahj4og8ucqk0133f74.apps.googleusercontent.com",
        // clientSecret: "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",
        // access_token: "ya29.a0AfB_byD27e-6_J-84AdpT0bjMTVDRcxzhFba2Qd8HXrG2BtznjuBNng4OsmJQRYcQgD5L762ZSr3jIkj5QQqHbhzcjk48w-4isrDAHO66cpjXT7DxLWpK8Y73E9jxjbRFn78BYLQhJS2hh8-nLZ0ObAXkNRutaShyvMTaCgYKAfkSARMSFQHGX2MiSwzwSPPn2mgVzA9AZ0U28g0171", 
        // refreshToken:
          // "071//04Ix0j24XXBGICgYIARAAGAQSNwF-L9IrUnCAN6BumMOnsvMan5YEV21Gb041TAKmhDbD8j0iZInf6ASY_YJaZ1jn5JepYfAisEE",
      },
      // secureConnection: false,
      // tls: {rejectUnauthorized: true},
      // host: process.env.SMTP_HOST,
      // port: process.env.SMTP_PORT,
      // service: 'gmail',
      // auth: {
      //     user: process.env.SMTP_USER,
      //     pass: 'lvcw cnfa tqli bptw'//process.env.SMTP_PASSWORD
      // },
      // secure: true
    });
  }
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: "Activation of account to " + process.env.API_URL,
      text: "",
      html: `<div>
                <h1> For activation press <a href="${link}">${link}</a></h1>
            </div>`,
    });
  }
  async sendInvitationMail(to, link) {
    await this.transporter.sendMail({
      from:  process.env.SMTP_USER,
      to: to,
      subject: 'Invitation to the App',
      text: `Click the following link to accept the invitation: ${link}`,
    })
  }
  async sendResetMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: "Reset password to account " + process.env.API_URL,
      text: "",
      html: `<div>
                <h1> For reset press <a href="${link}">${link}</a></h1>
            </div>`,
    });
  }
}

module.exports = new MailService();
