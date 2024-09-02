import { useEffect, useState } from 'react'
import styles from '../../styles/menuCard.module.css'
import apiFetcher from '../../helpers/api-fetcher'
import { CircularProgress } from '@mui/material'
import Carousel from 'react-bootstrap/Carousel';
import c1 from '../../media/c7.jpg'
import c2 from '../../media/c5.jpg'
import c3 from '../../media/c6.jpg'
import mainCourse from '../../media/mainCourseMenuCard.jpg'
import beverages from '../../media/menu-card beverages.jpg'
import dessert from '../../media/menu-card dessert1.jpg'
import appetizer from '../../media/main menu appetizer.jpg'
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface MenuItem {
    id: number;
    title: string;
    servingSize: string;
    category: string;
    subCategory: string;
    imgUrl: string;
    recipe: string;
    price: string;
    isActive: number;
    ingredient: {
        quantity: number;
        inventoryId: number;
    }[];
    actualIngredients: string[];
    createdAt: string;
    updatedAt: string;
}


interface InventoryItem {
    id: number;
    title: string;
    quantity: number;
    remainingQuantity: number;
    itemBrand: string;
    expiryDate: string;
    inventoryUnit: string;
    inventoryType: string;
    createdAt: string;
    updatedAt: string;
}


function MenuCard() {
    const [activeCat, setActiveCat] = useState<string>('All Menu')
    const [filterCat, setFilterCat] = useState<string>('')
    const [filterSubCat, setFilterSubCat] = useState<string>('')
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [subCats, setSubCats] = useState<string[]>([])
    const [deals, setDeals] = useState<any[]>([]);

    useEffect(() => {
        getAllInventoryItems()
        fetchDeals()
    }, [])

    useEffect(() => {
        getAllMenuItems()
    }, [inventoryItems])

    const fetchDeals = async () => {
        const data = await apiFetcher.get("deals");
        if (data) {
            setDeals(data);
        }
    };
    const handleSubCatCardClick = (cat: string) => {
        setFilterSubCat(cat)
        if (cat === 'deals') {
            setActiveCat('Deals')
        }
    }
    const handleCatCardClick = (category: string) => {
        setActiveCat(category);
        setFilterCat('');
        if (category !== 'All Menu') {
            setFilterCat(category);

            // Get unique subcategories for the selected category
            const subCategories = menuItems.filter((item) => item.category === category)
                .map((item) => item.subCategory)
                .filter((subCat, index, self) => self.indexOf(subCat) === index);

            setSubCats(subCategories)
            setFilterSubCat(subCategories[0])
        }

    };


    const getAllMenuItems = async () => {
        try {
            const data = await apiFetcher.get('menu-item');
            if (data.length > 0) {
                const menuItemsWithIngredients = data.map((menuItem: { ingredient: any[]; }) => ({
                    ...menuItem,
                    actualIngredients: typeof menuItem.ingredient === 'string'
                        ? JSON.parse(menuItem.ingredient).map((ingr: any) => {
                            const inventoryItem = inventoryItems.find((invItem) => invItem.id === ingr.inventoryId);
                            return inventoryItem ? inventoryItem.title : '';
                        })
                        : menuItem.ingredient.map((ingr) => {
                            const inventoryItem = inventoryItems.find((invItem) => invItem.id === ingr.inventoryId);
                            return inventoryItem ? inventoryItem.title : '';
                        }),
                }));
                setMenuItems(menuItemsWithIngredients);
                setFilterCat('Appetizers');
                setActiveCat('Appetizers');
                handleCatCardClick('Appetizers');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingData(false);
        }
    };



    const getAllInventoryItems = async () => {
        try {
            const data = await apiFetcher.get('inventory')
            if (data.length > 0) {
                setInventoryItems(data)
            }
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <div className={styles.menuCardParent}>
            <div className={styles.menuCardTopParent}>

                <div className='d-flex flex-column' style={{ minWidth: '100%', gap: '1rem', maxWidth: '85%' }}>
                    <Carousel fade className={styles.carouselParent} controls={false}>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={c1}
                                style={{ maxHeight: '60vh' }}
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h5>First slide label</h5>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={c2}
                                alt="Second slide"
                                style={{ maxHeight: '60vh' }}
                            />
                            <Carousel.Caption>
                                <h5>Second slide label</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={c3}
                                alt="Third slide"
                                style={{ maxHeight: '60vh' }}
                            />
                            <Carousel.Caption>
                                <h5>Third slide label</h5>
                                <p>
                                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>

            <div className='d-flex'>
                <div className={styles.left}>
                    <ul>
                        <li className={filterSubCat === 'deals' ? styles.activeTab : ''} onClick={() => handleSubCatCardClick('deals')} >Deals</li>

                        {
                            subCats.length > 0 && subCats.map((cat, index) => {
                                return (
                                    <li key={index} className={filterSubCat === cat ? styles.activeTab : ''} onClick={() => handleSubCatCardClick(cat)} >{cat}</li>

                                )
                            })
                        }

                    </ul>
                </div>

                <div className={styles.menuCardBottomParent}>
                    <div className={styles.menuCardMiddleParent}>


                        <div className={styles.wrapper} onClick={() => handleCatCardClick('Appetizers')}>
                            <div className={styles.card}><img src={appetizer} />
                                <div className={styles.info}>
                                    <h1>Appetizers</h1>
                                    <p>Indulge in delectable appetizers that tantalize your taste buds!</p>

                                </div>
                            </div>
                        </div>

                        <div className={styles.wrapper} onClick={() => handleCatCardClick('Main Course')}>
                            <div className={styles.card}><img src={mainCourse} />
                                <div className={styles.info}>
                                    <h1>Main Course</h1>
                                    <p>Experience culinary excellence with our flavorful main course options.</p>

                                </div>
                            </div>
                        </div>

                        <div className={styles.wrapper} onClick={() => handleCatCardClick('Desserts')}>
                            <div className={styles.card}><img src={dessert} />
                                <div className={styles.info}>
                                    <h1>Desserts</h1>
                                    <p>Delight in irresistible desserts that sweeten your day.</p>

                                </div>
                            </div>
                        </div>

                        <div className={styles.wrapper} onClick={() => handleCatCardClick('Beverages')}>
                            <div className={styles.card}><img src={beverages} />
                                <div className={styles.info}>
                                    <h1>Beverages</h1>
                                    <p>Sip on refreshing beverages that complement every bite.</p>

                                </div>
                            </div>
                        </div>

                    </div>
                    <h2 className='text-center' style={{ marginTop: '1.4rem' }}>{activeCat}</h2>
                    <div className={styles.menuCardsParent}>
                        {filterSubCat !== 'deals' && menuItems.length > 0 &&
                            menuItems
                                .filter((item) => item.category.toLowerCase().includes(filterCat.toLowerCase()) && item.subCategory?.toLowerCase().includes(filterSubCat?.toLowerCase()))
                                .map((menu, index) => (
                                    <div className={styles.cardd} key={index}>
                                        <div className={styles.cardHeader}>
                                            <div style={{ backgroundImage: `url(${menu.imgUrl})`, backgroundPosition: 'left center', backgroundSize: 'cover' }}></div>
                                        </div>
                                        <div className={styles.cardTitle}>
                                            <div>
                                                <div className={styles.menuItemName}>{menu.title}</div>
                                                <div className={styles.ingredients}>
                                                    {menu.actualIngredients.slice(0, 5).map((ingredient, index) => (
                                                        <span key={index}>{ingredient}{index === 4 ? '' : ','}{' '}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={styles.right}>${menu.price.split('$')[0]}</div>
                                        </div>
                                    </div>
                                ))
                        }
                        {
                            filterSubCat === 'deals' &&
                            deals.length > 0 &&
                            deals.map((deal, index) => {
                                return (
                                    <div key={index} className={styles.dealParent}>
                                        <div className={styles.dealCard}>
                                            <div className={styles.top}>
                                                <div className='d-flex align-items-center'>
                                                <div className={styles.round}><LocalOfferIcon fontSize='small' style={{ color: '#646a98' }}></LocalOfferIcon></div>
                                                <span className='ms-2' style={{fontWeight:'300'}}>{deal.title}</span>
                                                </div>
                                                <div className={styles.dealPrice}>${deal.price}</div>
                                            </div>
                                            <div className={styles.bottom}>
                                                {
                                                    deal.menuItems.length > 0 && deal.menuItems.map((menu: any, index: any) => {
                                                        return (
                                                            <div key={index} className={styles.menus}>
                                                                <span>{menu.title}</span>
                                                                <span>x{menu.servingSize}</span> 
                                                                
                                                                </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        }


                    </div>
                </div>
            </div>



        </div>
    )
}

export default MenuCard