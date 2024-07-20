import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import cups from "../assets/sidecup.png"
import cert from "../assets/sideachieve.png"
import prog from "../assets/sideprog.png"
import game from "../assets/sidegame.png"

export const SidebarData = [
    {
        title: 'Главная',
        icon: <HomeIcon sx={{color:"white", fontSize:50}}/>,
        link: '/dashboard'
    },
    {
        title: 'Рейтинг',
        icon: <img src={cups} alt="achievements" />,
        link: '/dashboard/rating'
    },
    {
        title: 'Сертификаты',
        icon: <img src={cert} alt="certificates" />,
        link: '/dashboard/lessons'
    },
    {
        title: 'Прогресс',
        icon: <img src={prog} alt="progress" />,
        link: '/dashboard/progress'
    },
    {
        title: 'Игры',
        icon: <img src={game} alt="games" />,
        link: '/dashboard/games'
    },
    // {
    //     title: 'Подписки',
    //     icon: <SubscriptionsIcon/>,
    //     link: '/subscriptions'
    // }
]

