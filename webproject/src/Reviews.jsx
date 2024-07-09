import ReviewCard from "./ReviewCard"
import pfp from "./assets/icon_grad.png"
import { useTranslation } from "react-i18next";


const Reviews = () => {
  const { t } = useTranslation();
  return (
    <>
    <div className="rateus" id="otzyvy">
        <h1>{t ('eachReview')}</h1>
        <div className="reviewSect">
            <ReviewCard 
                        pfp={pfp} 
                        name={"Kassymkhan Amangeldi"} 
                        subject={"English"} 
                        text={"Vunderkids is the best online school platform ever!!! The only problem is that I am depressed and need urgent help, but the school is amazing!!!!"} 
                        stars={4} 
                        date={"14.5.2024"}
            />
            <ReviewCard name={"Yestay"} 
                        subject={"Maths"} 
                        text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."} 
                        stars={3} 
                        date={"13.5.2024"}
            />
            <ReviewCard pfp={""} name={"Talant"} subject={"Maths"} text={"Third time is a charm"} stars={3} date={"1.5.2024"}/>
        </div>
    </div>
    </>
    
  )
}

export default Reviews