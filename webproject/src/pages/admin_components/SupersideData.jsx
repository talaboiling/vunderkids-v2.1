import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';

export const SupersideData = [
    {
        title: 'Школы',
        icon: <HomeIcon sx={{color:"white", fontSize:20}}/>,
        link: '/admindashboard'
    },
    {
        title: 'Все Студенты',
        icon: <SchoolIcon />,
        link: '/admindashboard/students'
    },
    {
        title: 'Задания',
        icon: <BarChartIcon />,
        link: '/adminddashboard/alltasks'
    }
]