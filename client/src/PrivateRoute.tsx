import React, { SetStateAction, Dispatch, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages';
import Inventory from './pages/inventory';
import AddInventory from './pages/addInventory';
import Menu from './pages/menu-items';
import AddMenu from './pages/menu-items/add-menuitem';
import AddStaff from './pages/staff/add-staff';
import Staff from './pages/staff';
import Error from './pages/Error';
import POS from './pages/pos/pos';
import Vendor from './pages/vendor';
import DispatchOrder from './pages/vendor/dispatch-order';
import CustomModal from './pages/vendor/progress-mode';
import Orders from './pages/orders';
import Porcurment from './pages/porcurment';
import AddPorcurment from './pages/addPorcurment';
import Agent from './pages/agent'
import { useLocation, Navigate } from 'react-router-dom';
import MenuCard from './pages/menu-card/menu-card';
import AddDeal from './pages/menu-items/add-deal/add-deal';
import Kitchen from './pages/kitchen';
import Cookies from 'js-cookie';
import { userLogout } from './slices/loginSlice';
import { useDispatch } from 'react-redux';

interface PrivateRouteProps {
  currentUserRole: string;
  setScroll: Dispatch<SetStateAction<boolean>>;
}

const PrivateRoute = ({ currentUserRole, setScroll }: PrivateRouteProps) => {
  // Define the routes based on the currentUserRole
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>('Menu Items');
  const AccessToken = Cookies.get('accessToken')
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
  }
  if (AccessToken === undefined) {
    handleLogout()
  }

  if (currentUserRole === 'staff' && (location.pathname === '/' || location.pathname === '/agent' || location.pathname === '/inventory' || location.pathname === '/staff' || location.pathname === '/orders'
  )) {
    return <Navigate to="/pos" />;
  }
  const roleBasedRoutes = () => {
    if (currentUserRole === 'Vendor') {
      return (
        <>
          <Route path='/vendor' element={<Vendor />} />
          <Route path='/vendor/dispatch-order' element={<DispatchOrder />} />
          <Route path='/vendor/progress-mode' element={<CustomModal />} />
          <Route path='*' element={<Error />} />
          {/* <Route path='/menu-card' element={<MenuCard />} /> */}
        </>
      );
    } else {
      return (
        <>
          <Route path='/' element={<Home />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventory/add-inventory' element={<AddInventory />} />
          <Route path='/procurement' element={<Porcurment />} />
          <Route path='/procurement/add-procurement' element={<AddPorcurment />} />
          <Route path='/menu-items' element={<Menu currentTab={currentTab} setCurrentTab={setCurrentTab} />} />
          <Route path='/menu-items/add-menu-item' element={<AddMenu />} />
          <Route path='/menu-items/add-deal' element={<AddDeal setCurrentTab={setCurrentTab} />} />
          <Route path='/agent' element={<Agent setScroll={setScroll} />} />
          <Route path='/staff' element={<Staff />} />
          <Route path='/staff/add-staff' element={<AddStaff />} />
          <Route path='/pos' element={<POS />} />
          <Route path='/kitchen' element={<Kitchen />} />
          <Route path='/orders' element={<Orders />} />
          <Route path="/menu-card" element={<MenuCard />} />
          <Route path='*' element={<Error />} />
        </>
      );
    }
  };

  return <Routes>{roleBasedRoutes()}</Routes>;
};

export default PrivateRoute;
