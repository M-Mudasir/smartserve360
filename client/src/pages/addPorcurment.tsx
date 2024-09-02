import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../styles/addInventory.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import chefHat from '../media/chefHat.png'
import apiFetcher from '../helpers/api-fetcher';
import { useNavigate } from 'react-router-dom';

export default function AddPorcurment() {
    const navigate = useNavigate()
    const [items, setItems] = useState<any[]>([])
    const [vendors, setVendors] = useState<any[]>([])
    const [vendor, setVendor] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [unit, setUnit] = useState<string>('')
    const [reqBodyUnit, setReqBodyUnit] = useState<string>('')
    const [type, setType] = useState<string>('Grocery')
    const [purchaseDate, setPurchaseDate] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const [warning, setWarning] = useState<boolean>(false)
    const [submitWarning, setSubmitWarning] = useState<boolean>(false)

    const units = [
        { "id": 1, "title": "Kilogram" },
        { "id": 3, "title": "Litre" }
    ]


    useEffect(() => {
        // getVendorNames()
        // setVendor(vendors[0].name)
        const currentDate = new Date().toISOString().slice(0, 10);
        setPurchaseDate(currentDate)
        getItems()
        getVendors()
    }, [])

    const handleUnit = (input:string) => {

        setUnit(input)
        if (input === 'Litre') {
            setReqBodyUnit('litre')
        } else {
            setReqBodyUnit('kg')
        }

    }
    const handleQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = Number(inputValue);
        setQuantity(inputValue);
        if (isNaN(numericValue) || numericValue <= 0) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    }

    const handleVendorClick = (name: string) => {
        setVendor(name)
    }

    const resetForm = () => {
        setSubmitWarning(false)
        setWarning(false)
        setName('')
        setUnit('')
        setType('')
        setQuantity('')

    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()
        if (name === '' || quantity === '') {
            setSubmitWarning(true)
        }
        else {
            setSubmitWarning(false)
            const obj = items.find((i) => i?.title == name)
            const objVendor = vendors.find((i) => i?.fullName === vendor)
            await apiFetcher.post('purchase-orders', {
                "inventoryId": obj?.id,
                "vendorId": objVendor?.id,
                "quantityRequested": quantity,
                "status": "pending",
                "inventoryName": name,
                "inventoryUnit": type === 'article' ? 'each' : reqBodyUnit.toLowerCase(),
                "inventoryType": type.toLowerCase(),
                "vendorName": vendor
            })


            setTimeout(function () {
                navigate('/procurement')
            }, 3000);

        }

    }
    const getItems = async () => {
        try {
            //add service call for getting menu items here
            const data = await apiFetcher.get('inventory')
            data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
            setItems(data)
            setName(data[0]?.title)
            setUnit(units[0]?.title)
        } catch (e) {
            console.error(e)
        }
    }
    const getVendors = async () => {
        try {
            //add service call for getting menu items here
            const data = await apiFetcher.get('vendors')
            setVendors(data)
            setVendor(data[0]?.fullName)

        } catch (e) {
            console.error(e)
        }
    }


    return (
        <div className={styles.inventory} >
          
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">procurement</div>
                    <div className="PrevPath d-flex mt-1">Analyse / Procurement  / <div className="currentPath"> &nbsp;Add Procurement </div></div>
                </div>
            </div>


            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <div className={styles.form}>
                    <div className='formHeading'>Add new item</div>
                    <div className='enteries'>
                        <div className="label">Name</div>
                        <DropdownButton
                            variant="outline-secondary"
                            title={name}
                            id="input-group-dropdown-1"
                            className='dropdownInput'

                        >
                            {
                                items && items.map((item, index) => {
                                    return (
                                        <Dropdown.Item key={index} onClick={() => setName(item?.title)} href="#">
                                            {item?.title}
                                        </Dropdown.Item>
                                    );
                                })
                            }
                        </DropdownButton>

                        <div className="inputsRow">

                            {
                                type === 'Grocery' &&
                                <div className="first">  <div className="label" >Unit</div>
                                    <DropdownButton
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
                                </div>
                            }

                            <div className="first">
                                <div className="label">Type</div>
                                <DropdownButton
                                    variant="outline-secondary"
                                    title={type}
                                    id="input-group-dropdown-1"
                                    className='dropdownInput shortInput'
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
                            <div className="first">
                                <div className="label">Purchase date</div>
                                <input disabled className="shortInput purchaseDate" type='date' value={purchaseDate}></input>
                            </div>
                            <div className="first">
                                <div className="label">quantity</div>
                                <input placeholder='100' onChange={(e) => handleQuantity(e)} className="shortInput" type="number" value={quantity}></input>
                                {
                                    warning ? <p className='warning'>Quantity must be a positive number</p> : <></>
                                }
                            </div>
                        </div>
                        <div className="label">Vendor</div>
                        <DropdownButton
                            variant="outline-secondary"
                            title={vendor}
                            id="input-group-dropdown-1"
                            className='dropdownInput'
                        >
                            {
                                vendors.map((vendor, index) => {
                                    return (
                                        <Dropdown.Item key={index} onClick={() => handleVendorClick(vendor.fullName)} href="#">{vendor.fullName}</Dropdown.Item>
                                    );
                                })
                            }


                        </DropdownButton>
                    </div>
                    {
                        submitWarning ? <p className='warning'>All fields must be filled</p> : <></>
                    }

                    <div className="d-flex  mt-4">
                        <button type='submit' className='button btnText me-3'>
                            Submit
                        </button>
                        <button type="button" onClick={() => resetForm()} className='resetButton btnText '>
                            Reset
                        </button>
                    </div>
                </div>


            </form>
            <img alt="side pic of dispatch" src={chefHat} className='image'></img>
        </div>
    );
}