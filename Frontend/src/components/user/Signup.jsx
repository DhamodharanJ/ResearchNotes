import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useToast } from '@chakra-ui/react'
import { useState,useContext } from 'react';
import { AuthContext } from "./UserAuthModal";
import { addUserData } from "../../Redux/Slices/userSlice";
import {useDispatch} from 'react-redux';
import UserAvatar from './UserAvatar';


const Signup = () => {

  const { setPage, setTempUserInfo, setloading, tempUserInfo,setAuthModal } = useContext(AuthContext);

  const {register, handleSubmit, formState: { errors}, watch, setError} = useForm();
  const [avatar, setAvatar] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

    const toast = useToast()
    const dispatch = useDispatch()

    function handleAvatarChange(e) {
      const image = e.target.files[0];
      if (image) {
          if (image.size >  (1024 * 1024 * 2)) {
             toast({
              description: 'Please select a smaller image (less than 2MB)',
              status: 'warning',
              duration: 3000,
              isClosable: true,
              position: 'top-right'
             })
              e.target.value = null;
          } else {
              setAvatar(image);
          }
      }
  }

    const onSubmit = async (data) => {
      setloading(true)
      if(tempUserInfo.type != 'login'){
        axios.post(`${BASE_URL}/signup`, {
          username: data.username,
          email : data.email,
          password: data.password,
        }, {
          withCredentials: true
        })
        .then((res) => {
          delete data.password;
          delete data.repeatPassword;
          setTempUserInfo({ ...data, avatar, token: res.data.token,type:'signup' });
          setPage('otp');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setError('email', { message: err.response.data.error });
          }
      
          toast({
            description: err.response.data.error,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right'
          });
        })
        .finally(()=>{
          setloading(false)
        });
      }
      else{
        axios.patch(
          `${BASE_URL}/update-user/${tempUserInfo._id}`, {password:data.password},
         {
          withCredentials: true,
        })
        .then((res)=>{
          dispatch(addUserData({...res.data.data}))
          setTempUserInfo({})
          setAuthModal(false)
        })
        .catch((err)=>{
          // console.log(err)
          toast({
            description: err.response.data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        })
        .finally(()=>{
          setloading(false)
        });
      }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col justify-center mx-4 -mt-6`}> 
            {
              tempUserInfo.type != 'login' ?
            
              <div className='mb-6'>
                <div className="mt-5 font-serif w-4/6">
                  <label htmlFor="username" className="block">Username</label>
                  <input type='username' id="username" className={`focus:outline-none  bg-transparent border ${errors.username ? 'border-red-500' : 'border-gray-400'} h-10 w-full rounded-sm pl-2`} placeholder='santhosh' {...register('username',{required:"username required"})} />
                  <p className="text-red-500 font-itim text-sm">{errors.username?.message}</p>
                </div>

                <div className='h-28 w-28 absolute top-8 right-10'>
                <UserAvatar avatar={avatar && URL.createObjectURL(avatar)} handleAvatarChange={handleAvatarChange} />
                </div>
              </div>
               : 
              <h1 className='text-green-600 font-bold my-2 text-lg'>Set your new password</h1>
                }


            <div className="mt-2 font-serif">
              <label htmlFor="email" className="block">Email address</label>
              <input type='email' id="email" className={`focus:outline-none  bg-transparent border ${errors.email ? 'border-red-500' : 'border-gray-400'} h-10 w-full rounded-sm pl-2`} placeholder='example@domain.com' {...register('email',{required:"mail id required"})}
              value={tempUserInfo.type == 'login' ? tempUserInfo.email : undefined}
              readOnly={tempUserInfo.type == 'login'}
               />
              <p className="text-red-500 font-itim text-sm">{errors.email?.message}</p>
            </div>

            <div className="mt-3 font-serif">
              <label htmlFor="password" className="block">Password</label>
              <input type="text" id="password" className={`focus:outline-none  bg-transparent border ${errors.password ? 'border-red-500' : 'border-gray-400'} h-10 w-full rounded-sm font-thin pl-2`} placeholder="example123#" {...register('password',{required:'password is required',minLength:{
                value:5,
                message:'password should be greater than 5 characters'
                },
                maxLength:{
                value:10,
                message:'password should be lesser than 10 characters'
                }})}/>
              <p className="text-red-500 font-itim text-sm">{errors.password?.message}</p>
            </div>
          
            <div className="mt-3 font-serif">
              <label htmlFor="repeat-password" className="block">Repeat Password</label>
              <input type="text" id="repeat-password" className={`focus:outline-none  bg-transparent border ${errors.repeatPassword ? 'border-red-500' : 'border-gray-400'} h-10 w-full rounded-sm font-thin pl-2`} placeholder="example123#" {...register("repeatPassword", {
                required: "Please repeat the password",
                validate: (value) =>
                value === watch('password') || "Password does not match",
                })} />
              <p className="text-red-500 font-itim text-sm">{errors.repeatPassword?.message}</p>
            </div>
        

            <button type="submit" className="bg-primary text-gray-700 font-bold w-full h-10 mt-3 rounded-3xl">
                {tempUserInfo.type == 'login' ? 'CHANGE NOW' : 'GET OTP'}
            </button>
            
            </form>
    )
}

export default Signup;