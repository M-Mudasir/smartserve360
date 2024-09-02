import styles from '../../../styles/progressMode.module.css';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import apiFetcher from '../../../helpers/api-fetcher';


const CustomModal = () => {
  const router = useNavigate()
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState({});
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const inventoryId = searchParams.get('inventoryId');
 
  const handleClose = () => {
    setOpen(false);
    router('/vendor')
  };

  const getDetail = async () => {
    try {
      //add service call for getting menu items here
      const data = await apiFetcher.get(`vendor-orders/dispatch/?purchaseOrderId=${id}&&inventoryId=${inventoryId}`)

      setItem({
        ...data, id, inventoryId
      })
      data.Id = id
      data["Inventory Id"] = inventoryId
      data["Dispatch Quantity"] = data?.dispatchQuantity
      data["Demand Quantity"] = data?.demandQuantity
      delete data?.dispatchQuantity
      delete data?.demandQuantity
      const outputArray = [];

      for (const [key, value] of Object.entries(data)) {
        outputArray.push(key, String(value));
      }
      setData(outputArray)


    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: any) => {
    await apiFetcher.put('vendor-orders/dispatch',
      item
    )
    //   setTimeout(function() {
    //     router('/vendor')
    // }, 3000);
  }
  useEffect(() => {
    getDetail()
  }, [])
  return (
    <div>
      <Modal
        className={styles.modalContainer}
        open={open}>
        <div>
          <Grid
            container
            spacing={2}
            justifyContent="center"

            className={styles.gridContainer}
          >
     
            <Grid item xs={12} sx={{ padding: '16px !important' }}>
              <h5 className='pageHead'>Order details</h5>
              <div style={{ borderBottom: '1px solid #C3B4B4', marginBottom: '20px' }}></div>
            </Grid>
            {data?.map((value, index) => (
              <Grid item key={index} xs={6} sx={{ padding: '16px !important' }}>
                <div className={styles.textContainer}>
                  <Typography sx={{ color: '#012970' }} fontSize={15} variant="body1">{value}</Typography>
                </div>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ padding: '16px !important' }}>
              <Button className='btnText' disableRipple
                variant="contained" fullWidth
                onClick={(e) => handleSubmit(e)}
                sx={{ backgroundColor: '#4154F1 !important', '&:hover': { backgroundColor: '#4154F1 !important' } }}>
                Process Request
              </Button>
            </Grid>
            <Button className='btnText' disableRipple
              variant="contained" onClick={handleClose}
              sx={{ padding: '16px', height: '30px', marginBottom: '40px', width: '120px', backgroundColor: '#AFAEAE !important', '&:hover': { backgroundColor: '#AFAEAE!important' } }}>
              Close
            </Button>
          </Grid>
        </div>
      </Modal>
    </div>
  );
};

export default CustomModal;
