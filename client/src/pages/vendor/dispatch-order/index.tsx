
import React, { useState ,useEffect} from 'react';
import PageHeader from '../../../components/pageheader';
import cart from '../../../media/dispatch.png'
import styles from '../../../styles/form.module.css'
import styles1 from '../../../styles/dispatch.module.css'
import apiFetcher from '../../../helpers/api-fetcher';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
const DispatchOrder = () => {
  const navigate = useNavigate()
  const userId = useSelector((state: RootState) => state.login.id);
  const obj = useSelector((state: RootState) => state.login)
  const userName = useSelector((state: RootState) => state.login.fullName);
  const [items,setItems] = useState<any[]>([]);
  const [name, setName] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('');
  const [dispatchDate, setDispatchDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [warning, setWarning] = useState<boolean>(false);
  const [dispatchQuantity, setDispatchQuantity] = useState<number>(0);
  const [demandedQuantity, setDemandedQuantity] = useState<number>(0);
 

  interface TypeObject {
    1: string;
    2: string;
  }
  
  const type: TypeObject = {
    1: 'Grocery',
    2: 'Article',
  };
  const fields = [
    { label: 'Name', width: '95%', typeField: 'text', value: name, setValue: setName },
    { label: 'Unit', width: '45%', typeField: 'text', value: unit, setValue: setUnit , disabled:true},
    { label: 'Item type', width: '45%', typeField: 'text', value: fieldType, setValue: setFieldType, disabled:true },
    { label: 'Dispatch Date', width: '45%', typeField: 'date', value: dispatchDate, setValue: setDispatchDate,disabled:true },
    { label: 'Expiry Date', width: '45%', typeField: 'date', value: expiryDate, setValue: setExpiryDate },
    { label: 'Dispatch Quantity', width: '45%', typeField: 'number', value: dispatchQuantity, setValue: setDispatchQuantity },
    // { label: 'Demanded Quantity', width: '45%', typeField: 'number', value: demandedQuantity, setValue: setDemandedQuantity },
  ];


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name === '' || unit === '' || fieldType === '' || dispatchDate === '' || expiryDate === '' || dispatchQuantity === 0 ) {
      setWarning(true)
    }
    else{
      setWarning(false)
      const inventoryObj = items?.find((i)=> i?.title == name)

const vendorOrderBody = {
  vendorId: obj?.id, // Provide a default value if id is undefined
  vendorName: obj?.fullName, // Provide a default value if fullName is undefined
  inventoryId: inventoryObj?.id,
  inventoryName: name,
  dispatchDate,
  expiryDate,
  quantity: dispatchQuantity
};

      await apiFetcher.post('vendor-orders',
      vendorOrderBody
      )
      setTimeout(function() {
        navigate('/vendor')
    }, 2000);

    }
    
  }
  const getItems = async () => {
    try {
        //add service call for getting menu items here
        const data = await apiFetcher.get('inventory')
        const inventoryType = type[data[0]?.inventoryUnitId as keyof TypeObject];

        setItems(data)
        setName(data[0]?.title)
        setUnit(data[0]?.inventoryUnitName)
        setFieldType(inventoryType)
        const currentDate = new Date().toISOString().slice(0, 10);
        setDispatchDate(currentDate)
    } catch (e) {
        console.error(e)
    }
}

useEffect(() => {
    getItems()
   
}, [])
  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: any
  ) => {
    const { value } = e.target;
    setValue(value);
  };

  const reset = (e:any) => {
    e.preventDefault();
    setWarning(false)
    setName('')
    setUnit('')
    setFieldType('')
    setDispatchDate('')
    setExpiryDate('')
    setDemandedQuantity(0)
    setDispatchQuantity(0)
  }
  
  return (
    <div className='d-flex flex-column'>
      <PageHeader name='Dispatch Order' previousPath='Vendor Portal /' title='Vendor Portal' />
      <div className='ms-7 d-flex justify-space-between'style={{justifyContent:'space-between',minWidth:'75vw'}}>
        <div className='containerAlignment' style={{ width: '500px', maxWidth: '500px',marginLeft:'2.6rem' }}>
          <h5 className='formHeading'>Dispatch Order</h5>
          <form className={styles.formContainer}>
            {fields.map((field, index) => {
              return (
                <div key={index} style={{ width: `${field.width}`, margin: '8px' }}>
                  { field?.label == 'Name' ?  
                  <>
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
                                        <Dropdown.Item key={index} onClick={() => {
                                          setName(item?.title)
                                          const obj = items?.find((i) => i?.title == item?.title)
                                          const inventoryType = type[obj?.inventoryUnitId as keyof TypeObject];
                                          setUnit(obj?.inventoryUnitName) 
                                          setFieldType(inventoryType)
                                        }} href="#">{item?.title}</Dropdown.Item>
                                    );
                                })
                              }


                        </DropdownButton>
                              </>
                         :
                         <>
                  <label className={styles.inputLabel} key={index} htmlFor={field.label}>{field.label}</label>
                  <input
                    value={field.value}
                    onChange={(e) => handleValueChange(e, field.setValue)}
                    type={field.typeField} disabled={field?.disabled} placeholder={field.label} className={styles.inputField} id={field.label} style={{ width: '98%' }} />
                    </> 
                          }
                    </div>
              );
            })
            }


            <div className="d-flex  mt-4 flex-col">
              {
                warning && <p className='warning'>All fields must be filled</p>
              }
              <div>
                <button className='button btnText me-3' type='submit' onClick={handleSubmit}>Dispatch</button>

                <button className='resetButton btnText' onClick={reset}>Reset</button>
              </div>


            </div>

          </form>

        </div>
        <img alt="side pic of dispatch" src={cart} className={styles1.image} ></img>
      </div>
    </div>
  )
}

export default DispatchOrder