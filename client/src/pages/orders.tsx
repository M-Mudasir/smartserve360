import styles from "../styles/inventory.module.css";
import DeatailsTable from "../components/table";
import { useEffect, useState } from "react";
import apiFetcher from "../helpers/api-fetcher";
import { BallTriangle } from 'react-loader-spinner'

interface Order {
  id: number;
  customerName: string;
  contactInfo: string;
  amount: number;
  type: "online" | "dine-in"; // Adjust ENUM values as needed
  status: "pending" | "completed" | "canceled"; // Adjust ENUM values as needed
}

function Orders() {
  const columns = [
    { id: "customerName", label: "Customer Name", minWidth: 100 },
    { id: "contactInfo", label: "Contact Info", minWidth: 100 },
    { id: "amount", label: "Total Payment", minWidth: 100 },
    { id: "type", label: "Order Type", minWidth: 100 },
    { id: "status", label: "Order Status", minWidth: 100 },
  ];
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const currency = localStorage.getItem('currency')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getAllOrders();
  }, []);

  async function getAllOrders() {
    setIsLoading(true)
    const response = await apiFetcher.get("order");
  
    // Map through orders and modify amount
    const modifiedOrders = response.map((order: { amount: any; }) => ({
      ...order,
      amount: `${order.amount.toFixed(2)} ${currency}` // Append $ to the amount
    }));
  
    setAllOrders(modifiedOrders);
    setIsLoading(false)
  }
  
  const handleCancelOrder = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await apiFetcher.put(`order/${id}`, {
        status: 'cancelled'
      });
      if (response) {
        getAllOrders()
      }
    } catch (e) {
      console.error(e)
    }finally{
    setIsLoading(false)
    }

  }
  return (
    <div className={styles.inventory}>
 
      <div className="head d-flex justify-content-between">
        <div>
          <div className="pageHead">Orders</div>
          <div className="PrevPath d-flex mt-1">
            Analyse / <div className="currentPath"> &nbsp; Orders</div>
          </div>
        </div>
        <div></div>
      </div>

      <div className={styles.tableContainer}>
        <div className="tableHead mb-3">Order Records</div>
        {
          isLoading && <div className={styles.containerProgress}>
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#58a188"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass={styles.progress}
            visible={true}
          />
        </div>
        }
        {
          !isLoading && allOrders.length > 0  &&
          <DeatailsTable
          dummyData={allOrders}
          columns={columns}
          title="Orders"
          handleCancelOrder={handleCancelOrder}
        ></DeatailsTable>
        }
       
      </div>
    </div>
  );
}

export default Orders;
