
import React from 'react'
import styles from '../styles/dashboard.module.css'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { BarChart } from '@mui/x-charts';
import { useEffect, useState } from "react";
import apiFetcher from "../helpers/api-fetcher";
interface MenuItem {
  id: number;
  price: number;
  title: string;
  imgUrl: string;
  recipe: string;
  category: string;
  isActive: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  ingredient: { quantity: number; inventoryId: number }[];
  servingSize: string;
  subCategory: string;
}

interface Order {
  id: number;
  customerName: string;
  contactInfo: string;
  amount: number;
  type: string;
  status: string;
  menuItems: MenuItem[];
  createdAt: string;
  updatedAt: string;
}
interface topSellingMenu {
  title: string,
  quantity: number
}

interface MenuItemCount {
  [title: string]: number;
}
interface SalesAggregate {
  date: string;
  aggregate: number;
}
interface Logs {
  title: string;
  description: string | null;
  type: string | null;
  createdAt: Date;
}
const theme = createTheme({
  typography: {
    fontFamily: 'Nunito Sans, sans-serif', 
  },
});

export default function Home() {

  const [timeHead, setTimeHead] = React.useState('Monthly');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [completedOrdersWeek, setCompletedOrdersWeek] = useState<number>(0)
  const [cancelledOrdersWeek, setCancelledOrdersWeek] = useState<number>(0)
  const [completedOrdersMonth, setCompletedOrdersMonth] = useState<number>(0)
  const [cancelledOrdersMonth, setCancelledOrdersMonth] = useState<number>(0)
  const [monthlySales, setMonthlySales] = useState<topSellingMenu[]>([]);
  const [weeklySales, setWeeklySales] = useState<topSellingMenu[]>([]);
  const [xAxisMenu, setxAxisMenu] = useState<string[]>([])
  const [yAxisMenu, setyAxisMenu] = useState<number[]>([])
  const [xAxisSales, setxAxisSales] = useState<string[]>([])
  const [yAxisSales, setyAxisSales] = useState<number[]>([])
  const [todaySales, setTodaySales] = useState<SalesAggregate[]>([]);
  const [weekSales, setWeekSales] = useState<SalesAggregate[]>([]);
  const [monthSales, setMonthSales] = useState<SalesAggregate[]>([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [consumptionPercentages, setConsumptionPercentages] = useState<number[]>([]);
  const [Logs, setLogs] = useState<Logs[]>([])
  const currency = localStorage.getItem('currency')

  useEffect(() => {
    handleTopSellingMenu()
    handleTotalSalesAxes()
    prepareOrdersData();    //completed and cancelled orders
  }, [timeHead, allOrders])

  useEffect(() => {
    getAllOrders();
    getAllItems()
    getAllSystemLogs()
  }, []);

  const getAllItems = async () => {
    try {
      const response = await apiFetcher.get("inventory");

      if (response.length > 0) {
        setInventoryItems(response.map((item: { title: string; }) => item.title));
        setConsumptionPercentages(
          response.map((item: { totalQuantity: number; remainingQuantity: number; }) => {
            const { totalQuantity, remainingQuantity } = item;

            return (totalQuantity - remainingQuantity)
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function getAllOrders() {
    try {
      const response = await apiFetcher.get('order');
      if (response) {
        setAllOrders(response)
        prepareSalesData(response)   //top selling menu
        handleTotalSales(response)
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async function getAllSystemLogs() {
    try {
      const response = await apiFetcher.get('systemLogs');
      if (response) {
        setLogs(response)
      }
    } catch (error) {
      console.error('Error fetching system logs:', error);
    }
  }

  function prepareSalesData(orders: Order[]) {
    // Get the current date in UTC
    const currentDate = new Date();

    // Calculate the start and end dates for the current month in UTC
    const startOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0));

    // Calculate the start and end dates for the current week in UTC (assuming week starts on Sunday)
    const startOfWeek = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - currentDate.getUTCDay()));
    const endOfWeek = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - currentDate.getUTCDay() + 6));

    // Filter orders based on monthly and weekly criteria
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfMonth && orderDate <= endOfMonth;
    });

    const weeklyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    });

    // Count menu items in monthly and weekly orders
    const monthlyMenuItems = countMenuItems(monthlyOrders);
    const weeklyMenuItems = countMenuItems(weeklyOrders);

    // Sort menu items by sales count
    const topMonthlySales = sortMenuItems(monthlyMenuItems);
    const topWeeklySales = sortMenuItems(weeklyMenuItems);

    // Update state variables
    setMonthlySales(topMonthlySales.slice(0, 5));
    setWeeklySales(topWeeklySales.slice(0, 5));
    handleTopSellingMenu()   //top selling menu
  }

  function countMenuItems(orders: Order[]): MenuItemCount {
    const menuItemsCount: MenuItemCount = {};
    orders.forEach(order => {
      order.menuItems.forEach((item: MenuItem) => {
        const { title, quantity } = item;
        if (menuItemsCount.hasOwnProperty(title)) {
          menuItemsCount[title] += quantity;
        } else {
          menuItemsCount[title] = quantity;
        }
      });
    });
    return menuItemsCount;
  }

  function sortMenuItems(menuItemsCount: MenuItemCount): topSellingMenu[] {
    const sortedMenuItems = Object.entries(menuItemsCount).sort((a, b) => b[1] - a[1]);
    return sortedMenuItems.map(([title, quantity]) => ({
      title,
      quantity,
    }));
  }

  const prepareOrdersData = () => {
    const currentDate = new Date();
    const startOfCurrentWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()); // Start of the current week
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month

    const currentWeekOrders = allOrders.filter(order => new Date(order.createdAt) >= startOfCurrentWeek);
    const currentMonthOrders = allOrders.filter(order => new Date(order.createdAt) >= startOfCurrentMonth);

    const completedWeekOrders = currentWeekOrders.filter(order => order.status === 'completed');
    const cancelledWeekOrders = currentWeekOrders.filter(order => order.status === 'cancelled');
    const completedMonthOrders = currentMonthOrders.filter(order => order.status === 'completed');
    const cancelledMonthOrders = currentMonthOrders.filter(order => order.status === 'cancelled');

    setCompletedOrdersWeek(completedWeekOrders.length);
    setCancelledOrdersWeek(cancelledWeekOrders.length);
    setCompletedOrdersMonth(completedMonthOrders.length);
    setCancelledOrdersMonth(cancelledMonthOrders.length);
  }

  const handleTopSellingMenu = () => {
    if (timeHead === 'Weekly' && weeklySales.length > 0) {
      const xData = weeklySales.map(item => item.title)
      const yData = weeklySales.map(item => item.quantity)
      setxAxisMenu(xData)
      setyAxisMenu(yData)
    } else {
      const xData = monthlySales.map(item => item.title)
      const yData = monthlySales.map(item => item.quantity)
      setxAxisMenu(xData)
      setyAxisMenu(yData)
    }
  }

  const handleTotalSalesAxes = () => {
    if (timeHead === 'Weekly') {
      const xData = weekSales.map(item => item.date);
      const yData = weekSales.map(item => item.aggregate);

      setxAxisSales(xData);
      setyAxisSales(yData);
    } else {
      const xData = monthSales.map(item => item.date);
      const yData = monthSales.map(item => item.aggregate);
      setxAxisSales(xData);
      setyAxisSales(yData);
    }
  };

  const handleTotalSales = (data: Order[]) => {
    const currentDate = new Date();

    // Calculate the start and end dates for today, week, and month in UTC
    const startOfToday = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
    const startOfWeek = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - currentDate.getUTCDay()));
    const startOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));

    // Convert dates to timestamps
    const startOfTodayTimestamp = startOfToday.getTime();
    const startOfWeekTimestamp = startOfWeek.getTime();
    const startOfMonthTimestamp = startOfMonth.getTime();

    // Filter orders based on date criteria
    const todayOrders = data.filter(order => new Date(order.createdAt).getTime() >= startOfTodayTimestamp && new Date(order.createdAt).getTime() < startOfTodayTimestamp + 86400000); // 86400000 ms = 1 day
    const weekOrders = [];
    const monthOrders = [];

    // Iterate through each day of the current week and month
    for (let i = 0; i < 7; i++) {
      const startOfWeekDayTimestamp = startOfWeekTimestamp + i * 86400000; // Calculate the start of the current day in the week

      // Filter orders for the current day in the week
      const dayOrders = data.filter(order => new Date(order.createdAt).getTime() >= startOfWeekDayTimestamp && new Date(order.createdAt).getTime() < startOfWeekDayTimestamp + 86400000);

      // Aggregate prices for the current day and update weekOrders
      const dayAggregate = dayOrders.reduce((sum, order) => sum + order.amount, 0);
      const dayOfWeek = new Date(startOfWeekDayTimestamp).toLocaleString('en-US', { weekday: 'short' }); // Get the day of the week in short format (e.g., Mon, Tue)
      weekOrders.push({ date: dayOfWeek, aggregate: dayAggregate });
    }

    // Iterate through each day of the current month
    for (let i = 0; i < currentDate.getUTCDate(); i++) {
      const startOfMonthDayTimestamp = startOfMonthTimestamp + i * 86400000; // Calculate the start of the current day in the month

      // Filter orders for the current day in the month
      const dayOrders = data.filter(order => new Date(order.createdAt).getTime() >= startOfMonthDayTimestamp && new Date(order.createdAt).getTime() < startOfMonthDayTimestamp + 86400000);

      // Aggregate prices for the current day and update monthOrders
      const dayAggregate = dayOrders.reduce((sum, order) => sum + order.amount, 0);
      const formattedDate = formatDate(new Date(startOfMonthDayTimestamp));
      monthOrders.push({ date: formattedDate, aggregate: dayAggregate });
    }

    // Update state variables
    setTodaySales([{ date: `${currentDate.getUTCDate()}/${currentDate.getUTCMonth() + 1}`, aggregate: todayOrders.reduce((sum, order) => sum + order.amount, 0) }]);
    setWeekSales(weekOrders);
    setMonthSales(monthOrders);
  }

  function formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  const calculateTimeDifference = (createdAt: Date): string => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now.getTime() - createdDate.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds} sec`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} mins`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      return `${diffDays} days`;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.heading}>Reports & Statistics</div>
        <div className={styles.dashboardHeaderChild1}style={{paddingLeft:timeHead === 'Monthly'?'1.3rem':'0.2rem',paddingRight:timeHead === 'Weekly'?'1.3rem':'0.3rem'}} >
          <div  className={`${styles.dashboardHeaderItem} ${timeHead === 'Weekly' ? styles.active : ''}`} onClick={() => setTimeHead('Weekly')}>This week</div>
          <div className={`${styles.dashboardHeaderItem} ${timeHead === 'Monthly' ? styles.active : ''}`} onClick={() => setTimeHead('Monthly')}>This month</div>
        </div>
      </div>
      <div className={`'d-flex m-2 justify-content-evenly' ${styles.dashboardChild}`} style={{ gap: '0.8rem' }}>
        <div className={styles.left}>
          <div className={styles.top}>
            <div className={styles.totalSales}>
              <div>
                <div className={styles.cardHead}>Total Sales <span className={styles.time}> | This {timeHead === 'Weekly' ? 'Week' : 'Month'}</span></div>
                <div className="PrevPath d-flex">Total cashflow of this&nbsp;<span> {timeHead === 'Weekly' ? ' week' : ' month'}</span></div>
              </div>
              <ThemeProvider theme={theme}>
              <LineChart
                yAxis={[
                  {
                    label: currency!,
                    labelStyle: { transform: 'rotate(0deg)' } 
                  }
                ]}
                xAxis={[{ scaleType: 'point', data: xAxisSales }]}
                series={[
                  {
                    data: yAxisSales,
                    area: true,
                    curve: 'linear',
                    color: '#58a188'
                  },
                ]}
                width={920}
                height={250}
              /></ThemeProvider>


            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.mostSoldMenu}>
              <div className="head d-flex justify-content-between">
                <div>
                  <div className={styles.cardHead}>Most Selling Menu Items <span className={styles.time}> | This {timeHead === 'Weekly' ? 'Week' : 'Month'}</span></div>
                  <div className="PrevPath d-flex">Top 5 most selling menu items</div>
                </div>
              </div>
              {
                yAxisMenu.length > 0 && xAxisMenu.length > 0 &&
                <ThemeProvider theme={theme}>
                <BarChart
                  width={450}
                  height={250}
                  series={[
                    { data: yAxisMenu, label: 'Sales', stack: 'total', color: '#8cdbc0' },
                  ]}
                  yAxis={[{ label: 'Number of items' }]}
                  xAxis={[{ data: xAxisMenu, scaleType: 'band', label: 'Menu Items' }]}
                /></ThemeProvider>
              }
            </div>

            <div className={styles.financialReport}>
              <div className={styles.financialHead}>Orders <span className={styles.time}> | This {timeHead === 'Weekly' ? 'Week' : 'Month'}</span></div>
              <ThemeProvider theme={theme}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: timeHead === 'Weekly' ? completedOrdersWeek : completedOrdersMonth, label: 'Completed', color: '#58a188' },
                      { id: 1, value: timeHead === 'Monthly' ? cancelledOrdersWeek : cancelledOrdersMonth, label: 'Cancelled', color: '#8cdbc0' },
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={250}
              /></ThemeProvider>
            </div>

          </div>
          <div className={styles.bottom}>
            <div className={styles.totalSales} style={{}}>
              <div>
                <div className={styles.cardHead}>Inventory Consumption</div>
                <div className="PrevPath d-flex">Percentage of inventory consumed</div>
              </div>
              <ThemeProvider theme={theme}>
              <LineChart
                yAxis={[{ label: 'Consumption' }]}
                xAxis={[{ scaleType: 'point', data: inventoryItems, label: 'Inventory' }]}// Use the x-axis data from state
                series={[
                  {
                    data: consumptionPercentages,
                    area: true,
                    curve: 'linear',
                    color: '#58a188'
                  },
                ]}
                width={inventoryItems.length > 10 ? 2000 : 60}

                height={250}
              /></ThemeProvider>

            </div>

          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.recentActivities}>
            <div className={styles.activityHead}>Recent Activities <span className={styles.time}> | Today</span></div>
            {
              Logs.length > 0 && Logs.map((log, index) => (
                <div key={index} className={styles.activities}>
                  <div className={styles.date}>{calculateTimeDifference(log.createdAt)}</div>
                  <div className={`${styles.vr} ${log.type === 'info' ? styles.vrInfo : log.type === 'warning' ? styles.vrWarn : styles.vrRed}`}></div>
                  <div className={styles.activity}>
                    {log.title.length > 25 ? `${log.title.slice(0, 24)}...` : log.title}
                    <div className={`text-secondary ${styles.activityDesc}`}>{log.description ? log.description : ''}</div>
                  </div></div>
              ))
            }
          </div>
        </div>
      </div>

    </div>
  )
}
