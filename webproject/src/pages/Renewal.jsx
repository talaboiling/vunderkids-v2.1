import logoImg from "/src/assets/logo_blue.png";
import { useTranslation } from "react-i18next";
const Renewal = () => {
  const { t } = useTranslation();
  return (
    <div className="regacss">
        <div className='renewPage'>
            <div className='regform'>
                <img src={logoImg} alt='logo' className="navLogo"/>
                <h2 style={{animation:"none"}}>{t ('passwordRenewal')}</h2>
                <form className="registrationInput">
                    <label htmlFor='email'>{t ('pleaseWriteEmail')}</label>
                    <input type='email' name='email' id='email' placeholder="email@example.com"/>
                    <button type='submit' style={{maxWidth:"200px", marginTop:"20px"}}>{t ('send')}</button>
                </form>
            </div>
    </div>
    </div>
  )
}

export default Renewal