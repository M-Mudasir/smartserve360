import React, { Dispatch, SetStateAction, useEffect, useState, } from 'react'
import Table from 'react-bootstrap/Table';
import apiFetcher from '../../../helpers/api-fetcher';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import { CircularProgress, Divider, IconButton } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor:
                '#58a188'
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor:
              '#58a188'
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundColor:
            '#58a188',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundColor:
            '#58a188'
    }),
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <RestaurantMenuIcon />,
        2: <SettingsIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

const steps = ['Select menu items', 'Add details'];
interface selectedMenuItems {
    id: number;
    title: string;
}
interface selectedMenuItemsQuantity {
    id: number;
    quantity: number;
}
interface props {
    setCurrentTab: Dispatch<SetStateAction<string>>
}
function AddDeal({ setCurrentTab }: props) {
    const [menuItems, setMenuItems] = useState<any[]>([])
    const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([])
    const [show, setShow] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<selectedMenuItems[]>([]);
    const [selectedMenuQuantity, setSelectedMenuQuantity] = useState<selectedMenuItemsQuantity[]>([]);
    const [dealName, setDealName] = useState<string>('')
    const [dealPrice, setDealPrice] = useState<number>(0)
    const [priceWarning, setPriceWarning] = useState<boolean>(false)
    const [submitWarning, setSubmitWarning] = useState<boolean>(false)
    const [QuantityWarning, setQuantityWarning] = useState<boolean>(false)
    const [searchBy, setSearchBy] = useState<string>('name')
    const [search, setSearch] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [deals, setDeals] = useState<any[]>([]);
    const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false)
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = searchParams.get('id');
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        getAllItems()
        fetchDeals()
    }, [])
    useEffect(() => {
        if (params) {
            getDeal()
        }
    }, [params])
    const handleCloseModal = () => setShow(false);

    const getDeal = async () => {

        try {
            const data = await apiFetcher.get(`deals/${params}`);
            setDealName(data?.title)
            setDealPrice(data?.price)

            data?.menuItems.length > 0 && data?.menuItems.map((item: any) => {
                setSelectedMenu(previtems => [...previtems, { id: item.id, title: item.title }]);
                setSelectedMenuQuantity(prevQuantities => [
                    ...prevQuantities,
                    { id: item.id, quantity: item.quantity }
                ]);
            })


        } catch (e) {
            console.error(e);
        }
    };

    const fetchDeals = async () => {
        const data = await apiFetcher.get("deals");
        if (data) {
            setDeals(data);
        }
    };
    const getAllItems = async () => {
        try {
            const data = await apiFetcher.get('menu-item')
            setMenuItems(data)
            setFilteredMenuItems(data)
        } catch (e) {
            console.error(e)
        }
    }
    const handleCheckboxClick = (event: any, item: any) => {
        setSelectedMenu(previtems => event.target.checked ? [...previtems, { id: item.id, title: item.title }] : previtems.filter(menu => menu.id !== item.id));
        if (!(event.target.checked)) {
            const updatedQuantity = selectedMenuQuantity.filter((menu) => menu.id !== item.id)
            setSelectedMenuQuantity(updatedQuantity)
        }
    }

    const handleDealPrice = (e: any) => {
        const price = e.target.value
        setDealPrice(price)
        const regExp = /[a-zA-Z]/g;
        if (!isNaN(price) && price > 0 && !regExp.test(price)) {
            setPriceWarning(false)
        }
        else {
            setPriceWarning(true)
        }
    }
    const handleQuantity = (e: any, itemId: number) => {
        const { value } = e.target;
        const quantity = parseInt(value);

        if (!isNaN(quantity) && quantity >= 0) {
            setQuantityWarning(false)
        } else {
            setQuantityWarning(true)
        }
        // Check if the item ID already exists in selectedMenuQuantity
        const existingItem = selectedMenuQuantity.find(item => item.id === itemId);

        if (existingItem) {
            // Update the quantity for the existing item
            const updatedQuantities = selectedMenuQuantity.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setSelectedMenuQuantity(updatedQuantities);
        } else {
            // Append a new object for the item ID
            setSelectedMenuQuantity(prevQuantities => [
                ...prevQuantities,
                { id: itemId, quantity }
            ]);
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
        }
        else {
            // Reset items array when search input is empty
            setFilteredMenuItems(menuItems);
        }
    };

    const handleDealName = (e: any) => {
        setDealName(e.target.value)
    }
    const saveDetails = () => {
        if (deals.length > 0 && deals?.map(item => item.title?.toLowerCase()).includes(dealName.toLowerCase())) {
            setDuplicateWarning(true)
            return
        }
        const quantityError = selectedMenuQuantity.find(item => item.quantity === 0 || item.quantity === null || isNaN(item.quantity)) !== undefined;
        const priceError = dealPrice === 0 || dealPrice === null || isNaN(dealPrice) === undefined;
        if (priceError || dealName === '' || quantityError || selectedMenuQuantity.length !== selectedMenu.length) {
            setSubmitWarning(true)
            return
        } else {
            setSubmitWarning(false)
            setShow(false)
        }
    }
    const createDeal = async () => {
        setIsLoading(true)
        if (deals.length > 0 && deals?.map(item => item.title?.toLowerCase()).includes(dealName.toLowerCase())) {
            setDuplicateWarning(true)
            return
        }
        else {
            setDuplicateWarning(false)
        }
        const quantityError = selectedMenuQuantity.find(item => item.quantity === 0 || item.quantity === null || isNaN(item.quantity)) !== undefined;
        const priceError = dealPrice === 0 || dealPrice === null || isNaN(dealPrice) === undefined;
        if (priceError || dealName === '' || quantityError || selectedMenuQuantity.length !== selectedMenu.length) {
            setSubmitWarning(true)
            return
        } else {
            setSubmitWarning(false)

        }
        const menulist: any = menuItems
            .filter(menu => selectedMenuQuantity.some(item => item.id === menu.id))
            .map(menu => ({
                ...menu,
                quantity: selectedMenuQuantity.find(item => item.id === menu.id)?.quantity || 0,
                id: menu.id
            }));

        try {
            const data = await apiFetcher.post('deals', {
                title: dealName,
                menuItems: menulist,
                price: dealPrice
            })
            if (data) {
                setCurrentStep(0)
                cleanUp()
                Swal.fire({
                    title: 'Success!',
                    text: 'Deal created successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }
    const cleanUp = () => {
        setDealName('');
        setDealPrice(0);
        setSelectedMenu([]);
        setSelectedMenuQuantity([]);
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleFilter = (name: string) => {
        setSearchBy(name);
        handleClose()
    }
    const editDeal = async () => {
        if (deals.length > 0) {
            const items = deals.filter(item => item.title?.toLowerCase() === dealName.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateWarning(true);
                return;
            } else {
                setDuplicateWarning(false);
            }
        }
        const quantityError = selectedMenuQuantity.find(item => item.quantity === 0 || item.quantity === null || isNaN(item.quantity)) !== undefined;
        if (priceWarning || dealName === '' || quantityError) {
            setSubmitWarning(true)
            return
        } else {
            setSubmitWarning(false)

        }
        const menulist: any = menuItems
            .filter(menu => selectedMenuQuantity.some(item => item.id === menu.id))
            .map(menu => ({
                ...menu,
                quantity: selectedMenuQuantity.find(item => item.id === menu.id)?.quantity || 0,
                id: menu.id
            }));

        try {
            const data = await apiFetcher.put(`deals/${params}`, {
                title: dealName,
                menuItems: menulist,
                price: dealPrice
            })
            if (data) {
                setCurrentStep(0)
                cleanUp()
                Swal.fire({
                    title: 'Success!',
                    text: 'Deal Edited successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                navigate('/menu-items')
                setCurrentTab('Deals')
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className='ms-4 mt-4' >
            <Modal
                show={show} onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Just few more steps left...
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Deal Name</InputGroup.Text>
                            <Form.Control
                                onChange={(e) => handleDealName(e)}
                                placeholder="Family Combo 1"
                                aria-label="deal name"
                                value={dealName}
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        {
                            duplicateWarning && <p className='warning'>Deal with this name already exists</p>
                        }

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Deal Price</InputGroup.Text>
                            <Form.Control
                                onChange={(e) => handleDealPrice(e)}
                                placeholder="20 $"
                                aria-label="deal price"
                                value={dealPrice}
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        {
                            priceWarning && <p className='warning'>Please enter a valid number</p>
                        }
                        {
                            selectedMenu?.length > 0 && selectedMenu?.map((menu, index) => {
                                return (
                                    <InputGroup key={index} className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Quantity of {menu.title}</InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => handleQuantity(e, menu.id)}
                                            placeholder="0"
                                            value={selectedMenuQuantity[index]?.quantity || ''}
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                )
                            })
                        }
                        {
                            QuantityWarning && <p className='warning'>Please enter a valid number</p>
                        }


                    </>
                </Modal.Body>
                <Modal.Footer>
                    {
                        submitWarning && <p className='warning'>Please fill all the fields correctly</p>
                    }
                    {
                        params ? <Button title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to edit a deal'} onClick={editDeal} disabled={selectedMenu.length === 0}>Edit Deal</Button> : <Button title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to create a deal'} onClick={createDeal} disabled={selectedMenu.length === 0}>Create Deal</Button>
                    }
                    <Button variant='secondary' onClick={saveDetails}>Save Details</Button>

                </Modal.Footer>
            </Modal>
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Add Deal</div>
                    <div className="PrevPath d-flex mt-1">Manage / Deals / <div className="currentPath"> &nbsp;Add Deal</div></div>
                </div>
            </div>
            <Stepper alternativeLabel activeStep={currentStep} className='my-2' connector={<ColorlibConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {
                currentStep === 0 && <>
                    <div className='mb-1 mt-3 d-flex  ' style={{ alignItems: 'center', justifyContent: 'space-between' }}>

                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center searchBox' style={{ backgroundColor: 'white' }} >
                                <div><SearchOutlinedIcon color='disabled'></SearchOutlinedIcon></div>
                                <input style={{ backgroundColor: 'white' }} onChange={handleSearch} value={search} className='searchBox' placeholder={`Search Items By ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}`}></input>
                            </div>
                            <IconButton onClick={handleClick}><FilterListSharpIcon /></IconButton>

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
                                <Typography sx={{ px: 1, textAlign: 'start', paddingTop: '0.5rem' }}>Search By: </Typography>
                                <MenuList sx={{ py: 2, textAlign: 'start', width: '12rem' }}>
                                    <Divider />
                                    <MenuItem style={{ backgroundColor: searchBy === 'name' ? '#ececec' : '' }} onClick={() => handleFilter('name')}>Menu Item</MenuItem>
                                    <MenuItem style={{ backgroundColor: searchBy === 'category' ? '#ececec' : '' }} onClick={() => handleFilter('category')}>Category</MenuItem>
                                    <MenuItem style={{ backgroundColor: searchBy === 'price' ? '#ececec' : '' }} onClick={() => handleFilter('price')}>Price</MenuItem>

                                </MenuList>
                            </Popover>
                        </div>

                        <div>

                            {
                                selectedMenu.length !== 0 && <button className='button btnText ' title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to add details'}>
                                    <div onClick={() => setCurrentStep(1)} className='link'>
                                        Next Step
                                    </div></button>
                            }

                            <div>
                                {
                                    submitWarning && <p className='warning me-2 '>Please fill all the fields correctly</p>
                                }
                                {
                                    duplicateWarning && <p className='warning'>Deal with this name already exists</p>
                                }

                            </div>
                        </div>

                    </div>
                    <div style={{ maxHeight: '75vh', overflowY: 'scroll', overflowX: 'scroll', minWidth: '75vw' }}>
                        <Table striped bordered hover size="lg" >
                            <thead style={{ borderRadius: '8px', position: 'sticky' }}>
                                <tr>
                                    <th className='customTableHead text-center'>Select</th>
                                    <th className='customTableHead text-center'>Menu Items</th>
                                    <th className='customTableHead text-center'>Price</th>
                                    <th className='customTableHead text-center'>Category</th>
                                    <th className='customTableHead text-center'>Sub Category</th>
                                    <th className='customTableHead text-center'>Serving Size</th>
                                </tr>
                            </thead>
                            <tbody style={{ maxHeight: '10rem', overflowY: 'scroll', margin: '1.5rem', }}>
                                {
                                    filteredMenuItems.map((menu, index) => {
                                        const isChecked = selectedMenu.some(item => item.id === menu.id);

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <InputGroup.Checkbox
                                                        className='text-center'
                                                        checked={isChecked}
                                                        onChange={(e) => handleCheckboxClick(e, menu)}
                                                        aria-label="Checkbox for following text input"
                                                    />
                                                </td>
                                                <td className='text-center'>{menu.title}</td>
                                                <td className='text-center'>{menu.price}</td>
                                                <td className='text-center'>{menu.category}</td>
                                                <td className='text-center'>{menu.subCategory}</td>
                                                <td className='text-center'>{menu.servingSize}</td>
                                            </tr>
                                        );
                                    })
                                }

                            </tbody>
                        </Table>
                    </div>
                </>
            }
            {
                currentStep === 1 && !isLoading && <>
                    <div className='d-flex justify-content-end mt-4 mb-3'>
                        <button className='button btnText me-2' title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to add details'}>
                            <div onClick={() => setCurrentStep(0)} className='link'>
                                Previous Step
                            </div></button>

                        <>{
                            !params && <>
                                {
                                    isLoading ? <button className='button btnText me-3 mt-4' ><CircularProgress style={{ height: '0.7rem', width: '0.7rem', color: 'white', marginRight: '0.3rem' }} />Please Wait</button> :
                                        <button className='button btnText ' title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to add details'}>
                                            <div onClick={() => createDeal()} className='link'>
                                                Create Deal
                                            </div></button>
                                }
                            </>


                        }</>
                        <>{
                            params && <button className='button btnText ' title={selectedMenu.length === 0 ? 'First select menu items' : 'Click to add details'}>
                                <div onClick={() => editDeal()} className='link'>
                                    Edit Deal
                                </div></button>
                        }</>
                    </div>
                    {
                        submitWarning && <p className='warning me-2 '>Please fill all the fields correctly</p>
                    }
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Deal Name</InputGroup.Text>
                        <Form.Control
                            onChange={(e) => handleDealName(e)}
                            placeholder="Family Combo 1"
                            aria-label="deal name"
                            value={dealName}
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    {
                        duplicateWarning && <p className='warning'>Deal with this name already exists</p>
                    }

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Deal Price</InputGroup.Text>
                        <Form.Control
                            onChange={(e) => handleDealPrice(e)}
                            placeholder="20 $"
                            aria-label="deal price"
                            value={dealPrice}
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    {
                        priceWarning && <p className='warning'>Please enter a valid number</p>
                    }
                    {
                        selectedMenu?.length > 0 && selectedMenu?.map((menu, index) => {
                            return (
                                <InputGroup key={index} className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Quantity of {menu.title}</InputGroup.Text>
                                    <Form.Control
                                        onChange={(e) => handleQuantity(e, menu.id)}
                                        placeholder="0"
                                        value={selectedMenuQuantity[index]?.quantity || ''}
                                        aria-describedby="basic-addon1"
                                    />
                                </InputGroup>
                            )
                        })
                    }
                    {
                        QuantityWarning && <p className='warning'>Please enter a valid number</p>
                    }


                </>
            }


        </div >
    )
}

export default AddDeal