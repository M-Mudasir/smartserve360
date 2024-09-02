
import axios from "axios";
import Form from 'react-bootstrap/Form';
import { useDispatch } from "react-redux";
import { InputGroup } from 'react-bootstrap';
import { userLogin } from '../slices/loginSlice';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Loader from '../components/loader'
import Cookies from 'js-cookie';
import logout from '../media/loginBg2.png'
import logout1 from '../media/loginBg1.png'
import styles from '../styles/login.module.css'
import Button from 'react-bootstrap/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react'
import apiFetcher from '../helpers/api-fetcher';

const Login = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [warning, setWarning] = useState(false)

    useEffect(() => {
        getConfig()
    }, [])
    const getConfig = async () => {
        const response = await apiFetcher.get('config')
        if(response){
            localStorage.setItem('org',response.org)
            localStorage.setItem('currency',response.currency)
            localStorage.setItem('tax',response.tax)
        }
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event?.target.value)
    }

    const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event?.target.value)
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const checkCredentials = async (e: any) => {
        e.preventDefault()
        if (email === '' || password === '') {
            setWarning(true)
        }
        else {
            setWarning(false)
            try {
                setLoading(true)
                const response = await axios.post(`/api/auth/signin`, { email, password });
                if (response?.data?.error) {
                    setLoading(false)
                    toast.error(response.data?.message)
                } else {
                    Cookies.set('user', JSON.stringify(response?.data?.user), { expires: 1 });
                    setLoading(false)
                    toast.success(response?.data?.message)
                    dispatch(userLogin());
                    navigate('/')
                }
            } catch (error) {
                // Handle error
                console.error('Error:', error);
                toast.error("Some Error Occured")
            }
        }

    }
    return (

        <div className={styles.main}>
            {/* <ToastContainer /> */}
            {/* <div className={styles.image}></div> */}
            <img alt="background of login" className={styles.image} src={logout}></img>
            <img alt="background of login" className={styles.image1} src={logout1}></img>
            <div className={styles.headings}>
                <div className={styles.elevate}>ELEVATE</div>

                <div className={styles.experience}>Your F&B Experience</div>
                <p className={styles.paragraph}>A comprehensive and technology-driven solution designed to revolutionize the operations of restaurants and the Food & Beverage (F&B) industry. </p>
            </div>
            <div className={styles.form}>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='formName'>Email</Form.Label>
                        <Form.Control type="email" onChange={(e) => handleNameChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='formName'>Password</Form.Label>

                        <InputGroup className="mb-3">

                            <Form.Control onChange={(e) => handlePasswordChange(e)} type={showPassword ? 'text' : 'password'} placeholder="" />
                            <InputGroup.Text>
                                <IconButton
                                    className="p-0 pe-3"
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"

                                > {showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                            </InputGroup.Text>
                        </InputGroup>
                        {
                            warning ? <p className='warning'>All fields must be filled</p> : <></>
                        }
                        <Button size="sm" className='button btnText'
                            onClick={checkCredentials}>
                            {loading ? <Loader /> : <>Sign In</>}
                        </Button>
                    </Form.Group>
                    {/* <a className={styles.forgotPassword} href='#'>Forgot Password?</a> */}

                    {/* <p className={styles.registerHere}>Don't have an account? <a  href='#' className={styles.reg}>Register here</a></p> */}

                </Form>

            </div>

        </div>

    )
}

export default Login
