import ReviewCard from "./ReviewCard"
import pfp from "./assets/icon_grad.png"


const Reviews = () => {
  return (
    <>
    <div className="rateus" id="otzyvy">
        <h1>ЧТО ГОВОРЯТ О НАС</h1>
        <div className="reviewSect">
            <ReviewCard pfp={pfp} name={"Homunuculus"} subject={"English"} text={"Vunderkids is the best online school platform ever!!! The only problem is that I am depressed and need urgent help, but the school is amazing!!!!"} stars={4} date={"14.5.2024"}/>
            <ReviewCard name={"Yestay"} subject={"Maths"} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"} stars={3} date={"13.5.2024"}/>
            <ReviewCard pfp={""} name={"Talant"} subject={"Maths"} text={"Third time is a charm"} stars={3} date={"1.5.2024"}/>
            <ReviewCard></ReviewCard>
        </div>
    </div>
    </>
    
  )
}

export default Reviews