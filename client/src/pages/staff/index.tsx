import DeatailsTable from "../../components/table";
import styles from "../../styles/staff.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
import { Divider, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useNavigate } from "react-router-dom";
import apiFetcher from "../../helpers/api-fetcher";
import { BallTriangle } from 'react-loader-spinner'


export default function Staff() {
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchBy, setSearchBy] = useState<string>("name");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const columns = [
    { id: "fullName", label: "Staff Name", minWidth: 100 },
    { id: "role", label: "Role", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "action", label: "Action", minWidth: 100 },
  ];


  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setIsLoading(true)
    try {
      const data = await apiFetcher.get("users");
      setUsers(data);
      setFilteredUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false)
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    if (users && users.length > 0) {
      if (searchBy === "name") {
        const filteredUsers = users.filter((user) =>
          user.fullName.toLowerCase().includes(e.currentTarget.value.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
      } else if (searchBy === "role") {
        const filteredUsers = users.filter((user) =>
          user.role.toLowerCase().includes(e.currentTarget.value.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
      } else if (searchBy === "email") {
        const filteredUsers = users.filter((user) =>
          user.email.toLowerCase().includes(e.currentTarget.value.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
      } else {
        // Reset users array when search input is empty
        setFilteredUsers(users);
      }
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

  const editUser = (id: number) => {
    try {
      router(`/staff/add-staff?id=${id}`);
    } catch (e) {
      console.error(e);
    }
  };
  const deleteUser = async (id: number) => {
    try {
      if (id) {
        await apiFetcher.delete(`users/${id}`);
        getAllUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.inventory}>
      <div className="head d-flex justify-content-between">
        <div>
          <div className="pageHead">Staff</div>
          <div className="PrevPath d-flex mt-1">
            Manage / <div className="currentPath"> &nbsp; Staff</div>
          </div>
        </div>
        <div>
          <button className="button btnText ">
            <div onClick={() => router("/staff/add-staff")} className="link">
              Add Staff
            </div>
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={`${styles.header} d-flex justify-content-between align-items-center mb-2`} >
          <div className="tableHead">Current Staff</div>
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
                    backgroundColor: searchBy === "name" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("name")}
                >
                  Name
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "email" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("email")}
                >
                  Email
                </MenuItem>
                <MenuItem
                  style={{
                    backgroundColor: searchBy === "role" ? "#ececec" : "",
                  }}
                  onClick={() => handleFilter("role")}
                >
                  Role
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
          !isLoading && users.length > 0 && <DeatailsTable
            edit={editUser}
            _delete={deleteUser}
            dummyData={filteredUsers}
            columns={columns}
            title="Current Staff"
          ></DeatailsTable>
        }

      </div>
    </div>
  );
}
