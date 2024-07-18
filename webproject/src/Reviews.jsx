import ReviewCard from "./ReviewCard"
import { useTranslation } from "react-i18next";
import pfp1 from "./assets/pfp1.jpg"
import pfp2 from "./assets/pfp2.jpg"
import pfp3 from "./assets/pfp3.jpg"

const Reviews = () => {
  const { t } = useTranslation();
  return (
    <>
    <div className="rateus" id="otzyvy">
        <h1>{t ('eachReview')}</h1>
        <div className="reviewSect">
            <ReviewCard pfp={pfp1} 
                        name={"Akyldy Aliyeva"} 
                        subject={"Maths"} 
                        text={"У меня есть два ребенка и они оба пользуются платформой Вундеркидс. Скажу честно, с тех пор как я им предоставила это приложение, их академические навыки заметно улучшились! 10/10!!!"} 
                        stars={5} 
                        date={"1.5.2024"}/>
            <ReviewCard 
                        pfp={pfp2}
                        name={"Тахир Бергалиев"} 
                        subject={"Maths"} 
                        text={"Платформа помагает мне развиваться и в то же время играть в игры! Мне очень нравится материал, ведь он легко осваивается"} 
                        stars={4} 
                        date={"13.5.2024"}
            />
            <ReviewCard 
                        pfp={pfp3} 
                        name={"Kassymkhan Amangeldi"} 
                        subject={"English"} 
                        text={"Vunderkids is the best online school platform ever!!! The only problem is that I am depressed and need urgent help, but the school is amazing!!!!"} 
                        stars={5} 
                        date={"14.5.2024"}
            />
        </div>
    </div>
    </>
    
  )
}

export default Reviews