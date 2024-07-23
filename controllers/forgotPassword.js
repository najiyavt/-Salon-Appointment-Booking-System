const User = require('../models/user');
const ForgotPasswordRequests = require('../models/ForgotPasswordRequests'); // Adjust model name as per your setup
const bcrypt = require('bcrypt');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const requestId = uuidv4();
        await ForgotPasswordRequests.create({ id: requestId, isActive: true, userId: user.id });

        const sender = { email: 'dummy@example.com' }; // Update with your email
        const receivers = [{ email }];
        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Your Password',
            htmlContent: `<a href="http://localhost:3000/password/reset/${requestId}">Reset your password</a>`
        });

        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error('Failed to send reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
};

exports.resetPassword = async (req, res) => {
    const { id } = req.params;
    try {
        const passwordRequest = await ForgotPasswordRequests.findOne({ where: { id, isActive: true } });
        if (!passwordRequest) {
            return res.status(400).json({ error: 'Invalid or expired reset link' });
        }
        res.send(`
            <html>
                <form action='/password/update/${id}' method='post'>
                    <label for='newPassword'>Enter New Password</label>
                    <input type='password' name='newPassword' required>
                    <button type='submit'>Reset Password</button>
                </form>
            </html>
        `);
    } catch (error) {
        console.error('Failed to reset password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

exports.updatePassword = async (req, res) => {
    
    try {
        const newPassword = req.body.newPassword; // Assuming newPassword is sent in the request body
        const requestId = req.params.id;

        const passwordDetails = await ForgotPasswordRequests.findOne({ where: { id: requestId } });
        if (!passwordDetails || !passwordDetails.isActive) {
            return res.status(400).json({ error: 'Invalid or expired reset link' });
        }

        const user = await User.findOne({ where: { id: passwordDetails.userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.update({ password: hashedPassword });

        // Invalidate the password reset request
        await ForgotPasswordRequests.update({ isActive: false }, { where: { id: requestId } });

        res.status(200).json({ message: 'Password updated successfully' });
     } catch (error) {
        console.error('Failed to update password:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
