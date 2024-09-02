import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../styles/addInventory.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import chefHat from '../media/chefHat.png'
import { useLocation, useNavigate } from 'react-router-dom';
import apiFetcher from '../helpers/api-fetcher';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material';
import Switch from '@mui/material/Switch';

export default function AddInventory() {
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = searchParams.get('id');
    const [name, setName] = useState<string>('')
    const [brandName, setBrandName] = useState<string>('')
    const [unit, setUnit] = useState<string>('Kilogram')
    const [quantity, setQuantity] = useState<number>(0)
    const [reqBodyunit, setReqBodyUnit] = useState<string>('kg')
    const [type, setType] = useState<string>('Grocery')
    const [purchaseDate, setPurchaseDate] = useState<string>('')
    const [expiryDate, setExpiryDate] = useState<string>('')
    const [submitWarning, setSubmitWarning] = useState<boolean>(false)
    const [quantityWarning, setquantityWarning] = useState<boolean>(false)
    const [invenrtoryItems, setInventoryItems] = useState<any[]>([])
    const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false)
    const [isloadingSubmit, setIsloadingSubmit] = useState<boolean>(false)
    const [automation, setAutomation] = useState(false)
    const [autoQuantity, setAutoQuantity] = useState<number>(0)
    const [interval, setInterval] = useState<number>(0)
    const [autoExpiry, setAutoExpiry] = useState<number>(0)


    const units = [
        { "id": 1, "title": "Kilogram" },
        { "id": 3, "title": "Litre" }
    ]

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAutomation(event.target.checked);
    };

    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 10);
        setPurchaseDate(currentDate)
        getAllItems()
    }, [])
    useEffect(() => {
        if (params) {
            getInventory()
        }
    }, [params])

    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.trim();
        setQuantity(parseInt(input));
        if (!(/^\d+$/.test(input) && parseInt(input, 10) >= 0)) {
            setquantityWarning(true)
        } else {
            setquantityWarning(false)
        }
    }
    const resetForm = () => {
        setSubmitWarning(false)
        setName('')
        setUnit('')
        setReqBodyUnit('')
        setType('')
        setBrandName("")
        setExpiryDate("")

    }
    const getInventory = async () => {
        try {
            const data = await apiFetcher.get(`inventory/${params}`)
            if (data?.expiryDate) {
                const date = data?.expiryDate.split('T')
                setExpiryDate(date[0])
            }

            if (data?.createdAt) {
                const date = data?.createdAt.split('T')
                setPurchaseDate(date[0])
            }
            setName(data?.title)
            data?.inventoryUnit === 'kg' ? setUnit('Kilogram') : setUnit('Litre')
            setReqBodyUnit(data?.inventoryType)
            setBrandName(data?.itemBrand)
            setQuantity(data?.quantity)
            setAutomation(data?.automation)
            setAutoExpiry(data?.automation ? data?.expiryInDays : 0)
            setInterval(data?.automation ? data?.interval : 0)
            setAutoQuantity(data?.automation ? data?.automated_quantity : 0)

        } catch (e) {
            console.error(e)
        }
    }


    const handleFormSubmit = async (e: any) => {
        e.preventDefault()
        if (invenrtoryItems.length > 0) {
            const items = invenrtoryItems.filter(item => item.title?.toLowerCase() === name.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateWarning(true);
                return;
            } else {
                setDuplicateWarning(false);
            }
        }
        if (name === '' || brandName === '' || unit === '' || type === '' || expiryDate === "" || quantityWarning || quantity == 0) {
            setSubmitWarning(true)
        }
        else {
            setSubmitWarning(false)
            if (params) {
                setIsloadingSubmit(true)
                const data = await apiFetcher.put(`inventory/${params}`, {
                    "title": name,
                    "quantity": quantity,
                    "itemBrand": brandName,
                    "inventoryUnit": type === 'article' ? 'each' : reqBodyunit === 'Litre' ? 'L' : 'Kg',
                    "expiryDate": expiryDate,
                    "inventoryType": type.toLowerCase(),
                    "automation": automation,
                    "automated_quantity": automation ? autoQuantity : 0,
                    "interval": automation ? interval : 0,
                    "expiryInDays": automation ? autoExpiry : 0,
                })
                if (data?.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update inventory.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Inventory updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/inventory')
                        }
                    });
                }
            } else {
                setIsloadingSubmit(true)
                const data = await apiFetcher.post('inventory', {
                    "title": name,
                    "quantity": quantity,
                    "remainingQuantity": 0,
                    "itemBrand": brandName,
                    "inventoryUnit": type === 'article' ? 'each' : reqBodyunit === 'Litre' ? 'L' : 'Kg',
                    "expiryDate": expiryDate,
                    "purchaseDate": purchaseDate,
                    "inventoryType": type.toLowerCase(),
                    "automation": automation,
                    "automated_quantity": automation ? autoQuantity : 0,
                    "interval": automation ? interval : 0,
                    "expiryInDays": automation ? autoExpiry : 0,
                })
                if (data?.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to create inventory.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Inventory created successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/inventory')
                        }
                    });
                }
            }

        }
        setIsloadingSubmit(false)
    }
    const handleUnit = (unit: string) => {
        setUnit(unit)
        if (unit === 'Litre') {
            setReqBodyUnit('litre')
        } else {
            setReqBodyUnit('kg')
        }
    }
    const getAllItems = async () => {
        try {
            const data = await apiFetcher.get('inventory')
            if (data.length > 0) {
                setInventoryItems(data)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const handleAutoExpiry = (e: any) => {
        setAutoExpiry(e.target.value)
    }
    const handleInterval = (e: any) => {
        setInterval(e.target.value)
    }
    const handleAutoQuantity = (e: any) => {
        setAutoQuantity(e.target.value)
    }

    return (
        <div className={styles.inventory} >
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Inventory</div>
                    <div className="PrevPath d-flex mt-1">Analyse / Inventory / <div className="currentPath"> &nbsp;Add Inventory</div></div>
                </div>
            </div>


            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <div className={styles.form}>
                    <div className='d-flex justify-content-between'>
                        <div className='formHeading'>Add new item</div>
                        <Switch
                            checked={automation}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            title='Automate the inventory addition process'
                        />
                    </div>
                    <div className='enteries'>
                        <div className="label">Name</div>
                        <input disabled={params ? true : false} className="longInput" placeholder='name' onChange={(e) => handleName(e)} value={name}></input>
                        {
                            duplicateWarning && <p className='warning'>Inventory with this name already exists</p>
                        }
                        <div className="inputsRow">
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Brand Name</div>
                                <input disabled={params ? true : false} className="shortInput" placeholder='name' onChange={(e) => setBrandName(e?.target?.value)} value={brandName}></input>
                            </div>
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Quantity</div>
                                <input className="shortInput " placeholder='0' type='number' onChange={(e) => handleQuantity(e)} value={quantity}></input>
                                {
                                    quantityWarning && <p className='warning'>Quantity must be a valid number</p>
                                }
                            </div>
                        </div>

                        <div className={type === 'Grocery' ? 'inputsRow' : ''}>

                            <div className="first" style={{ width: '48%' }}>

                                {
                                    type === 'Grocery' &&
                                    <>
                                        <div className="label" >Unit</div>
                                        <DropdownButton
                                            disabled={params ? true : false}
                                            variant="outline-secondary"
                                            title={unit}
                                            id="input-group-dropdown-1"
                                            className='dropdownInput shortInput'
                                        >
                                            {
                                                units.map((unit, index) => {
                                                    return (
                                                        <Dropdown.Item key={index} onClick={() => handleUnit(unit.title)} href="#">{unit.title}</Dropdown.Item>
                                                    );
                                                })
                                            }
                                        </DropdownButton>
                                    </>
                                }

                            </div>
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Type</div>
                                <DropdownButton
                                    variant="outline-secondary"
                                    title={type}
                                    id="input-group-dropdown-1"
                                    className='dropdownInput shortInput'
                                    disabled={params ? true : false}
                                >
                                    {
                                        [{ id: 1, name: "Grocery" }, { id: 2, name: "Article" }].map((item, index) => {
                                            return (
                                                <Dropdown.Item key={index} onClick={() => setType(item.name)} href="#">{item.name}</Dropdown.Item>
                                            );
                                        })
                                    }
                                </DropdownButton>
                            </div>


                        </div>

                        <div className="inputsRow">
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Purchase date</div>
                                <input disabled className="shortInput purchaseDate" type='date' value={purchaseDate}></input>
                            </div>
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Expiry date</div>
                                <input disabled={params ? true : false} className="shortInput purchaseDate" type='date' onChange={(e) => setExpiryDate(e?.target?.value)} value={expiryDate}></input>
                            </div>
                        </div>
                        {
                            automation && <>
                                <div className="inputsRow">
                                    <div className="first" style={{ width: '48%' }}>
                                        <div className="label">Automated quantity</div>
                                        <input className="shortInput purchaseDate" placeholder='100' type='number' value={autoQuantity} onChange={(e) => handleAutoQuantity(e)}></input>
                                    </div>
                                    <div className="first" style={{ width: '48%' }}>
                                        <div className="label">Interval in days</div>
                                        <input className="shortInput purchaseDate" placeholder='4' type='number' onChange={(e) => handleInterval(e)} value={interval}></input>
                                    </div>
                                </div>
                                <div className="label">Expiry in days</div>
                                <input className="longInput" placeholder='3' type='number' onChange={(e) => handleAutoExpiry(e)} value={autoExpiry}></input>
                            </>
                        }

                    </div>
                    {
                        submitWarning ? <p className='warning'>All fields must be filled</p> : <></>
                    }
                    {
                        isloadingSubmit ? <button className='button btnText me-3 mt-4' ><CircularProgress style={{ height: '0.7rem', width: '0.7rem', color: 'white', marginRight: '0.3rem' }} />Please Wait</button> :

                            <div className="d-flex  mt-4">
                                <button type='submit' className='button btnText me-3'>
                                    {params ? 'Update' : 'Submit'}
                                </button>
                                <button type="button" onClick={() => resetForm()} className='resetButton btnText '>
                                    Reset
                                </button>
                            </div>
                    }

                </div>


            </form>
            <img alt="side pic of dispatch" src={chefHat} className='image'></img>
        </div>
    );
}