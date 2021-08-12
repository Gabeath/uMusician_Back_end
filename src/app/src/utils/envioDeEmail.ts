import emailService from '@app/config/email';

const sendResetPasswordMail = async (name: string, to: string, codigo: string) : Promise<void> => {
  const email = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Recuperação de senha - uMusician',
    text: `Olá ${name}, notamos que você solicitou a redefinição de senha. O código para prosseguir com 
      a solicitação é ${codigo}. Não compartilhe! Se não foi você, ignore esta mensagem.`,
    html: `
          <h2> Olá, ${name} </h2>
          <p> notamos que você solicitou a redefinição de senha. O código para prosseguir com 
          a solicitação é ${codigo} </p>
          
          <p>Não compartilhe! Se não foi você, <strong> ignore esta mensagem <strong>.</p>
      `
  };
  await emailService.sendMail(email);
};

export {sendResetPasswordMail};