import DeatailsTable from '../../components/table';
import styles from '../../styles/staff.module.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import { Divider, IconButton } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useNavigate } from 'react-router-dom';
import apiFetcher from '../../helpers/api-fetcher';
import 'react-toastify/dist/ReactToastify.css';
import dashboardStyles from '../../styles/dashboard.module.css';
import Accordion from 'react-bootstrap/Accordion';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { BallTriangle } from 'react-loader-spinner'


interface props {
    setCurrentTab: Dispatch<SetStateAction<string>>
    currentTab: string
}
export default function Menu({ setCurrentTab, currentTab }: props) {
    const [search, setSearch] = useState<string>('');
    const currency = localStorage.getItem('currency')
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchBy, setSearchBy] = useState<string>('name');
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([]);
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useNavigate();

    const columns = [
        { id: 'title', label: 'Menu Item', minWidth: 100 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'subCategory', label: ' Sub-category', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100 },
        { id: 'servingSize', label: 'Serving', minWidth: 100 },
        { id: 'action', label: 'Action', minWidth: 100 },
    ];

    useEffect(() => {
        getAllItems();
        fetchDeals();
    }, []);

    const getAllItems = async () => {
        setIsLoading(true)
        try {
            const data = await apiFetcher.get('menu-item');
            setMenuItems(data);
            setFilteredMenuItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false)
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
        if (searchBy === 'name') {
            const filteredItems = menuItems.filter((menuItem) =>
                menuItem.title.toLowerCase().includes(e.currentTarget.value.toLowerCase())
            );
            setFilteredMenuItems(filteredItems);
        } else if (searchBy === 'price') {
            const filteredItems = menuItems.filter((menuItem) =>
                menuItem.price.toString().toLowerCase().includes(e.currentTarget.value.toLowerCase())
            );
            setFilteredMenuItems(filteredItems);
        } else if (searchBy === 'category') {
            const filteredItems = menuItems.filter((menuItem) =>
                menuItem.category.toLowerCase().includes(e.currentTarget.value.toLowerCase())
            );
            setFilteredMenuItems(filteredItems);
        } else {
            // Reset items array when search input is empty
            setFilteredMenuItems(menuItems);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (name: string) => {
        setSearchBy(name);
        handleClose();
    };

    const editMenuItem = (menuId: number) => {
        try {
            router(`/menu-items/add-menu-item?id=${menuId}`);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteMenuItem = async (menuId: number) => {
        try {
            if (menuId) {
                await apiFetcher.delete(`menu-item/${menuId}`);
                getAllItems();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchDeals = async () => {
        const data = await apiFetcher.get("deals");
        if (data) {
            // Sort the data based on the createdAt property
            data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setDeals(data);
        }
    };

    async function deleteDeal(id: any, e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        try {
            if (id) {
                await apiFetcher.delete(`deals/${id}`);
                fetchDeals();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function editDeal(id: any, e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        try {
            router(`/menu-items/add-deal?id=${id}`);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={styles.inventory} >
            <div className={styles.menuHeader}>
                <div
                    className={`${dashboardStyles.dashboardHeaderItem} ${currentTab === 'Menu Items' ? styles.active : ''
                        }`}
                    onClick={() => setCurrentTab('Menu Items')}
                >
                    Menu Items
                </div>
                <div
                    className={`${dashboardStyles.dashboardHeaderItem} ${currentTab === 'Deals' ? styles.active : ''
                        }`}
                    onClick={() => setCurrentTab('Deals')}
                >
                    Deals
                </div>
            </div>
            {currentTab === 'Menu Items' && (
                <>
                    <div className="head d-flex justify-content-between mt-3">
                        <div>
                            <div className="pageHead">Menu Items</div>
                            <div className="PrevPath d-flex mt-1">
                                Analyse / <div className="currentPath"> &nbsp; Menu Items</div>
                            </div>
                        </div>
                        <div className=" ">
                            <button className="button btnText me-2 ">
                                <div onClick={() => router('/menu-items/add-menu-item')} className="link">
                                    Add Menu Item
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <div className={`${styles.header} d-flex justify-content-between align-items-center mb-2`} >
                            <div className="tableHead">Current Menu Items</div>
                            <div  className={`${styles.searchh} d-flex align-items-center`}>
                                <div className="d-flex align-items-center searchBox">
                                    <div>
                                        <SearchOutlinedIcon color="disabled" />
                                    </div>
                                    <input
                                        onChange={handleSearch}
                                        value={search}
                                        className="searchBox"
                                        placeholder={`Search Items By ${searchBy.charAt(0).toUpperCase() +
                                            searchBy.slice(1)}`}
                                    ></input>
                                </div>
                                <IconButton onClick={handleClick}>
                                    <FilterListSharpIcon />
                                </IconButton>

                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    sx={{ my: 1 }}
                                >
                                    <Typography sx={{ px: 1, textAlign: 'start', paddingTop: '0.5rem' }}>
                                        Search By:{' '}
                                    </Typography>
                                    <MenuList sx={{ py: 2, textAlign: 'start', width: '12rem' }}>
                                        <Divider />
                                        <MenuItem
                                            style={{ backgroundColor: searchBy === 'name' ? '#ececec' : '' }}
                                            onClick={() => handleFilter('name')}
                                        >
                                            Menu Item
                                        </MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: searchBy === 'category' ? '#ececec' : '' }}
                                            onClick={() => handleFilter('category')}
                                        >
                                            Category
                                        </MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: searchBy === 'price' ? '#ececec' : '' }}
                                            onClick={() => handleFilter('price')}
                                        >
                                            Price
                                        </MenuItem>
                                    </MenuList>
                                </Popover>
                            </div>
                        </div>
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
                            !isLoading && menuItems.length > 0 &&
                            <DeatailsTable
                                edit={editMenuItem}
                                _delete={deleteMenuItem}
                                dummyData={filteredMenuItems}
                                columns={columns}
                                title="Current Staff"
                            />
                        }
                    </div>
                </>
            )}

            {currentTab === 'Deals' && (
                <>
                    <div className="head d-flex justify-content-between mt-3">
                        <div>
                            <div className="pageHead">Deals</div>
                            <div className="PrevPath d-flex mt-1">
                                Manage / <div className="currentPath"> &nbsp; Deals</div>
                            </div>
                        </div>
                        <div className=" ">
                            <button className="button btnText ">
                                <div onClick={() => router('/menu-items/add-deal')} className="link">
                                    Add Deal
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        {deals.length > 0 &&
                            deals.map((deal, index) => (
                                <Accordion key={index} >
                                    <Accordion.Item eventKey={index.toString()}>
                                        <Accordion.Header >
                                            <div className='d-flex justify-content-between align-items-center' style={{ minWidth: "95%" }}>
                                                <div>{deal.title}</div>
                                                <div className=''>
                                                    <IconButton onClick={(e) => editDeal(deal.id, e)} className='py-0'>
                                                        <EditOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton onClick={(e) => deleteDeal(deal.id, e)} className='py-0'>
                                                        <DeleteOutlinedIcon color="error" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                {
                                                    deal.menuItems.length > 0 && deal.menuItems.map((menu: any, index: number) => {
                                                        return (
                                                            <li>
                                                                <div className='d-flex justify-content-between pe-5'>
                                                                    <span>{menu.title}</span>
                                                                    <span style={{ fontWeight: 500 }}>x{menu.quantity}</span>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>

                                            <div>
                                                <span style={{ fontWeight: 500 }}>Price: {currency}{deal.price}</span>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
