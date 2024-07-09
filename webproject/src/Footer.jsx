import logo from "./assets/NAV_LOGO.png"
function Footer() {
    return (
        <footer id="contakty">
            <div className="footer">
                <div>
                    <img src={logo} alt="logo" />
                    <p style={{color:"white"}}>&copy; {new Date().getFullYear()} Vunderkids</p>
                </div>
                <p className="rev" style={{color:"white"}}>Наши контакты: +7 775 303 7432</p>
            </div>
        </footer>
    );
}

export default Footer;