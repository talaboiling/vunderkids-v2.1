import logo from "./assets/NAV_LOGO.png"
function Footer() {
    return (
        <footer id="contakty">
            <img src={logo} alt="logo" />
            <p style={{color:"white"}}>&copy; {new Date().getFullYear()} Vunderkids</p>
        </footer>
    );
}

export default Footer;