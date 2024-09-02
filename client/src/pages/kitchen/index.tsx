import React, { useEffect, useState } from 'react';
import apiFetcher from '../../helpers/api-fetcher';
import styles from '../../styles/kitchen.module.css'
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from 'react-bootstrap/Badge';
import { BallTriangle } from 'react-loader-spinner'
import Swal from 'sweetalert2';
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

function Kitchen() {

    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAllOrders();
    }, []);

    async function getAllOrders() {
        try {
            setLoading(true)

            const response = await apiFetcher.get("order");
            if (response.length > 0) {
                const completeOrders = response.filter((order: Order) => order.status === 'completed');
                completeOrders.sort((a: any, b: any) => {
                    const dateA = new Date(a.updatedAt).getTime();
                    const dateB = new Date(b.updatedAt).getTime();
                    return dateB - dateA;
                });
                const pendingOrder = response.filter((order: Order) => order.status === 'pending');
                pendingOrder.sort((a: any, b: any) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateA - dateB;
                });

                setAllOrders([...pendingOrder, ...completeOrders])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    const handleCompleteOrder = async (id: number) => {
        try {
            const response = await apiFetcher.put(`order/${id}`, {
                status: 'completed'
            });
            if (response) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Order completed successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                getAllOrders()
            }
        } catch (e) {
            Swal.fire({
                title: 'Error!',
                text: 'Order completion failed.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error(e)
        }

    }

    return (
        <div className='d-flex flex-column m-3' >
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Kitchen</div>
                    <div className="PrevPath d-flex mt-1">Manage / <div className="currentPath"> &nbsp; Kitchen</div></div>
                </div>
            </div>
            {
                loading && <div className='centerProgress'>
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
            <Accordion style={{ maxHeight: '75vh', overflow: 'scroll' }} defaultActiveKey="0" className={styles.accordionParent}>
                {
                    allOrders.length > 0 && !loading && allOrders.map((order, index) => {
                        return (
                            <Accordion.Item key={index} eventKey={index.toString()}>
                                <Accordion.Header>
                                    <div className='d-flex align-items-center'>
                                        <span className={`${order.status === 'completed' ? styles.completed : styles.pending} me-2`}></span><span > Order Number #{order.id}</span>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className={`${styles.AccBody} d-flex justify-content-between`}>
                                    <ul>
                                        {
                                            order?.menuItems.length > 0 && order?.menuItems.map((item, index) => {
                                                return (
                                                    <li key={index}>{item.title} x {item.quantity}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        order.status === 'completed' ? <Badge bg="primary" style={{ maxHeight: '1.4rem', cursor: 'pointer' }}>Completed</Badge> :
                                            <DropdownButton id="dropdown-basic-button" title={order.status} style={{ display: 'inline !important' }}>
                                                <Dropdown.Item ><div onClick={() => handleCompleteOrder(order.id)} >Complete</div></Dropdown.Item>
                                            </DropdownButton>
                                    }

                                </Accordion.Body>
                            </Accordion.Item>
                        )
                    })
                }
            </Accordion>
        </div>

    );
}

export default Kitchen;
