const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

const forgotPassword = (mail) => {
    sgMail.send({
        to: mail,
        from: 'bankebihariagrawal58@gmail.com',
        subject: 'New Password',
        text: 'Click on this button and reset your password',
        html: '<a href="localhost:3000/updatePassword"><button>Forgot Password</button></a>'
    })
}

module.exports = { forgotPassword }