import { useEffect, useState } from "react";
import styles from "../../styles/pos.module.css";
import apiFetcher from "../../helpers/api-fetcher";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Divider, FormHelperText, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from 'react-bootstrap/Card';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CallSharpIcon from '@mui/icons-material/CallSharp';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import Swal from "sweetalert2";
import Chip from '@mui/material/Chip';
import deal from '../../media/deal img.png'
import { NavDropdown } from "react-bootstrap";
import { BallTriangle } from 'react-loader-spinner'
import { ShoppingCartSimple } from "@phosphor-icons/react";

interface Deal {
  id: number;
  title: string;
  type: 'menu' | 'deal';   // I will add this field on my own after fetching data
  menuItems: Array<{
    id: number;
    title: string;
    servingSize: string;
    type: 'menu' | 'deal';
    category: string;
    subCategory: string;
    quantity: number
    imgUrl: string;
    recipe: string;
    price: number;
    isActive: number;
    ingredient: {
      quantity: number;
      inventoryId: number;
    }[];
    actualIngredients: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  price: number;
  createdAt: string;
  isActive: boolean;
  updatedAt: string;

}

interface MenuItem {
  id: number;
  title: string;
  servingSize: string;
  type: 'menu' | 'deal';
  category: string;
  subCategory: string;
  imgUrl: string;
  recipe: string;
  price: number;
  isActive: number;
  ingredient: {
    quantity: number;
    inventoryId: number;
  }[];
  actualIngredients: string[];
  createdAt: string;
  updatedAt: string;
}

interface currentOrder {
  id: number;
  title: string;
  servingSize: string;
  type: 'menu' | 'deal';
  category: string;
  subCategory: string;
  imgUrl: string;
  recipe: string;
  price: number;
  isActive: number;
  ingredient: {
    quantity: number;
    inventoryId: number;
  }[];
  createdAt: string;
  updatedAt: string;
  quantity: number;

}

interface MenuQuantities {
  [id: string]: number;
}
interface orderDisplay {
  id: number;
  title: string;
  quantity: number;
  price: number;
  type: 'menu' | 'deal';
}

export default function POS() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [showDetailsModal, setShowDetaailsModal] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [generateError, setGenerateError] = useState<boolean>(false);
  const [isloadingMenu, setIsloadingMenu] = useState<boolean>(false);
  const [value, setValue] = useState('one');
  const [currentOrder, setCurrentOrder] = useState<currentOrder[]>([])
  const [currentOrderToDisplay, setCurrentOrderToDisplay] = useState<orderDisplay[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [menuQuantities, setMenuQuantities] = useState<MenuQuantities>({});
  const [date, setDate] = useState('')
  const [customInstructions, setCustomInstructions] = useState<{ [id: number]: string[] }>({});
  const [showInstModal, setShowInstModal] = useState<boolean>(false);
  const [smScreenModal, setShowSmScreenModal] = useState<boolean>(false);
  const [instructions, setInstructions] = useState('')
  const [customOrder, setCustomOrder] = useState<currentOrder>()
  const [dealsToShow, setDealsToShow] = useState<Deal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<any[]>([])
  const [currentCat, setCurrentCat] = useState('')
  const currency = localStorage.getItem('currency')
  const tax = localStorage.getItem('tax')
  useEffect(() => {
    addDeals()
  }, [currentOrder])

  useEffect(() => {
    fetchDeals();
    fetchMenuItems();
    generateDate()

  }, []);

  const addDetails = () => {
    setShowDetaailsModal(true)
  }

  const addDeals = () => {
    const matchingDeals = deals?.filter((deal) =>
      currentOrder?.some((order) =>
        Array.isArray(deal.menuItems) &&
        deal.menuItems.length > 0 &&
        deal.menuItems.some((item) => item.title === order.title)
      )
    );
    setDealsToShow(matchingDeals || []);
  };

  const HandleshowInstModal = (order: any) => {
    setInstructions('')
    setCustomOrder(order)
    setShowInstModal(true)
  }
  const handleDelete = (id: number, instIndex: number) => {
    setCustomInstructions((prevInstructions) => {
      if (!prevInstructions[id]) {
        return prevInstructions;
      }
      setInstructions('')
      const updatedInstructions = { ...prevInstructions };
      updatedInstructions[id] = updatedInstructions[id]?.filter((_, index) => index !== instIndex);
      return updatedInstructions;
    });
  };
  const handleAddCustomInstructions = () => {
    if (instructions === '') {
      setShowInstModal(false);
      return
    }
    const inst = instructions.split(',');

    if (customOrder) {
      setCustomInstructions((prevInstructions) => {
        const existingInstructions = prevInstructions[customOrder.id] || [];
        const mergedInstructions = [...existingInstructions, ...inst];
        return {
          ...prevInstructions,
          [customOrder.id]: mergedInstructions,
        };
      });
    }

    setShowInstModal(false);
  };


  const handleClose = () => setShowDetaailsModal(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOneClick = (category: string) => {
    setCurrentCat(category)
    const categories = category.split(',')
    const copyMenu = allMenuItems
    const menu = copyMenu?.filter((item) => categories?.some((cat) => item.category === cat));
    setMenuItems(menu)

  }
  const generateDate = () => {
    const currentDate = new Date();

    const options = {
      weekday: 'short' as const,
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
      hour: 'numeric' as const,
      minute: 'numeric' as const,
      hour12: false as const,
      timeZone: 'UTC',
    }

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(currentDate);
    setDate(formattedDate)
  }
  const updateMenuQuantity = (id: number, quantity: number) => {
    setMenuQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: quantity,
    }));
  };


  const handleMouseEnter = (cardId: number) => {
    setHoveredCard(cardId);
    setButtonVisible(true); // Show the button when hovered
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
    setButtonVisible(false); // Hide the button when not hovered
  };



  const fetchDeals = async () => {
    const data = await apiFetcher.get("deals");
    if (data) {

      const modifiedItems = data?.map((Item: Deal) => ({
        ...Item,
        type: 'deal'
      }));
      setDeals(modifiedItems);

    }
  };

  const fetchMenuItems = async () => {
    setIsloadingMenu(true);
    try {
      const data = await apiFetcher.get("menu-item");

      if (data) {
        const modifiedMenuItems = data?.map((menuItem: any) => ({
          ...menuItem,
          price: parseFloat(menuItem.price.split('$')[0]),
          type: 'menu'
        }));
        setAllMenuItems(modifiedMenuItems);

        // Extract unique categories and filter out undefined or null categories
        const uniqueCategories: string[] = Array.from(new Set(modifiedMenuItems.map((item: MenuItem) => item.category)))
          .filter((category): category is string => typeof category === 'string' && category.trim() !== '');

        setCategory(uniqueCategories);
        setCurrentCat(uniqueCategories[0]);

        const menu = modifiedMenuItems?.filter((item: MenuItem) => item.category === 'Appetizers');
        setMenuItems(menu);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsloadingMenu(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetaailsModal(false);
  };


  const handleRecipientName = (e: any) => {
    setRecipientName(e.target.value)
  }

  const handleTableNumber = (e: any) => {
    setTableNumber(e.target.value)
  }
  const handleContact = (e: any) => {
    setContactNumber(e.target.value)
  }

  const handleSaveDetails = () => {
    if (recipientName === '' || contactNumber === '' || tableNumber === '') {
      setGenerateError(true)
      return
    } else {
      setGenerateError(false)
      handleCloseModal()
    }
  }
  const handleAddToOrder = (menu: MenuItem) => {
    const existingItem = currentOrder.find((item) => ((item.id === menu.id) && item.type === menu.type));
    if (existingItem) {
      const updatedOrder = currentOrder?.map((item) =>
        ((item.id === menu.id) && menu.type === item.type)
          ? {
            ...item,
            quantity: item.quantity + 1,
            price: Number((item.price + menu.price).toFixed(2)),
          }
          : item
      );
      const updatedOrderToDisplay = currentOrderToDisplay?.map((item) =>
        ((item.id === menu.id) && menu.type === item.type)
          ? {
            ...item,
            quantity: item.quantity + 1,
            price: Number((item.price + menu.price).toFixed(2)),
          }
          : item
      );
      const quantity = menuQuantities[menu.id] + 1
      updateMenuQuantity(menu.id, quantity);
      setCurrentOrder(updatedOrder);
      setCurrentOrderToDisplay(updatedOrderToDisplay)

    } else {

      const newOrderItem: currentOrder = {
        ...menu,
        type: 'menu',
        quantity: 1,

      };
      setCurrentOrder((prevOrder) => [...prevOrder, newOrderItem]);
      const orderToDisplay: orderDisplay = {
        id: menu.id,
        quantity: 1,
        title: menu.title,
        type: 'menu',
        price: menu.price
      }
      setCurrentOrderToDisplay((prevOrder) => [...prevOrder, orderToDisplay]);
      updateMenuQuantity(menu.id, 1);
    }
    setTotalPrice(menu.price + totalPrice);

  };

  // Function to subtract a menu item from the current order
  const handleSubtractFromOrder = (menu: MenuItem) => {
    const existingItem = currentOrder.find((item) => ((item.id === menu.id) && menu.type === item.type));
    if (existingItem) {

      if (existingItem.quantity > 1) {
        const updatedOrder = currentOrder?.map((item) =>
          ((item.id === menu.id) && menu.type === item.type)
            ? {
              ...item,
              quantity: item.quantity - 1,
              price: Number((item.price - menu.price).toFixed(2)),
            }
            : item
        );
        setCurrentOrder(updatedOrder);
        const updatedOrderToDisplay = currentOrderToDisplay?.map((item) =>
          ((item.id === menu.id) && menu.type === item.type)
            ? {
              ...item,
              quantity: item.quantity - 1,
              price: Number((item.price - menu.price).toFixed(2)),
            }
            : item
        );
        setCurrentOrderToDisplay(updatedOrderToDisplay)
        const quantity = menuQuantities[menu.id] - 1
        updateMenuQuantity(menu.id, quantity);
      } else {
        const updateOrder = currentOrder?.filter((item) => item.id !== menu.id)
        setCurrentOrder(updateOrder)
        setCurrentOrderToDisplay(updateOrder)
        updateMenuQuantity(menu.id, 0);
      }
      setTotalPrice(totalPrice - menu.price);

    }

  };


  const handleAddDealToOrder = (_deal: Deal) => {

    const existingOrderItem = currentOrderToDisplay.find(
      (item) => ((item.id === _deal.id) && _deal.type === item.type)
    );

    if (existingOrderItem) {
      existingOrderItem.quantity += 1;
      existingOrderItem.price = existingOrderItem.quantity * _deal.price;

      setCurrentOrderToDisplay([...currentOrderToDisplay])
      const newTotalPrice = currentOrderToDisplay.reduce(
        (total, item) => total + item.price,
        0
      );
      setTotalPrice(newTotalPrice);
    }
    else {

      const totalPrice = _deal.price * 1;
      const orderToDisplay: orderDisplay = {
        id: _deal.id,
        quantity: 1,
        title: _deal.title,
        type: 'deal',
        price: _deal.price
      }
      setCurrentOrderToDisplay((prevOrder) => [...prevOrder, orderToDisplay]);
      const newTotalPrice = currentOrderToDisplay.reduce(
        (total, item) => total + item.price,
        0
      );
      setTotalPrice(newTotalPrice + totalPrice);
    }
    addDealMenuToOrder(_deal.menuItems)

  };

  const addDealMenuToOrder = (menuItems: MenuItem[]) => {
    let updatedOrder = [...currentOrder]; // Create a copy of the current order

    menuItems.forEach((menu) => {
      const existingItemIndex = updatedOrder.findIndex((item) => item.id === menu.id);
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity and price
        updatedOrder[existingItemIndex] = {
          ...updatedOrder[existingItemIndex],
          quantity: updatedOrder[existingItemIndex].quantity + 1,
          price: updatedOrder[existingItemIndex].price + menu.price,
        };

      } else {
        // If item doesn't exist, add it with quantity 1 and its price
        const newItem = {
          ...menu,
          quantity: 1,
          price: menu.price,
        };
        updatedOrder.push(newItem);
      }
    });

    // Set the updated order including all past records
    setCurrentOrder(updatedOrder);
  };


  const handleMenuDelete = (order: orderDisplay, quantity: number) => {

    if (order.type === 'menu') {
      const updatedOrder = currentOrder?.map((item) => {
        if (item.id === order.id && item.type === order.type) {
          const updatedQuantity = Math.max(0, item.quantity - quantity); // Subtract 1 from quantity
          return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
        }
        return item;
      }).filter(Boolean) as currentOrder[]; // Type assertion

      setCurrentOrder(updatedOrder);
    } else {
      const dealToDelete = dealsToShow.find((deal) => deal.id === order.id);

      const menuIdsToDelete: number[] = dealToDelete?.menuItems.map((menuItem) => menuItem.id) || [];

      // Iterate through currentOrder and update quantities based on menuIdsToDelete
      const updatedCurrentOrder = currentOrder.map((item) => {
        if (menuIdsToDelete.includes(item.id)) {
          const updatedQuantity = Math.max(0, item.quantity - 1); // Calculate updated quantity
          return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
        }
        return item;
      }).filter(Boolean) as currentOrder[]; // Type assertion

      setCurrentOrder(updatedCurrentOrder);

    }


    const remainingOrderToDisplay = currentOrderToDisplay?.filter((item) => item.title !== order.title);
    setCurrentOrderToDisplay(remainingOrderToDisplay);
    updateMenuQuantity(order.id, 0);
    setTotalPrice(Number((totalPrice - order.price).toFixed(2)));
    handleRemoveCustomInstructions(order.id);


  }
  const handleRemoveCustomInstructions = (orderId: number) => {
    setCustomInstructions((prevInstructions) => {
      const updatedInstructions = { ...prevInstructions };
      delete updatedInstructions[orderId];
      return updatedInstructions;
    });
  };

  const handleOrderComplete = () => {
    if (recipientName === '' || tableNumber === '' || contactNumber === '') {
      Swal.fire({
        icon: 'error',
        title: 'Failure!',
        text: 'Please add customer details.',
      });
    } else {
      placeOrder()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order is confirmed.',
      });
      setMenuQuantities({})
      setCurrentOrder([])
      setCurrentOrderToDisplay([])
      setRecipientName('')
      setContactNumber('')
      setTableNumber('')
      setTotalPrice(0)
      generateDate()
      setCustomInstructions({})
      setShowSmScreenModal(false)
    }

  }
  const handleInstClose = () => {
    setShowInstModal(false)
  }
  const handleInstructions = (e: any) => {
    if (e.target.value !== '') {
      setInstructions(e.target.value)
    }
  }
  const handleSearchTerm = (e: any) => {
    setSearchTerm(e.target.value)
  }

  const placeOrder = async () => {
    // Apply JSON.stringify to menu items' recipe field and remove the "type" field
    const processedOrder = currentOrder.map((item) => {
      if (item.type === 'menu') {
        return {
          ...item,
          ingredient: JSON.stringify(item.ingredient),
        };
      }
      return item;
    });

    const data = await apiFetcher.post('order', {
      customerName: recipientName,
      contactInfo: contactNumber,
      amount: totalPrice + totalPrice * 0.1,
      type: 'dine-in',
      status: 'pending',
      menuItems: processedOrder,
    });
  };

  const handleSmClose = () => {
    setShowSmScreenModal(false)
  }

  return (
    <div className={styles.pos}>

      <Modal
        show={showInstModal}
        onHide={handleInstClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-3 d-flex flex-column" >
              <label>Add Custom Instructions For {customOrder?.title}</label>
              <textarea className="textArea" onChange={(e) => handleInstructions(e)} aria-label=" name" placeholder="add extra pickles" />
              <FormHelperText>Add multiple instructions seperated by comma</FormHelperText>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddCustomInstructions}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDetailsModal}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <Modal.Title>Add Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Text><PersonIcon className="me-2" color="primary"></PersonIcon>Recipient's Name</InputGroup.Text>
              <Form.Control onChange={(e) => handleRecipientName(e)} value={recipientName} aria-label=" name" placeholder="John Doe" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text><CallSharpIcon className="me-2" color="primary"></CallSharpIcon>Recipient's Contact Number</InputGroup.Text>
              <Form.Control onChange={(e) => handleContact(e)} value={contactNumber} aria-label="Contact" placeholder="0390 89382983" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text><NumbersIcon className="me-2" color="primary"></NumbersIcon>Table Number</InputGroup.Text>
              <Form.Control onChange={(e) => handleTableNumber(e)} value={tableNumber} aria-label="Contact" placeholder='T14' />
            </InputGroup>
            {
              generateError && <span className="warning">Please fill out all the fields to proceed!</span>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveDetails}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={smScreenModal}
        onHide={handleSmClose}
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <Modal.Title>Add Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div >
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Text><PersonIcon className="me-2" color="primary"></PersonIcon>Recipient's Name</InputGroup.Text>
              <Form.Control onChange={(e) => handleRecipientName(e)} value={recipientName} aria-label=" name" placeholder="John Doe" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text><CallSharpIcon className="me-2" color="primary"></CallSharpIcon>Recipient's Contact Number</InputGroup.Text>
              <Form.Control onChange={(e) => handleContact(e)} value={contactNumber} aria-label="Contact" placeholder="0390 89382983" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text><NumbersIcon className="me-2" color="primary"></NumbersIcon>Table Number</InputGroup.Text>
              <Form.Control onChange={(e) => handleTableNumber(e)} value={tableNumber} aria-label="Contact" placeholder='T14' />
            </InputGroup>
            {
              generateError && <span className="warning">Please fill out all the fields to proceed!</span>
            }
          </div>

            <div className={styles.orderCardParent}>
              {
                currentOrderToDisplay?.length > 0 && currentOrderToDisplay.map((order, index) => {
                  return (
                    <div className={styles.orderCardContainer} key={index}>
                      <div className={styles.orderCard}>
                        <div className={styles.orderLeft}>

                          {
                            order.type === 'menu' && <div
                              style={{
                                backgroundImage: `url(${allMenuItems.find((menu) => menu.id === order.id)?.imgUrl || deal})`,
                              }}
                              className={styles.orderImg}
                            ></div>
                          }
                          {
                            order.type === 'deal' &&
                            <div
                              style={{
                                backgroundImage: `url(${deal})`,
                              }}
                              className={styles.orderImg}
                            ></div>
                          }
                          <div className={styles.orderDetails}>
                            <div className={styles.orderDetailsName}>{order.title}</div>
                            <div className={styles.orderDetailsPrice}>{currency}{order.price}</div>
                            {/* discuss quantity of one dish in a deal hance price in order as well with mudasir */}
                          </div>

                        </div>
                        <div className={styles.deleteContainer}>
                          <div className={styles.orderRight}>{order.quantity}x</div>
                          <IconButton onClick={() => handleMenuDelete(order, order.quantity)}><DeleteOutlineSharpIcon color="error"></DeleteOutlineSharpIcon></IconButton>
                        </div>


                      </div>
                      <div>
                        <div className={styles.customizationInstructions} onClick={() => HandleshowInstModal(order)}><AddIcon className={styles.customizationInstructions} ></AddIcon> Custom Instructions</div>
                        <div className={styles.customizationParent}>

                          {customInstructions[order.id] &&
                            customInstructions[order.id].map((instruction, idx) => (

                              <Chip
                                label={instruction}
                                variant="outlined"
                                color="primary"
                                onDelete={() => handleDelete(order.id, idx)}
                                style={{
                                  borderColor: '0.5px solid #4154f1',
                                  backgroundColor: '#e4ebfb',
                                }}
                              />

                            ))}

                        </div>
                      </div>

                    </div>
                  )
                })
              }


            </div>
            {
              currentOrder?.length > 0 &&
              <div className={styles.billParent}>
                <div className={styles.bill}>
                  <div className={styles.billHead}>SubTotal</div>
                  <div className={styles.billPrice}>{currency}{totalPrice.toFixed(2)}</div> {/* Limit to 2 decimal places */}
                </div>
                <div className={styles.bill}>
                  <div className={styles.billHead}>Tax {tax}%</div>
                  <div className={styles.billPrice}>{currency}{(totalPrice * (parseInt(tax!) / 100)).toFixed(2)}</div> {/* Limit to 2 decimal places */}
                </div>

                <Divider className="m-7" style={{ backgroundColor: 'grey' }}></Divider>
                <div className={styles.bill}>
                  <div className={styles.billHead}>Total</div>
                  <div className={styles.billPrice}>{currency}{(totalPrice + totalPrice * 0.1).toFixed(2)}</div> {/* Limit to 2 decimal places */}
                </div>
                {/* <div onClick={handleOrderComplete} className={`button ${styles.completeBtn}`}>Complete Order</div> */}
              </div>
            }


          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={currentOrder?.length === 0} onClick={handleOrderComplete}>Complete Order</Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.POSparent}>
        <div className={styles.left}>
          <div className={styles.dealsParent}>

            <Carousel
              additionalTransfrom={0}
              arrows
              containerClass={styles.carouselContainer}
              autoPlaySpeed={3000}
              centerMode={false}
              className=""
              autoPlay={true}
              dotListClass=""
              draggable
              focusOnSelect={false}
              infinite
              itemClass=""
              keyBoardControl
              minimumTouchDrag={80}
              renderButtonGroupOutside={false}
              renderDotsOutside={false}
              responsive={{
                desktop: {
                  breakpoint: { max: 3000, min: 0 },
                  items: 3,
                  // partialVisibilityGutter: 40,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                  partialVisibilityGutter: 30,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 2,
                  partialVisibilityGutter: 30,
                },
              }}
              showDots={false}
              sliderClass=""
              slidesToSlide={1}
              swipeable
            >
              {dealsToShow?.length > 0 && dealsToShow.map((item, index) => (
                <div key={item.id} onClick={() => handleAddDealToOrder(item)}>
                  <div
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    className={`${styles.dealCard} `}>
                    <div className={styles.dealTop}>
                      <div className={styles.dealTopLeft}>
                        <LocalOfferIcon fontSize="small" color="primary"></LocalOfferIcon>
                        <span className={styles.dealName}>{item.title}</span>
                      </div >
                      <div className={styles.dealTopRight}>{currency}{item.price}</div>
                    </div>

                    <div className={styles.listOfDealItems} style={{ overflowY: item.menuItems.length > 4 ? 'scroll' : 'auto' }}>
                      {
                        item.menuItems?.length > 0 && item.menuItems?.map((menu, index) => (
                          <div className={styles.singleItem} key={index} >
                            <div className={styles.itemName}>
                              {menu.title}
                            </div>
                            <div className={styles.itemQuantity}>
                              x {menu.quantity}
                            </div>
                          </div>
                        ))
                      }
                      {/* <div className={styles.itemPrice}>${item.price}</div> */}
                    </div>
                    {/* <div onClick={(id) => handleAddDealToOrder(item.id)} className={`${styles.addToOrderButton} ${hoveredCard === index ? styles.visible : ''}`}><AddIcon></AddIcon>Add to Order</div> */}

                  </div>

                </div>
              ))}
            </Carousel>

          </div>
          <div className={styles.menuParent}>



            <div className={`${styles.cartParent} d-flex align-items-center justify-content-between mt-2`}>
              <div className={styles.tabs}>
                <NavDropdown className={styles.menuHead} title={currentCat} id="basic-nav-dropdown" style={{ minHeight: 'fit-content !important', minWidth: '10rem' }}>
                  {
                    category.length > 0 && category.map((cat, index) => {
                      return (
                        <NavDropdown.Item key={index} onClick={() => handleOneClick(cat)}>{cat}</NavDropdown.Item>
                      )
                    })
                  }
                </NavDropdown>
              </div>
              <div className={styles.cartParent}>
                <input placeholder="Search menu" className="input me-4" value={searchTerm} onChange={(e) => handleSearchTerm(e)}></input>
                <IconButton className={styles.cart} onClick={() => setShowSmScreenModal(true)} ><ShoppingCartSimple size={20} weight="light"/></IconButton>
              </div>
            </div>
            <div className={styles.menuCardParent}>

              {menuItems?.length > 0 &&
                menuItems
                  .filter((menu) => menu.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((menu, index) => {

                    return (
                      <Card className={styles.menuCard} key={index}>
                        {/* <Card.Img variant="top" src={menu.imgUrl} /> */}
                        <div style={{ backgroundImage: `url(${menu.imgUrl})` }} className={styles.menuImg}></div>

                        <Card.Body>
                          <Card.Title className={styles.itemName}> {menu.title}</Card.Title>
                          <Card.Text>
                            <div className={styles.cardBottom}>
                              <div className={styles.menuPrice}>{currency}{menu.price}</div>
                              <div className={styles.menuControl}>
                                <IconButton
                                  className={styles.control}
                                  onClick={() => handleAddToOrder(menu)}
                                >
                                  <AddIcon fontSize="small"></AddIcon>
                                </IconButton>
                                <div className={styles.menuQuantity}>{menuQuantities[menu.id] || 0}</div>
                                <IconButton
                                  className={styles.control}
                                  onClick={() => handleSubtractFromOrder(menu)}
                                >
                                  <RemoveIcon fontSize="small"></RemoveIcon>
                                </IconButton>
                              </div>
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )

                  })}

              {
                isloadingMenu &&
                <div className={styles.containerProgress}>
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

            </div>
          </div>
        </div >

        <div className={styles.right}>
          <div className={styles.menuHead}>Order Details <IconButton onClick={addDetails}><AddIcon></AddIcon></IconButton></div>
          <div className={styles.detail}>
            <div className={styles.detailHead}><PersonIcon fontSize="small" className="me-1"></PersonIcon>Recipient's Name</div>
            <div className={styles.detailName}>{recipientName}</div>
          </div>

          {/* <div className={styles.detail}>
            <div className={styles.detailHead}><AccessTimeIcon fontSize="small" className="me-1"></AccessTimeIcon>Order Date</div>
            <div className={styles.detailName}>{date}</div>
          </div> */}

          <div className={styles.detail}>
            <div className={styles.detailHead}><NumbersIcon fontSize="small" className="me-1"></NumbersIcon>Table Number</div>
            <div className={styles.detailName}>{tableNumber}</div>
          </div>

          <Divider className="m-7" style={{ backgroundColor: 'grey', margin: '1.2rem' }}></Divider>

          <div className={styles.orderCardParent}>
            {
              currentOrderToDisplay?.length > 0 && currentOrderToDisplay.map((order, index) => {
                return (
                  <div className={styles.orderCardContainer} key={index}>
                    <div className={styles.orderCard}>
                      <div className={styles.orderLeft}>

                        {
                          order.type === 'menu' && <div
                            style={{
                              backgroundImage: `url(${allMenuItems.find((menu) => menu.id === order.id)?.imgUrl || deal})`,
                            }}
                            className={styles.orderImg}
                          ></div>
                        }
                        {
                          order.type === 'deal' &&
                          <div
                            style={{
                              backgroundImage: `url(${deal})`,
                            }}
                            className={styles.orderImg}
                          ></div>
                        }
                        <div className={styles.orderDetails}>
                          <div className={styles.orderDetailsName}>{order.title}</div>
                          <div className={styles.orderDetailsPrice}>{currency}{order.price}</div>
                          {/* discuss quantity of one dish in a deal hance price in order as well with mudasir */}
                        </div>

                      </div>
                      <div className={styles.deleteContainer}>
                        <div className={styles.orderRight}>{order.quantity}x</div>
                        <IconButton onClick={() => handleMenuDelete(order, order.quantity)}><DeleteOutlineSharpIcon color="error"></DeleteOutlineSharpIcon></IconButton>
                      </div>


                    </div>
                    <div>
                      <div className={styles.customizationInstructions} onClick={() => HandleshowInstModal(order)}><AddIcon className={styles.customizationInstructions} ></AddIcon> Custom Instructions</div>
                      <div className={styles.customizationParent}>

                        {customInstructions[order.id] &&
                          customInstructions[order.id].map((instruction, idx) => (

                            <Chip
                              label={instruction}
                              variant="outlined"
                              color="primary"
                              onDelete={() => handleDelete(order.id, idx)}
                              style={{
                                borderColor: '0.5px solid #4154f1',
                                backgroundColor: '#e4ebfb',
                              }}
                            />

                          ))}

                      </div>
                    </div>

                  </div>
                )
              })
            }


          </div>
          {
            currentOrder?.length > 0 &&
            <div className={styles.billParent}>
              <div className={styles.bill}>
                <div className={styles.billHead}>SubTotal</div>
                <div className={styles.billPrice}>{currency}{totalPrice.toFixed(2)}</div> {/* Limit to 2 decimal places */}
              </div>
              <div className={styles.bill}>
                <div className={styles.billHead}>Tax {tax}%</div>
                <div className={styles.billPrice}>{currency}{(totalPrice * (parseInt(tax!) / 100)).toFixed(2)}</div> {/* Limit to 2 decimal places */}
              </div>

              <Divider className="m-7" style={{ backgroundColor: 'grey' }}></Divider>
              <div className={styles.bill}>
                <div className={styles.billHead}>Total</div>
                <div className={styles.billPrice}>{currency}{(totalPrice + totalPrice * 0.1).toFixed(2)}</div> {/* Limit to 2 decimal places */}
              </div>
              <div onClick={handleOrderComplete} className={`button ${styles.completeBtn}`}>Complete Order</div>
            </div>
          }


        </div>
      </div >


    </div >
  );
}
