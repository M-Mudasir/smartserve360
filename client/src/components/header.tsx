import styles from '../styles/header.module.css'
import { useDispatch } from 'react-redux';
import { userLogout } from '../slices/loginSlice';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Divider, IconButton, Tooltip } from '@mui/material';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import lowstock from '../media/Vector.png'
// import addedGreenIcon from '../media/Vector_green.png'
import expiry from '../media/expiry.png'
import apiFetcher from "../helpers/api-fetcher";
import { useEffect, useState } from 'react';
import person from '../media/person.png'
import Cookies from 'js-cookie';

interface Notification {
    title: string;
    message: string;
}


function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [notification, setNotification] = useState<Notification[]>()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = searchParams.get('id');
    const [role, setRole] = useState<string>('Staff')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const handleLogout = () => {
        dispatch(userLogout());
        navigate('/login')
    }
    useEffect(() => {
        const user = Cookies.get('user');
        if (user) {
            const JSONuser = JSON.parse(user)
            getStaff(JSONuser.id)
        }


    }, [])

    useEffect(() => {
        fetchNotifications();

        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);
    const getStaff = async (id: number) => {
        try {
            const data = await apiFetcher.get(`users/${id}`)
            setName(data?.fullName)
            setEmail(data?.email)
            setRole(data?.role)
        } catch (e) {
            console.error(e)
        }
    }
    async function fetchNotifications() {
        const response = await apiFetcher.get('notification')
        setNotification(response)
    }

    return (
        <div className={`${styles.headerHeader}`}>

            <div className={`${styles.div}`}>
                <div className={`${styles.a}`}>
                    <div className={`${styles.textWrapper}`}>SMARTSERVE360</div>
                </div>
            </div>

            <div className={`${styles.ul}`}>

                <Dropdown style={{ position: 'relative' }}>
                    <Dropdown.Toggle className={styles.toggle} >
                        <IconButton>
                            <NotificationsNoneIcon></NotificationsNoneIcon>
                        </IconButton>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.menu}>
                        <div className={styles.header}>Notifications</div>
                        <div className={styles.notifInner}>
                            {notification && notification.length > 0 &&
                                notification.map((notif, index) => (
                                    <div key={index}>
                                        <div className={`d-flex ${styles.notification}`}>
                                            <div className={`d-flex ${styles.titleDiv}`}>
                                                <img src={notif.title === 'Low stock alert' ? lowstock : expiry} alt='icon' className={` ${styles.titleImage}`}></img>
                                                <div className={` ${styles.title}`}>{notif.title}</div>
                                            </div>
                                            <div className={`${styles.message}`}>{notif.message}</div>

                                        </div>
                                        <Divider style={{ backgroundColor: "grey", margin: '0 0.5rem 0 0.5rem' }}></Divider>
                                    </div>

                                ))
                            }</div>
                    </Dropdown.Menu>
                </Dropdown>

                <div className={``}>

                    <Dropdown>
                        <Dropdown.Toggle className={styles.toggle} >
                            <img
                                alt="Profile img jpg"
                                className={`${styles.profileImgJpg}`}
                                src={person}
                            />
                            <div className={``} style={{ color: 'black' }}>{name}</div>


                        </Dropdown.Toggle>

                        <Dropdown.Menu className={styles.userMenu}>
                            <div className={` d-flex align-items-center mb-2`}>
                                <img className={`${styles.profileImgJpg}`}
                                    src={person} alt='person'></img>
                                <div className='d-flex flex-column justify-content-center' style={{ gap: 0 }}>
                                    <Tooltip title={name}><p className='p-0 m-0'>{name?.length > 25 ? name?.slice(0, 24) + '...' : name}</p></Tooltip>
                                    <Tooltip title={email}><p className='p-0 m-0 text-secondary' style={{ fontSize: '13px' }}>{email?.length > 25 ? email?.slice(0, 24) + '...' : email}</p></Tooltip>
                                </div>
                            </div>
                            <Divider color='secondary' className='mt-4 mb-2'></Divider>
                            <Dropdown.Item > <div onClick={handleLogout}>Logout</div></Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>

                </div>
                <div className={`${styles.bar}`}>bar</div>
            </div>
        </div>
    )
}

export default Header