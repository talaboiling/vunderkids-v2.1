import ReviewCard from "./ReviewCard";
import { useTranslation } from "react-i18next";
import pfp1 from "./assets/takhir.svg";
import pfp2 from "./assets/azamat.svg";
import pfp3 from "./assets/asem.svg";

const Reviews = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="rateus" id="otzyvy">
        <h1 className="mob-none">{t ('eachReview')}</h1>
        <h1 className="mob-display" style={{lineHeight: "40px"}}>{t ('eachReview')}</h1>
        <div className="reviewSect">
          <ReviewCard
            pfp={pfp3}
            name={"Асем Анарбаева"}
            subject={"Maths"}
            // text={
            //   "Мне очень нравится что можно соревноваться с друзьями. Весь прошлый месяц, я была на первом месте!!"
            // }
            text={
              "Маған достарыммен жарысу өте қатты ұнайды. Өткен ай бойы мен бірінші орында болдым!!"
            }
            stars={5}
            date={"1.5.2024"}
          />
          <ReviewCard
            pfp={pfp1}
            name={"Тахир Бергалиев"}
            subject={"Maths"}
            // text={
            //   "Платформа помагает мне развиваться и в то же время играть в игры! Мне очень нравится материал, ведь он легко осваивается"
            // }
            text={
              "Бұл платформада оқу дағдаларымды дамыта отырып, ойындар ойнауға болады екен! Оқу материалдары жеңіл жатталғаны қатты ұнады"
            }
            stars={5}
            date={"13.5.2024"}
          />
          <ReviewCard
            pfp={pfp2}
            name={"Азамат Қасенов"}
            subject={"English"}
            // text={
            //   "Задачи интересные, благодаря Вундеркидс, я смог подготовится к школе "
            // }
            text={
              "Тапсырмалар қызықты екен. Вундеркидс платформасының арқасында мектепке дайын болдым"
            }
            stars={5}
            date={"14.5.2024"}
          />
        </div>
      </div>
    </>
  );
};

export default Reviews;
