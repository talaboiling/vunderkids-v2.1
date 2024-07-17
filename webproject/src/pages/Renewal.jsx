import logoImg from "/src/assets/logo_blue.png";
const Renewal = () => {
  return (
    <div className="regacss">
        <div className='renewPage'>
            <div className='regform'>
                <img src={logoImg} alt='logo' className="navLogo"/>
                <h2 style={{animation:"none"}}>Восстановление пароля</h2>
                <form className="registrationInput">
                    <label htmlFor='email'>Введите свой Email</label>
                    <input type='email' name='email' id='email' placeholder="email@example.com"/>
                    <button type='submit' style={{maxWidth:"200px", marginTop:"20px"}}>Отправить</button>
                </form>
            </div>
    </div>
    </div>
  )
}

export default Renewal