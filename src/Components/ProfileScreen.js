import React,{useState,useEffect} from 'react'
import {MdLocalPostOffice} from 'react-icons/md';
import {FaTransgender,FaPhoneAlt,FaMapMarkerAlt} from 'react-icons/fa';
import CartScreen from './CartScreen';
import {Spinner} from 'react-bootstrap';
import Fileuploader from './FileUploadScreen';
import {useAuth} from './Provider/authProvider';
import { UPDATE_USER_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS } from './Provider/constants/Constant';
import API from '../http-common';

function Profile() {
    const {state:authData,dispatch} = useAuth();
    const {isLoading,error,userInfo} = authData;
    const [show,setShow] = useState(false);
    const [dataProfile,setDataProfile] = useState({});
    const [urlProfile,setUrlProfile] = useState('');
    const [updated,setUpdated] = useState(false);
     
    // update profile 
    const onUpdated = async (userId) => {

        const updateData = {
            picture:urlProfile
        }
            dispatch({
                type:UPDATE_USER_REQUEST
            })
        try{    
        const {data:{picture}} = await API.patch(`/user/${userId}`,updateData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:UPDATE_USER_SUCCESS,
                payload:picture,
            })

        }catch(err){
            dispatch({
                type:UPDATE_USER_FAIL,
                payload:err.response.message
            })
        }
        setUpdated(false);
    }

    // get urls
    const getUrls = (url) =>{
        setUrlProfile(url);
    }

    
    // modal handler
    const openModal = () =>{
        setShow(true);
    }
    
    const closeModal = () =>{
        setShow(false);   
        setUpdated(true)
    }

    
    
    useEffect(() => {
        if(userInfo){
            setUrlProfile(userInfo.picture);
            setDataProfile(userInfo);
        }
         
            return () =>{
                setUrlProfile(null)
            }
    },[])
   

    return (
        <> 
        <div className="profile__page-bg">
        <h1>Profile</h1>
            {error && <div>{error}</div>}
            {dataProfile ? dataProfile &&
            <div className='profile__page_container'>
                <ul class="list-group profile__page_info">
                    <li class="list-group-item flex-profile-info">
                        <div className="profile__icon_info">
                            <span><MdLocalPostOffice/></span>
                        </div>
                        <div>
                            <h5>{dataProfile.email}</h5>
                            <p>Email</p>
                        </div>
                    </li>
                    <li class="list-group-item flex-profile-info">
                        <div className="profile__icon_info">
                            <span><FaTransgender/></span>
                        </div>
                        <div>
                            <h5>{dataProfile.gender}</h5>
                            <p>Gender</p>
                        </div>
                    </li>
                    <li class="list-group-item flex-profile-info">
                        <div className="profile__icon_info">
                            <span><FaPhoneAlt/></span>
                        </div>
                        <div>
                            <h5>{dataProfile.phone}</h5>
                            <p>Mobile Phone</p>
                        </div>
                    </li>
                    <li class="list-group-item flex-profile-info">
                        <div className="profile__icon_info">
                            <span><FaMapMarkerAlt/></span>
                        </div>
                        <div>
                            <h5>{dataProfile.address}</h5>
                            <p>Address</p>
                        </div>
                    </li>  
                </ul>
                <div className=" profile__page_picture">
                    <div className="card card-profile">
                        <img src={urlProfile} className="card-img-top" alt="..."/>
                        <div className="card-body">
                            {updated ? <button className="btn btn-success w-100" onClick={ () => onUpdated(dataProfile.id)}>
                            {isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/> : null}
                            <span className="mx-2">{' '}</span>save</button> :  <button className="btn btn-danger w-100" onClick={openModal}>Change your profile</button>}
                            <Fileuploader show={show} able={true} closeModal={closeModal} getUrls = {getUrls}/>
                        </div>
                    </div>
                </div>
            </div>:null}
        <h1>My Book</h1>
        </div>
        <CartScreen/>
        </>
    )
}

export default Profile
