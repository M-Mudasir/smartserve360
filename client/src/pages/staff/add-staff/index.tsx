import { ChangeEvent, useState, useEffect } from 'react';
import styles from '../../../styles/addInventory.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import chefHat from '../../../media/chefHat.png'
import apiFetcher from '../../../helpers/api-fetcher';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material';

export default function AddStaff() {
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const params = searchParams.get('id');
    const [role, setRole] = useState<string>('Staff')
    const [name, setName] = useState<string>('')
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [warning, setWarning] = useState<boolean>(false)
    const [submitWarning, setSubmitWarning] = useState<boolean>(false)
    const [users, setUsers] = useState<any[]>([]);
    const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false)
    const [isloadingSubmit, setIsloadingSubmit] = useState<boolean>(false)

    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = async () => {
        try {
            const data = await apiFetcher.get("users");
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleOldPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value)
    }
    const handleNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }


    const handleRoleClick = (name: string) => {
        setRole(name)
    }
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const resetForm = () => {
        setSubmitWarning(false)
        setWarning(false)
        setName('')
        setEmail('')
        setRole('Staff')
    }

    const handleFormSubmit = async (e: any) => {
        setWarning(false)
        e.preventDefault()
        if (users.length > 0) {
            const items = users.filter(item => item.title?.toLowerCase() === email.toLowerCase());
            const duplicate = items.length > 0 && items[0].id != params;
            if (duplicate) {
                setDuplicateWarning(true);
                return;
            }else{
                setDuplicateWarning(false)
            }
        }
        if (!isValidPassword(newPassword) && params) {
            setWarning(true);
            return;
        }
        if (role === '' || name === '' || email === '') {
            setSubmitWarning(true)
        }
        else {
            setSubmitWarning(false)
            if (params) {
                setIsloadingSubmit(true)
                const data = await apiFetcher.put(`users/${params}`, {
                    role: role,
                    email,
                    fullName: name,
                    password: oldPassword,
                    newPassword: newPassword
                })

                if (data) {

                    Swal.fire({
                        title: 'Success!',
                        text: 'Staff updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/staff')
                        }
                    });
                } else {

                    Swal.fire({
                        title: 'Error!',
                        text: `Failed to update staff.`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
            else {
                setIsloadingSubmit(true)
                const data = await apiFetcher.post('users', {
                    role: role,
                    email,
                    fullName: name
                })
                if (data?.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: `Failed to create staff.`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });

                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: `Staff created successfully.`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/staff')
                        }
                    });
                }
            }

        }
        setIsloadingSubmit(false)
    }
    const isValidPassword = (newPassword: string) => {
        // oldPassword validation regular expression
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(newPassword);
    };

    const getStaff = async () => {
        try {
            const data = await apiFetcher.get(`users/${params}`)
            setName(data?.fullName)
            setEmail(data?.email)
            setRole(data?.role)

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (params) {
            getStaff()
        }
    }, [params])
    return (
        <div className={styles.inventory} >

            <div className="head d-flex justify-content-between">
                <div>
                    <div className="pageHead">Staff</div>
                    <div className="PrevPath d-flex mt-1">Manage / Staff / <div className="currentPath"> &nbsp;Add Staff</div></div>
                </div>
            </div>
            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <div className={styles.form}>
                    <div className='formHeading'>{params ? 'Update' : 'Add New'} Staff</div>
                    <div className='enteries'>
                        <div className="label">Full name</div>
                        <input className="longInput" placeholder='name' onChange={(e) => handleName(e)} value={name}></input>
                        {
                            params &&
                            <>
                                <div className="label">Current Password</div>
                                <input onChange={(e) => handleOldPassword(e)} placeholder='Enter your current password' className="longInput" value={oldPassword}></input>

                                <div className="label">New Password</div>
                                <input onChange={(e) => handleNewPassword(e)} placeholder='Enter your new password' className="longInput" value={newPassword}></input>
                                {
                                    warning &&
                                    <ul className='py-1 px-0 warning' >The password should contain at least:
                                        <div style={{ paddingLeft: '1rem' }}>
                                            <li style={{ listStyleType: 'disc' }} className='warning'>8 characters.</li>
                                            <li style={{ listStyleType: 'disc' }} className='warning'>uppercase letter.</li>
                                            <li style={{ listStyleType: 'disc' }} className=''>lowercase letter.</li>
                                            <li style={{ listStyleType: 'disc' }} className='warning'>one digit.</li>

                                        </div>

                                    </ul>
                                }
                            </>
                        }


                        <div className="label">Email</div>
                        <input disabled={params ? true : false} className="longInput" placeholder='abc@gmail.com' onChange={(e) => handleEmail(e)} value={email}></input>
                        {
                            duplicateWarning && <p className='warning'>User with this email already exists</p>
                        }
                        <div className="label">Role</div>
                        <DropdownButton
                            variant="outline-secondary"
                            title={role === 'superuser' ? 'Super user' : role}
                            id="input-group-dropdown-1"
                            className='dropdownInput'
                        >

                            <Dropdown.Item onClick={() => handleRoleClick('superuser')} href="#">Super user</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRoleClick('Staff')} href="#">Staff</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRoleClick('Vendor')} href="#">Vendor</Dropdown.Item>
                        </DropdownButton>
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