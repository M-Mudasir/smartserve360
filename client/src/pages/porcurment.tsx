import { useNavigate } from 'react-router-dom';
import DeatailsTable from '../components/table';
import styles from '../styles/inventory.module.css'
import { useEffect, useState } from "react";
import apiFetcher from "../helpers/api-fetcher";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
import { Divider, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

export default function Porcurment() {
    const router = useNavigate()
    const [search, setSearch] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchBy, setSearchBy] = useState<string>("title");
    const [items, setItems] = useState<any[]>([]);
    const [filteredItems, seFilteredtItems] = useState<any[]>([]);
    const columns = [

        { id: "inventoryName", label: "Item Name", minWidth: 100 },
        { id: "vendorName", label: "Vendor Name", minWidth: 100 },
        { id: "inventoryUnitName", label: "Unit", minWidth: 100 },
        { id: "quantityRequested", label: "Quantity", minWidth: 45 },
        { id: "createdAt", label: "Purchasing Date", minWidth: 100 },
        { id: "expiryDate", label: "Expiry Date", minWidth: 100 },
        {id:"status",label:"Status", minWidth: 100}
    ];

   
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
        if (searchBy === "inventoryName") {
          const filteredUsers = items.filter((item) =>
            item.inventoryName.toLowerCase().includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } else if (searchBy === "inventoryUnitName") {
          const filteredUsers = items.filter((item) =>
            item.inventoryUnitName
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } else if (searchBy === "createdAt") {
          const filteredUsers = items.filter((item) =>
            item.createdAt
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } else if (searchBy === "expiryDate") {
          const filteredUsers = items.filter((item) =>
            item.expiryDate
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } else if (searchBy === "quantityRequested") {
          const filteredUsers = items.filter((item) =>
            String(item.quantityRequested)
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } 
        else if (searchBy === "vendorName") {
          const filteredUsers = items.filter((item) =>
            item.vendorName
              .toLowerCase()
              .includes(e.currentTarget.value.toLowerCase())
          );
          seFilteredtItems(filteredUsers);
        } 
        else if (searchBy === "status") {
            const filteredUsers = items.filter((item) =>
              item.status
                .toLowerCase()
                .includes(e.currentTarget.value.toLowerCase())
            );
            seFilteredtItems(filteredUsers);}else {
          seFilteredtItems(items);
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
    useEffect(() => {
        getAllItems();
      }, []);
    
      const getAllItems = async () => {
        try {
          const response = await apiFetcher.get("purchase-orders");
    
          if (response.length > 0) {
            const formattedData = response.map((item: { createdAt: string | number | Date; updatedAt: string | number | Date; expiryDate: string | number | Date; }) => ({
                ...item,
                createdAt: new Date(item.createdAt).toLocaleString("en-PK"),
                updatedAt: new Date(item.updatedAt).toLocaleString("en-PK"),
                expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleString("en-PK") : "-",
              }));
            seFilteredtItems(formattedData);
            setItems(formattedData);
          }
        } catch (e) {
          console.error(e);
        }
      };
    return (
        <div className={styles.inventory} >
            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Procurement </div>
                    <div className="PrevPath d-flex mt-1">Analyse / <div className="currentPath"> &nbsp; Procurement</div></div>
                </div>
                <div>
                    <button className='button btnText '>
                        <div onClick={()=>router('/procurement/add-procurement ')} className='link' >
                            Request Procurement
                        </div></button>
                </div>

            </div>


            <div className={styles.tableContainer}>
            <div className="d-flex justify-content-between">
          <div className="tableHead mb-3">Procurement records</div>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center searchBox">
              <div>
                <SearchOutlinedIcon color="disabled"></SearchOutlinedIcon>
              </div>
              <input
                onChange={handleSearch}
                value={search}
                className="searchBox"
                placeholder={`Search User By ${
                  searchBy.charAt(0).toUpperCase() + searchBy.slice(1)
                }`}
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
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{ my: 1 }}
            >
              <Typography
                sx={{ px: 1, textAlign: "start", paddingTop: "0.5rem" }}
              >
                Search By:{" "}
              </Typography>
              <MenuList sx={{ py: 2, textAlign: "start", width: "12rem" }}>
                <Divider />
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "inventoryName" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("inventoryName")}
                >
                  Item Name
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor:
                      searchBy === "inventoryUnitName" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("inventoryUnitName")}
                >
                  Unit
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "quantityRequested" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("quantityRequested")}
                >
                  Quantity
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "expiryDate" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("expiryDate")}
                >
                  Expiry Date
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor:
                      searchBy === "createdAt" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("createdAt")}
                >
                  Purchasing Date
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "vendorName" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("vendorName")}
                >
                  Vendor Name
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "status" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("status")}
                >
                  Status
                </MenuItem>
              </MenuList>
            </Popover>
          </div>
        </div>  
                <DeatailsTable dummyData={filteredItems} columns={columns} title='Add procurement '></DeatailsTable>
            </div>
        </div>
    );
}