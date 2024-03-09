import React , {useEffect , useState} from 'react'
import { useNavigate , useLocation } from 'react-router-dom'
import {Form , Input , Button, Select} from 'antd'
import axios from "axios";
import toast from "react-hot-toast";
import {  useDispatch} from 'react-redux';
import {useSelector } from 'react-redux'
import '../index.css'
import { hideLoading, showLoading } from '../redux/alertSlice';
import Layout from '../components/Layout';

function Message() {
    const location = useLocation();
    const { fromHome } = location.state;
    let data = fromHome.sendid;

    if(!localStorage.loaded) {
        localStorage.setItem('loaded', 'yes')
        window.location.reload();
    }
    const [member , setMember] = useState();
   const mapmembers = member?.adminmembers;
    console.log("ppppp", member?.adminmembers)
    const getmessageto=async()=>{
        try{
            const response = await axios.post("/api/user/get-message-to" , {} , {
                headers:{
                    Authorization : "Bearer " + localStorage.getItem("token"),
                },
            });
            window.onload = function() {
                if(!window.location.hash) {
                    window.location = window.location + '#loaded';
                    window.location.reload();
                }
            }
            console.log("asdiasjd", response.data)
            setMember(response.data)

        }catch(error){      
            console.log(error)
    
        }
    }
        useEffect(()=> {
            getmessageto();
        }, []);
       
    if(!localStorage.loaded) {
        localStorage.setItem('loaded', 'yes')
        window.location.reload();
    }
    const {user} = useSelector((state) => state.user)


        const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async(values) => {
        try{
            dispatch(showLoading());
            const response = await axios.post('/api/user/message', values);
            dispatch(hideLoading());

            if(response.data.success){
                
                toast.success(response.data.message);


                toast("add user success");
                navigate("/");
            }
            else{
                toast.error(response.data.message);

            }
        } catch(error){
            dispatch(hideLoading());

            toast.error("User already exist");

        }
    };
  return (
    <Layout>

            <h1 className='add-user-title'>שלח הודעה</h1>


            <Form layout='vertical' className="add-user-form" onFinish={onFinish}
            fields={[
                {
                    name: ["useremail"],
                    value: user?.email
                }
            ]
            
            }
            >
                <div style={{display:'none'}}>
        
                                <Form.Item  label="admin email"  name='useremail'>
                    <Input    placeholder='Email'/>
                </Form.Item>
                </div>
             

             
                
              <Form.Item

                  name='message'>

                  <Input className='add-user-input' 
                  placeholder='הודעה' type='Message' />
              </Form.Item>
       
                <div className='add-user-btn'>       <Button htmlType='submit'>שלח</Button>
                </div>

            </Form>
            <p>id: {data}</p>


    
    </Layout>
  )
}

export default Message
