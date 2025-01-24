import User from './user';
import sgMail from '@sendgrid/mail';

const GenerateResetToken = async (userId: number) => {
    const token = crypto.randomUUID();
    const user = await User.updateOne({ _id: userId }, { passwordResetToken: token });
    if (!user) {
        return null;
    }
    return token;
}

const RemoveResetToken = async (userId: number) => {
    const user = await User.updateOne({ _id: userId }, { passwordResetToken: null });
    if (!user) {
        return null;
    }
    return true;
}

const SendVerifMail = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        return false;
    }
    const token = await GenerateResetToken(user.id);
    if (!token) {
        return false;
    }
    sgMail.setApiKey(process.env.SENDGRID?.toString() || '');
    const msg = {
        to: email,
        from: "manamon@manamon-archi-d.com",
        subject: 'Réinitialisation du mot de passe',
        text: `Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: http://localhost:5000/reset-password/${token}`, // TODO IP
    }
    sgMail
      .send(msg)
      .then(() => {
        return true;
      })
      .catch((error) => {
          console.error(error);
          return false;
      })
}

export default SendVerifMail;