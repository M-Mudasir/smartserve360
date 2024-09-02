import { useNavigate } from "react-router-dom";
import DeatailsTable from "../components/table";
import styles from "../styles/inventory.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
import { Divider, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useEffect, useState } from "react";
import apiFetcher from "../helpers/api-fetcher";
import { BallTriangle } from 'react-loader-spinner'


export default function Inventory() {
  const router = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchBy, setSearchBy] = useState<string>("title");
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, seFilteredtItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const columns = [
    { id: "title", label: "Item Name", minWidth: 100 },
    { id: "itemBrand", label: "Brand Name", minWidth: 100 },
    { id: "inventoryUnit", label: "Unit", minWidth: 100 },
    { id: "remainingQuantity", label: "Quantity", minWidth: 45 },
    { id: "expiryDate", label: "Expiry Date", minWidth: 100 },
    { id: "createdAt", label: "Purchasing Date", minWidth: 100 },
    { id: "action", label: "Action", minWidth: 100 },
  ];

  useEffect(() => {
    getAllItems();
  }, []);

  const getAllItems = async () => {
    try {
      setIsLoading(true)
      const response = await apiFetcher.get("inventory");
      response?.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      if (response?.length > 0) {
        const formattedData = response.map((item: { createdAt: string | number | Date; updatedAt: string | number | Date; expiryDate: string | number | Date; }) => {
          const createdAt = new Date(item.createdAt);
          const updatedAt = new Date(item.updatedAt);
          const expiryDate = new Date(item.expiryDate);
      
          return {
            ...item,
            createdAt: isNaN(createdAt.getTime()) ? 'Invalid Date' : createdAt.toLocaleString("en-PK"),
            updatedAt: isNaN(updatedAt.getTime()) ? 'Invalid Date' : updatedAt.toLocaleString("en-PK"),
            expiryDate: isNaN(expiryDate.getTime()) ? 'Invalid Date' : expiryDate.toLocaleString("en-PK"),
          };
        });

        // Sort data in descending order based on createdAt


        // Prepend new items to the array
        seFilteredtItems((prevItems) => [...formattedData, ...prevItems]);
        setItems(formattedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false)
    }
  };

  const deleteInventory = async (id: number) => {
    try {
      if (id) {
        await apiFetcher.delete(`inventory/${id}`);
        getAllItems();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    if (searchBy === "title") {
      const filteredUsers = items.filter((item) =>
        item.title.toLowerCase().includes(e.currentTarget.value.toLowerCase())
      );
      seFilteredtItems(filteredUsers);
    } else if (searchBy === "inventoryUnitName") {
      const filteredUsers = items.filter((item) =>
        item.inventoryUnit
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
    } else if (searchBy === "quantity") {
      const filteredUsers = items.filter((item) =>
        String(item.quantity)
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase())
      );
      seFilteredtItems(filteredUsers);
    } else if (searchBy === "itemBrand") {
      const filteredUsers = items.filter((item) =>
        item.itemBrand
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase())
      );
      seFilteredtItems(filteredUsers);
    } else {
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

  const editItem = (id: number) => {
    try {
      router(`/inventory/add-inventory?id=${id}`);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className={styles.inventory}>
      <div className="head d-flex justify-content-between">
        <div>
          <div className="pageHead">Inventory</div>
          <div className="PrevPath d-flex mt-1">
            Analyse / <div className="currentPath"> &nbsp; Inventory</div>
          </div>
        </div>
        <div>
          <button className="button btnText ">
            <div
              onClick={() => router("/inventory/add-inventory")}
              className="link"
            >
              Add Inventory
            </div>
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
      <div className={`${styles.header} d-flex justify-content-between align-items-center mb-2`} >

          <div className="tableHead">Inventory records</div>
          <div  className={`${styles.searchh} d-flex align-items-center`}>
            <div className="d-flex align-items-center searchBox">
              <div>
                <SearchOutlinedIcon color="disabled"></SearchOutlinedIcon>
              </div>
              <input
                onChange={handleSearch}
                value={search}
                className="searchBox"
                placeholder={`Search User By ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)
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
                    backgroundColor: searchBy === "title" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("title")}
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
                    backgroundColor: searchBy === "quantity" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("quantity")}
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
                      searchBy === "purchasingDate" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("purchasingDate")}
                >
                  Purchasing Date
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "itemBrand" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("itemBrand")}
                >
                  Brand Name
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
          !isLoading && filteredItems.length > 0 &&
          <DeatailsTable
            _delete={deleteInventory}
            edit={editItem}
            dummyData={filteredItems}
            columns={columns}
            title="Add Inventory"
          ></DeatailsTable>
        }

      </div>
    </div>
  );
}
