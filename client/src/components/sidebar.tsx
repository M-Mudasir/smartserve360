import { useEffect, useState } from 'react';
import styles from '../styles/sidebar.module.css'
import { Speedometer, ListDashes, CashRegister, TreasureChest, List, Users, HeadCircuit, ChefHat, SignOut } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
import { Divider, Tooltip } from '@mui/material';
import apiFetcher from '../helpers/api-fetcher';
import Cookies from 'js-cookie';
import logo from '../media/SmartServe360-Logo.png'
import person from '../media/person.png'

function Navbarr() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const router = useNavigate()
  

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      const JSONuser = JSON.parse(user)
      getStaff(JSONuser.id)
    }
  }, [])

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
  return (
    <div className={`${styles.sidebar}`} style={{ paddingTop: '0.4rem', maxHeight: '90vh', position: 'fixed' }}>
      <div className={`${styles.div}`}>
        <div className={`${styles.a}`}>
          <img className={`${styles.textWrapper}`} src={logo}></img>
        </div>
      </div>
      <div style={{ marginTop: role === 'staff' ? '5.5rem' : '4.5rem' }}>
        {
          role !== 'staff' && <>
            <div className='header'>ANALYSE</div>

            <div className='menuItem' onClick={() => { router('/') }} style={{ backgroundColor: window.location.pathname === '/' ? 'rgb(242 250 247)' : '' }}>
              <Speedometer size={20} weight="light" />
              <div className='ms-1'>Dashboard</div>
            </div>
            <div className='menuItem' onClick={() => { router('/agent') }} style={{ backgroundColor: window.location.pathname === '/agent' ? 'rgb(242 250 247)' : '' }}>
              <HeadCircuit size={20} weight="light" />
              <div className='ms-1'>AI agent</div>
            </div></>
        }

        <div className='header'>MANAGE</div>
        <div className='menuItem' onClick={() => { router('/menu-items') }} style={{ backgroundColor: window.location.pathname === '/menu-items' || window.location.pathname === '/menu-items/add-menu-item' || window.location.pathname === '/menu-items/add-deal' ? 'rgb(242 250 247)' : '' }}>
          <ListDashes size={20} weight="light" />
          <div className='ms-1'>Menu items</div>
        </div>
        <div className='menuItem' onClick={() => { router('/kitchen') }} style={{ backgroundColor: window.location.pathname === '/kitchen' ? 'rgb(242 250 247)' : '' }}>
          <ChefHat size={20} weight="light" />
          <div className='ms-1'>Kitchen</div>
        </div>
        <div className='menuItem' onClick={() => { router('/pos') }} style={{ backgroundColor: window.location.pathname === '/pos' ? 'rgb(242 250 247)' : '' }}>
          <CashRegister size={19} weight="light" />
          <div className='ms-1'>POS</div>
        </div>
        {
          role !== 'staff' && <>
            <div className='menuItem' onClick={() => { router('/inventory') }} style={{ backgroundColor: window.location.pathname === '/inventory' || window.location.pathname === '/inventory/add-inventory' ? 'rgb(242 250 247)' : '' }}>
              <TreasureChest size={19} weight="light" />
              <div className='ms-1'>Inventory</div>
            </div>
            <div className='menuItem' onClick={() => { router('/staff') }} style={{ backgroundColor: window.location.pathname === '/staff' || window.location.pathname === '/staff/add-staff' ? 'rgb(242 250 247)' : '' }}>
              <Users size={19} weight="light" />
              <div className='ms-1'>Staff</div>
            </div>
            <div className='menuItem' onClick={() => { router('/orders') }} style={{ backgroundColor: window.location.pathname === '/orders' ? 'rgb(242 250 247)' : '' }}>
              <List size={20} weight="light" />
              <div className='ms-1'>Orders</div>
            </div>
          </>}
      </div>
      <Divider></Divider>
      <div className={styles.userDiv}>
        <div className={styles.user}>
          <>
            <div className={` d-flex align-items-center mb-1`}>
              <img className={`${styles.profileImgJpg}`} src={person} alt='person'></img>
              <div className='d-flex flex-column justify-content-center ' style={{ gap: 0 }}>
                <Tooltip title={name}><p className='p-0 m-0'>{name?.length > 25 ? name?.slice(0, 24) + '...' : name}</p></Tooltip>
                <Tooltip title={email}><p className='p-0 m-0 text-secondary' style={{ fontSize: '13px' }}>{email?.length > 25 ? email?.slice(0, 24) + '...' : email}</p></Tooltip>
              </div>
            </div>
          </>
        </div>
        <Divider style={{ color: 'red', backgroundColor: 'grey', margin: '0.2rem 0.3rem 0 0.8rem' }}></Divider>
        {/* <div className='menuItem pt-0 mt-2 ms-1' onClick={handleLogout}>
          <SignOut size={19} weight="light" />
          <div className='ms-1'>Logout</div>
        </div> */}
      </div>


    </div>

  )
}

export default Navbarr