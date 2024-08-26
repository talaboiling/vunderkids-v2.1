import whatsappicon from "../assets/whatsapp-social-media-svgrepo-com.svg"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Socials = () => {
  return (
    <div className="contain">
        <div className='socialLinks'>
            <a href="https://wa.me/77753037432?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%92%D1%83%D0%BD%D0%B4%D0%B5%D1%80%D0%BA%D0%B8%D0%B4%D1%81.">
                <img src={whatsappicon} alt="whatsapp" className="socialIcon"/>
            </a>
            <a href="#top1" style={{width:"100px", height:"100px", borderRadius:"50%", backgroundColor:"#ccc", color:"black", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <KeyboardArrowUpIcon sx={{fontSize:"50px"}}/>
            </a>
        </div>
    </div>
  )
}

export default Socials