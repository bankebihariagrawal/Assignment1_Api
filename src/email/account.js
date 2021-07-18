const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.sendgridApi)

const forgotPassword = (mail) => {
    sgMail.send({
        to: mail,
        from: 'bankebihariagrawal58@gmail.com',
        subject: 'New Password',
        text: 'Click on this button and reset your password',
        html: '<button>Reset Password</button>'
    })
}

module.exports = { forgotPassword }