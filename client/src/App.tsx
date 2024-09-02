import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarr from './components/sidebar';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Import BrowserRouter
import Login from './pages/login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import PrivateRoute from './PrivateRoute';
import Bot from './components/bot';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import MenuCard from './pages/menu-card/menu-card';
import { userLogout } from './slices/loginSlice';
import { Bell, Power, Chat } from "@phosphor-icons/react";
import styles from './styles/header.module.css'
import apiFetcher from './helpers/api-fetcher';
import lowstock from './media/Vector.png'
import expiry from './media/expiry.png'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie';
import person from './media/person.png'
import headerStyles from './styles/sidebar.module.css'
interface Notification {
  title: string;
  message: string;
}

function App() {
  const currentUser = useSelector((state: RootState) => state.login.currentUser);
  const currentUserRole = useSelector((state: RootState) => state.login.role);
  const [Open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false)
  const location = window.location.pathname
  const [role, setRole] = useState<string>('')
  const [notification, setNotification] = useState<Notification[]>()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const dispatch = useDispatch();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toggleDiv = () => {
    setOpen(!Open);
  };
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
  useEffect(() => {
    if (scroll) {
      scrollToBottom();
    }
    setScroll(false)
  }, [scroll])

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  };
  const handleLogout = () => {
    dispatch(userLogout());
  }
  async function fetchNotifications() {
    const response = await apiFetcher.get('notification')
    setNotification(response)
  }
  const getStaff = async (id: number) => {
    try {
      const data = await apiFetcher.get(`users/${id}`)
      setRole(data?.role)
      setName(data?.fullName)
      setEmail(data?.email)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <BrowserRouter>
        <div className="App">
          {
            currentUser ?
              <>
                {/* {
                  location !== '/menu-card' && <Header></Header>
                } */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: "3%", top: "4.5%" }}>
                    <span style={{ color: '#55b896', fontWeight: 'bold' }}>SmartServe360</span>
                  </div>
                  <div style={{ position: 'absolute', right: "3%", top: "2%", display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <IconButton onClick={() => setShow(!show)} className='p-1 mt-3 pt-0'><Bell size={24} color="#58a188" weight="fill" /></IconButton>
                    <IconButton onClick={handleLogout} className='p-1 mt-3 pt-0'><Power size={26} color="#58a188" weight="regular" /></IconButton>
                    <Navbar expand="lg" className={`${styles.sidebarSmall} bg-body-tertiary`}>
                      <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                          <Nav className="me-auto" style={{ zIndex: "1000000000000", backgroundColor: 'white', position: 'absolute', right: '10%', top: '92%' }} >
                            <>
                              <div className={` d-flex align-items-center mb-1 p-1 pt-3`}>
                                <img className={`${headerStyles.profileImgJpg}`} src={person} alt='person'></img>
                                <div className='d-flex flex-column justify-content-center ' style={{ gap: 0 }}>
                                  <Tooltip title={name}><p className='p-0 m-0'>{name?.length > 25 ? name?.slice(0, 24) + '...' : name}</p></Tooltip>
                                  <Tooltip title={email}><p className='p-0 m-0 text-secondary' style={{ fontSize: '13px' }}>{email?.length > 25 ? email?.slice(0, 24) + '...' : email}</p></Tooltip>
                                </div>
                              </div>
                            </>
                            {
                              role !== 'staff' && <>
                                <div className='header mt-2 mb-1'>ANALYSE</div>
                                <Nav.Link href="/" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/' ? 'rgb(242 250 247)' : '' }}>Dashboard</Nav.Link>
                                <Nav.Link href="/agent" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/agent' ? 'rgb(242 250 247)' : '' }}>
                                  AI agent
                                </Nav.Link>
                              </>}
                            <div className='header'>MANAGE</div>
                            <Nav.Link href="/menu-items" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/menu-items' ? 'rgb(242 250 247)' : '' }}>
                              Menu Items
                            </Nav.Link>
                            <Nav.Link href="/Kitchen" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/Kitchen' ? 'rgb(242 250 247)' : '' }}>
                              Kitchen
                            </Nav.Link>
                            <Nav.Link href="/pos" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/pos' ? 'rgb(242 250 247)' : '' }}>
                              POS
                            </Nav.Link>
                            {
                              role !== 'staff' && <>
                                <Nav.Link href="/inventory" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/inventory' ? 'rgb(242 250 247)' : '' }}>
                                  Inventory
                                </Nav.Link>
                                <Nav.Link href="/staff" className='menuItem mt-1 me-3 ps-1' style={{ backgroundColor: window.location.pathname === '/staff' ? 'rgb(242 250 247)' : '' }}>
                                  Staff
                                </Nav.Link>
                                <Nav.Link href="/orders" className='menuItem mt-1 me-3 ps-1 mb-2' style={{ backgroundColor: window.location.pathname === '/orders' ? 'rgb(242 250 247)' : '' }}>
                                  Orders
                                </Nav.Link>
                              </>
                            }
                          </Nav>
                        </Navbar.Collapse>
                      </Container>
                    </Navbar>
                  </div>
                </div>
                {
                  show &&
                  <div className={styles.menu}>
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
                  </div>
                }


                <div className="content d-flex " style={{ width: '100%' }}>
                  <div> {
                    location !== '/menu-card' && <Navbarr></Navbarr>

                  }</div>
                  <div ref={chatContainerRef} className='mainContainer' style={{ maxWidth: location === '/menu-card' ? '100%' : '80%', marginLeft: location === '/menu-card' ? 0 : '17rem', marginTop: location === '/menu-card' ? 0 : '4rem' }}>
                    <Routes>
                      <Route path='/*' element={<PrivateRoute setScroll={setScroll} currentUserRole={currentUserRole} />} />
                      <Route path="/login" element={<Navigate to='/' />} />
                      <Route path="/menu-card" element={<MenuCard />} />

                    </Routes>
                    {
                      Open && <Bot bot={'adminBot'} isOpen={Open} setIsOpen={setOpen}></Bot>
                    }
                  </div>

                </div>
                {
                  location !== '/pos' &&
                  <div className='chatButton'>
                    <div className='Button'>
                      <div className='helperText'>Need help?</div>
                      <IconButton onClick={toggleDiv} style={{ color: 'white' }}><Chat size={28} color="white" weight="fill" /></IconButton></div>
                  </div>
                }

              </> :
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/menu-card" element={<MenuCard />} />
                <Route path="*" element={<Navigate to='/login' />} />
              </Routes>
          }
        </div>
      </BrowserRouter >
    </div >
  );
}

export default App;
