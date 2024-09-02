import { ChangeEvent, useState, useEffect } from 'react';
import styles from '../../../styles/addInventory.module.css'
import chefHat from '../../../media/chefHat.png'
import Modal from 'react-bootstrap/Modal';
import apiFetcher from '../../../helpers/api-fetcher';
import { useNavigate, useLocation } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Cookies from "js-cookie";
import Button from 'react-bootstrap/Button';
import LightbulbSharpIcon from '@mui/icons-material/LightbulbSharp';
import { CircularProgress, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import Swal from 'sweetalert2';
const accessToken = Cookies.get("accessToken");

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
interface Ingredient {
    ingredient: string;
    quantity: number;
    unit: string;
}
interface IngredientReqBody {
    inventoryId: string;
    quantity: number;
}
interface InventoryItem {
    createdAt: string;
    expiryDate: string;
    id: number;
    inventoryType: string;
    inventoryUnit: string;
    itemBrand: string;
    quantity: number;
    remainingQuantity: number;
    title: string;
    updatedAt: string;
}

export default function AddMenu() {
    const [disable, setDisabled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = searchParams.get('id');
    const [categories, setCategories] = useState<string[]>([])
    const [subCategories, setSubCategories] = useState<string[]>([])
    const [itemCategory, setItemCategory] = useState<string>()
    const [itemSubCategory, setItemSubCategory] = useState<string>()
    const [price, setPrice] = useState<string>('')
    const [recipe, setRecipe] = useState<string>('')
    const [servingSize, setServingSize] = useState<string>('')
    const [itemName, setItemName] = useState<string>('')
    const [submitWarning, setSubmitWarning] = useState<boolean>(false)
    const [image, setImage] = useState<File | null>(null);
    const [servingWarning, setServingSizeWarning] = useState<boolean>(false)
    const [show, setShow] = useState(false);
    const [invenrtoryItems, setInventoryItems] = useState<any[]>([])
    const [rows, setRows] = useState<number[]>([0, 1, 2, 3])
    const [final, setFinal] = useState<Ingredient[]>([]);
    const [error, setError] = useState<boolean>(false)
    const [quantityErrors, setQuantityErrors] = useState<boolean[]>([]);
    const [isloading, setIsloading] = useState<boolean>(false)
    const [isloadingSubmit, setIsloadingSubmit] = useState<boolean>(false)
    const [priceError, setPriceError] = useState<boolean>(false)
    const [showCheckbox, setShowCheckBox] = useState<boolean>(false)
    const [ingredientReq, setIngredientReq] = useState<IngredientReqBody[]>([])
    const [reloadFinalArray, setReloadFinalArray] = useState<Ingredient[]>([]);
    const [indices, setIndices] = useState<number[]>([])
    const [units, setUnits] = useState<string[]>([])
    const [menuItems, setMenuItems] = useState<any[]>([])
    const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false)
    const [customCategory, setCustomCategory] = useState('')
    const [customSubCategory, setCustomSubCategory] = useState('')
    const [duplicateCategoryWarning, setDuplicateCategoryWarning] = useState<boolean>(false)
    const [duplicateSubCategoryWarning, setDuplicateSubCategoryWarning] = useState<boolean>(false)


    useEffect(() => {
        getAllItems()
        getAllMenuItems()
        getAllCategories()
    }, [])

    useEffect(() => {
        const initialFinal = rows.map(() => ({ ingredient: '', quantity: 0, unit: '' }));
        setFinal(initialFinal);
        setQuantityErrors(initialFinal.map(() => false));
    }, []);

    useEffect(() => {
        if (params) {
            getMenuItem()
        }
    }, [params])

    const getAllMenuItems = async () => {
        try {
            const data = await apiFetcher.get('menu-item')
            setMenuItems(data)
        } catch (e) {
            console.error(e)
        }
    }
    const handleAddRow = () => {
        setRows((prevRows) => [...prevRows, prevRows.length + 1]);
        setFinal((prevFinal) => [...prevFinal, { ingredient: '', quantity: 0, unit: '' }]);
    };
    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
        const updatedFinal = [...final];
        updatedFinal[index] = {
            ...updatedFinal[index],
            [field]: value,
        };

        setFinal(updatedFinal);
        if (field === 'ingredient') {
            const selectedIngredientId = value.toString().split('-')[1];
            const invItem: InventoryItem | undefined = invenrtoryItems.find((item) => item.id == selectedIngredientId);

            if (invItem) {
                // updatedFinal[index].unit = invItem.inventoryUnit; // Assuming 'unit' is the field to store the units in the 'final' array
                // setFinal(updatedFinal);

                if (invItem.inventoryUnit === 'L') {
                    setUnits(['Litre', 'Millilitre']);
                } else {
                    setUnits(['Kilogram', 'Grams']);
                }
            }

        }
        if (field === 'quantity') {
            const isValidValue = typeof value === 'number' || !isNaN(parseFloat(value as string));
            const regex = /[a-zA-Z]/; // Regex to match alphabetic characters (both lowercase and uppercase)

            if (!isValidValue || parseFloat(value as string) <= 0 || regex.test(value as string)) {
                setQuantityErrors((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = true;
                    return updatedErrors;
                });
                updatedFinal[index].quantity = 0;
                setFinal(updatedFinal);
            } else {
                setQuantityErrors((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = false;
                    return updatedErrors;
                });
            }
        } else {
            setQuantityErrors((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = false;
                return updatedErrors;
            });
        }
    };

    const getAllItems = async () => {
        try {
            const data = await apiFetcher.get('inventory')
            const grocery = data.filter((item: any) => item.inventoryType === 'grocery')
            setInventoryItems(grocery)
        } catch (e) {
            console.error(e)
        }
    }

    const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value)
        let price = e.target.value
        const _price = parseInt(price)
        const regExp = /[a-zA-Z]/g;
        if (!isNaN(_price) && _price > 0 && !regExp.test(price)) {
            setPriceError(false)
        } else {
            setPriceError(true)
        }
    }
    const handleServingSize = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const value = parseFloat(inputValue);
        setServingSize(inputValue);
        const regExp = /[a-zA-Z]/g;
        if (!isNaN(value) && value > 0 && !regExp.test(inputValue)) {
            setServingSizeWarning(false);
        } else {
            setServingSizeWarning(true);
        }
    }
    const handleItemCategoryClick = (item: string) => {
        setItemCategory(item)

    }
    const handleItemName = (e: ChangeEvent<HTMLInputElement>) => {
        setItemName(e.target.value)
    }
    const handleRecipe = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setRecipe(e.target.value)
    }

    const resetForm = () => {
        setSubmitWarning(false)
        setServingSizeWarning(false)
        setRecipe('')
        setItemName('')
        setServingSize('')
        setPrice('')
        setItemCategory('')
    }

    const handleFormSubmit = async (e: any) => {

        e.preventDefault()
        if (menuItems.length > 0) {
            const items = menuItems.filter(item => item.title?.toLowerCase() === itemName.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateWarning(true);
                return;
            } else {
                setDuplicateWarning(false);
            }
        }
        if (itemCategory === '' || price === '' || itemName === '' || recipe === "" || priceError || servingSize === '') {
            setSubmitWarning(true)
            return
        }
        else {
            setSubmitWarning(false)
        }
        if (itemCategory === 'other') {
            const items = menuItems?.filter(item => item.category?.toLowerCase() === customCategory.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateCategoryWarning(true)
                return
            } else {
                setDuplicateCategoryWarning(false)
            }
        }

        if (itemSubCategory === 'other') {
            const items = menuItems?.filter(item => item.subCategory?.toLowerCase() === customSubCategory.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateSubCategoryWarning(true)
                return
            } else {
                setDuplicateSubCategoryWarning(false)
            }
        }

        if (params) {
            try {
                setIsloadingSubmit(true)
                const data = await apiFetcher.put(`menu-item/${params}`, {
                    title: itemName,
                    category: itemCategory === 'other' ? customCategory : itemCategory,
                    subCategory: itemSubCategory === 'other' ? customSubCategory : itemSubCategory,
                    image: image,
                    recipe: recipe,
                    servingSize,
                    price: price,
                    isActive: '1',
                    ingredient: ingredientReq
                })
                if (data) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Menu item updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/menu-items')
                        }
                    });
                }


            } catch (e) {
                console.error(e)
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update menu item.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/menu-items')
                    }
                });
            }

        } else {
            if (!image) {
                alert('Please select an image');
                return;
            }
            if (!(ingredientReq.length > 0)) {
                alert('Please enter ingredients');
                return
            }
            const formData = new FormData();
            formData.append('title', itemName);
            formData.append('category', itemCategory === 'other' ? customCategory! : itemCategory!);
            formData.append('subCategory', itemSubCategory === 'other' ? customSubCategory! : itemSubCategory!);
            formData.append('servingSize', servingSize);
            formData.append('price', price);
            formData.append('image', image);
            formData.append('recipe', recipe!);
            formData.append('isActive', '1');
            formData.append('ingredient', JSON.stringify(ingredientReq));

            try {
                setIsloadingSubmit(true)
                const data = await axios.post('/api/menu-item/', formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (data) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Menu item created successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/menu-items')
                        }
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to create menu item.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/menu-items')
                    }
                });
            }



        }
        setIsloadingSubmit(false)
    }

    const handleItemSubCategoryClick = (type: string) => {
        setItemSubCategory(type)
    }
    const getDropDown = ((type: string) => {
        const jsxArray = []
        if (type === 'category') {
            jsxArray.push(...categories.map((item, index) => (
                <Dropdown.Item key={index} onClick={() => handleItemCategoryClick(item)}>{item}</Dropdown.Item>
            )))
        } else {
            jsxArray.push(...subCategories.map((item, index) => (
                <Dropdown.Item key={index} onClick={() => handleItemSubCategoryClick(item)}>{item}</Dropdown.Item>
            )))
        }
    
        return jsxArray
    })
    
    const getAllCategories = async () => {
        try {
            const data: MenuItem[] = await apiFetcher.get('menu-item');

            if (data && data.length > 0) {
                const uniqueCategories: string[] = [];
                const uniqueSubcategories: string[] = [];

                data.forEach((item) => {
                    if (!uniqueCategories.includes(item.category)) {
                        uniqueCategories.push(item.category);
                    }
                    if (!uniqueSubcategories.includes(item.subCategory)) {
                        uniqueSubcategories.push(item.subCategory);
                    }
                });
                if (uniqueCategories.length > 0) {
                    setItemCategory(uniqueCategories[0])
                    setCategories(uniqueCategories)
                }
                if (uniqueSubcategories.length > 0) {
                    setSubCategories(uniqueSubcategories)
                    setItemSubCategory(uniqueSubcategories[0])
                }



            }
        } catch (e) {
            console.error(e);
        }
    };

    const getMenuItem = async () => {

        try {
            const data = await apiFetcher.get(`menu-item/${params}`);
            setItemSubCategory(data?.subCategory);
            setItemCategory(data?.category);
            setServingSize(data?.servingSize);
            setItemName(data?.title);
            setImage(data?.imgUrl);
            setIngredientReq(data?.ingredient);
            // const price = data['item_recpie.id'] ? data['item_recpie.price'] : `10 $`;
            setPrice(data?.price);
            setRecipe(data?.recipe);


        } catch (e) {
            console.error(e);
        }
    };

    const loadFinalArray = () => {
        setFinal([])

        ingredientReq?.forEach((item: any) => {
            const inventory = invenrtoryItems.find((inv) => item.inventoryId == inv.id);

            if (inventory) {
                const ingredient: Ingredient = {
                    ingredient: `${inventory.title}-${inventory.id}`,
                    quantity: item.quantity < 1 ? 1000 * item.quantity : item.quantity,
                    unit: item.quantity < 1 ? inventory.inventoryUnit === 'L' ? 'Millilitre' : 'Grams' : inventory.inventoryUnit === 'L' ? 'Litre' : 'Kilogram'
                };
                setFinal(prev => [...prev, ingredient]);
            }
            else {
                console.log('no quantity')
            }
        });
    }


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);
        }
    };
    const saveRecipe = () => {
        const filteredFinal = final.filter((ingredient) => {
            return !(ingredient.ingredient === '' && ingredient.quantity === 0 && ingredient.unit === '');
        });
        const isValid = filteredFinal.every((ingredient) => {
            return ingredient.ingredient !== '' && !isNaN(ingredient.quantity) && ingredient.quantity > 0 && ingredient.unit !== '';
        });
        if (!isValid || filteredFinal.length === 0) {
            setError(true)
        }
        else {
            formatIngredient(filteredFinal)
            setError(false)
            setShow(false)
        }
    };

    const formatIngredient = (filteredFinal: any) => {
        const formattedFinal = filteredFinal.map((ingredient: { quantity: number; unit: string; ingredient: string; }) => {
            let formattedQuantity = ingredient.quantity;
            if (ingredient.unit === 'Grams') {
                formattedQuantity = ingredient.quantity / 1000; // Convert grams to kilograms
            } else if (ingredient.unit === 'Millilitre') {
                formattedQuantity = ingredient.quantity / 1000; // Convert milliliters to liters
            }
            return {
                inventoryId: parseInt(ingredient.ingredient.split('-')[1]),
                quantity: formattedQuantity,
            };
        });
        setIngredientReq(formattedFinal)
    };
    const closeModal = () => {
        setShow(false)
        setError(false)
    }
    const handleRecipeGenerate = async () => {
        setIsloading(true);
        const autoQuestion = `Generate a recipe for ${itemName} of ${itemCategory}`;
        try {
            const data = await apiFetcher.post('openai/generate-instruction', {
                query: autoQuestion
            });
            let response = data?.message;
            if (response?.length > 0) {
                response = response.replace(/\.,/g, '.\n');
                setRecipe(response);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsloading(false);
        }
    }

    const clear = () => {
        const initialFinal = rows.map(() => ({ ingredient: '', quantity: 0, unit: '' }));
        setFinal(initialFinal);
        setQuantityErrors(initialFinal.map(() => false));
        setRecipe('')
    }
    const handleDeleteRow = () => {
        setShowCheckBox(true)
    }
    const handleCheckboxClick = (event: any, index: number) => {
        setIndices(prevIndices => event.target.checked ? [...prevIndices, index] : prevIndices.filter(item => item !== index));
    }

    const deleteSelectedRows = () => {
        const updatedFinal = [...final];
        const updatedIngredientReq = [...ingredientReq];
        const updatedRows = [...rows];

        indices.forEach((index) => {
            updatedFinal.splice(index, 1);
            updatedIngredientReq.splice(index, 1);
            updatedRows.splice(index, 1);
        });

        setFinal(updatedFinal);
        setIngredientReq(updatedIngredientReq);
        setRows([])
        for (let i = 0; i < updatedRows.length; i++) {
            setRows(prevIndices => [...prevIndices, i])
        }
        formatIngredient(updatedFinal);
        setShowCheckBox(false)
    };
    const handleItemCustomCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomCategory(e.target.value)
    }
    const handleItemCustomSubCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomSubCategory(e.target.value)
    }
    return (
        <div className={styles.inventory} >
            <Modal
                show={show}
                onHide={() => closeModal()}
                dialogClassName="modal-100w mt-5"
                aria-labelledby="example-custom-modal-styling-title"
                centered
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Add recipe for {itemName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-between' style={{ minWidth: '100%', maxHeight: '63vh', overflowY: 'scroll' }}>
                    <div style={{ minWidth: '60%', }}>
                        <div className='d-flex' style={{ gap: '0.6rem' }}>
                            <div onClick={handleAddRow} className='label customLink d-flex' >+Add row</div>
                            <div onClick={handleDeleteRow} className='label customLink d-flex' >-Delete row</div>
                        </div>
                        <Table striped responsive >
                            <thead>
                                <tr>
                                    {
                                        showCheckbox && <th className='customTableHead'>Select</th>
                                    }

                                    <th className='customTableHead'>Ingredient Name</th>
                                    <th className='customTableHead'>Quantity</th>
                                    <th className='customTableHead'>Unit</th>
                                </tr>
                            </thead>
                            <tbody >
                                {rows.map((index) => (
                                    <tr key={index.toString()}>
                                        {
                                            showCheckbox &&
                                            <td>
                                                <InputGroup.Checkbox onChange={(e) => handleCheckboxClick(e, index)} aria-label="Checkbox for following text input" />
                                            </td>
                                        }

                                        <td>
                                            <DropdownButton
                                                variant="outline-secondary"
                                                title={final[index]?.ingredient?.length > 0 ? final[index].ingredient.split('-')[0] : 'Select Ingredient'}
                                                id={`input-group-dropdown-1`}
                                                className='dropdownInput customdropdown'
                                            >
                                                {invenrtoryItems.map((item, itemIndex) => (
                                                    <Dropdown.Item
                                                        key={itemIndex}
                                                        href="#"
                                                        onClick={() => handleIngredientChange(index, 'ingredient', `${item.title}-${item.id}`)}
                                                    >{item.title}</Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </td>
                                        <td>
                                            <InputGroup style={{ maxWidth: '6rem' }}>
                                                <Form.Control
                                                    placeholder="3"
                                                    aria-label="3"
                                                    aria-describedby="basic-addon1"
                                                    value={final[index]?.quantity ? final[index]?.quantity : 0}
                                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                    style={{ borderColor: quantityErrors[index] ? 'red' : '', borderRadius: '5px' }}
                                                />
                                                {quantityErrors[index] && <div style={{ color: 'red', fontSize: '11px' }}>Please enter a valid number.</div>}
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <DropdownButton
                                                variant="outline-secondary"
                                                title={final[index]?.unit?.length > 0 ? final[index].unit : 'Select Unit'}
                                                id={`input-group-dropdown-1`}
                                                className='dropdownInput'
                                            >
                                                {units.map((item, itemIndex) => (
                                                    <Dropdown.Item
                                                        key={itemIndex}
                                                        href="#"
                                                        onClick={() => handleIngredientChange(index, 'unit', item)}
                                                    >{item}</Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div style={{ position: 'relative', minWidth: '38%', marginTop: '3.8rem' }}>
                        <textarea value={recipe} onChange={handleRecipe} placeholder='Add Instructions...' style={{ position: 'unset', minWidth: '99%', minHeight: '100%' }} className='customTextarea'></textarea>
                        {
                            !isloading && <Tooltip title='Generate Recipe'><div className={styles.genRecipeBtn} onClick={handleRecipeGenerate}>
                                <LightbulbSharpIcon style={{ color: 'white' }}></LightbulbSharpIcon>
                            </div></Tooltip>
                        }
                        {
                            isloading && <Tooltip title='Generating Recipe'><div className={styles.genRecipeBtn} onClick={handleRecipeGenerate}>
                                <CircularProgress style={{ color: 'white', height: '1.5rem', width: '1.5rem' }}></CircularProgress>
                            </div></Tooltip>
                        }
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    {error && <p className='warning'>Please fill all fields correctly</p>}
                    {
                        !showCheckbox ? <Button variant="primary" onClick={clear}>Clear</Button> : <Button variant="danger" onClick={deleteSelectedRows}>Delete Selected Rows</Button>
                    }
                    <Button variant="secondary" onClick={saveRecipe}>Save</Button>
                </Modal.Footer>
            </Modal>
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Menu Items</div>
                    <div className="PrevPath d-flex mt-1">Analyse / Menu Items / <div className="currentPath"> &nbsp;Add Menu Item</div></div>
                </div>
            </div>


            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <div className={styles.form}>
                    <div className='formHeading'>{params ? 'Update' : 'Add'} New Menu Item</div>

                    <div className='enteries'>

                        <div className="label">Menu Category</div>
                        <DropdownButton
                            variant="outline-secondary"
                            title={itemCategory !== undefined ? itemCategory : ''}
                            id="input-group-dropdown-1"
                            className='dropdownInput'
                        >
                            <Dropdown.Item onClick={() => handleItemCategoryClick('other')}>Other</Dropdown.Item>
                            {getDropDown('category')}

                        </DropdownButton>
                        {
                            itemCategory === 'other' && <>
                                <div className="label">Category Name</div>
                                <input className="longInput" placeholder='Italian' onChange={(e) => handleItemCustomCategoryName(e)} value={customCategory}></input>
                                {
                                    duplicateCategoryWarning && <p className='warning'>Category with this name already exists!</p>
                                }
                            </>

                        }
                        <div className="label">Menu Sub Category</div>
                        <DropdownButton
                            variant="outline-secondary"
                            title={itemSubCategory !== undefined ? itemSubCategory : ''}
                            id="input-group-dropdown-1"
                            className='dropdownInput'
                        >
                            <Dropdown.Item onClick={() => handleItemSubCategoryClick('other')}>Other</Dropdown.Item>
                            {getDropDown('subCategory')}

                        </DropdownButton>
                        {
                            itemSubCategory === 'other' && <>
                                <div className="label">Sub-category Name</div>
                                <input className="longInput" placeholder='Italian' onChange={(e) => handleItemCustomSubCategoryName(e)} value={customSubCategory}></input>
                                {
                                    duplicateSubCategoryWarning && <p className='warning'>Sub-category with this name already exists!</p>
                                }
                            </>

                        }

                        <div className="label">Menu Item Name</div>
                        <input className="longInput" placeholder='Pizza' disabled={disable} onChange={(e) => handleItemName(e)} value={itemName}></input>
                        {
                            duplicateWarning && <p className='warning'>Menu with this name already exists</p>
                        }
                        <div className="inputsRow">
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label" >Serving Size</div>
                                <input disabled={disable} onChange={(e) => handleServingSize(e)} placeholder='1' className="shortInput" value={servingSize}></input>
                                {
                                    servingWarning && <p className='warning'>Serving Size should be a positive number</p>
                                }
                            </div>
                            <div className="first" style={{ width: '48%' }}>
                                <div className="label">Price</div>
                                <input disabled={disable} onChange={(e) => handlePrice(e)} type='number' placeholder='$10' className="shortInput" value={price}></input>
                                {
                                    priceError && <p className='warning'>Please enter a valid number</p>
                                }
                            </div>
                        </div>
                        {
                            params ? <button type='button' className="label customLink addRecipe d-flex" disabled={itemName === '' || itemCategory === ''}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShow(true);
                                    setReloadFinalArray(final);
                                    setShowCheckBox(false)
                                    loadFinalArray()
                                }}
                                title={itemName === '' ? 'First add menu item name' : ''}
                            ><EditSharpIcon fontSize='small'></EditSharpIcon><span>Edit Recipe</span></button> :
                                <button type='button' className="label customLink addRecipe d-flex" disabled={itemName === '' || itemCategory === ''}
                                    onClick={() => {
                                        setShow(true);
                                        setReloadFinalArray(final);
                                        setShowCheckBox(false)

                                    }}
                                    title={itemName === '' ? 'First add menu item name' : ''}
                                ><AddIcon fontSize='small'></AddIcon><span>Add Recipe</span></button>

                        }
                        {
                            !params &&
                            <>
                                <div className="label">Upload Image</div>
                                <div className="custom-file mt-2">
                                    <input
                                        type="file"
                                        className="custom-file-input" // Apply custom styling to file input
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <label className="custom-file-label" htmlFor="inputGroupFile01">  {image ? image.name : 'Choose file'}</label>
                                </div>
                            </>
                        }

                    </div>
                    {
                        submitWarning ? <p className='warning'>All fields must be correctly filled</p> : <></>
                    }

                    {
                        isloadingSubmit ? <button className='button btnText me-3 mt-4' ><CircularProgress style={{ height: '0.7rem', width: '0.7rem', color: 'white', marginRight: '0.3rem' }} />Please Wait</button> :
                            <div className="d-flex  mt-4">
                                <button disabled={isloadingSubmit} type='submit' className='button btnText me-3'>
                                    {params ? 'Update' : 'Submit'}
                                </button>
                                <button disabled={isloadingSubmit} type="button" onClick={() => resetForm()} className='resetButton btnText '>
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

