"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Auth } from "@/interfaces/auth.interface";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/userSlice";
import apiClient from "@/utils/client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import * as Yup from 'yup';

export default function Home() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [valueStorage, setValue] = useLocalStorage("user", "")
  const dispatch = useAppDispatch();
  const router = useRouter()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: SignupSchema,
    onSubmit: (formValue: Auth) => {
      setLoading(true)
      apiClient.post('/auth/login', formValue )
      .then((r)=>{
        if (r.data === 'NOT_FOUND_USER' || r.data === 'PASSWORD_INCORRECT') {
          setError(r.data)
          setLoading(false)
          return
        }
        setValue(r.data)
        dispatch(setUser(r.data))
        router.push('/home')
        setLoading(false)
      })
      .catch(e=>console.log(e))
    }
  }) 

  if (valueStorage) {
    router.push('/home')
  }

  return (
    <Main>
      <ContainerLogin>
        <Title>GOLOZUR</Title>
        <div>
          <Input label={'Usuario'} name={'nickname'} value={formik.values.nickname} onChange={formik.handleChange} type='text' />
          {formik.errors.nickname && formik.touched.nickname && (
            <p style={{color: 'red', textAlign: 'start'}}>{formik.errors.nickname}</p>
          )}
          <Input label={'Contraseña'} name={'password'} value={formik.values.password} onChange={formik.handleChange} type='password' />
          {formik.errors.password && formik.touched.password && (
            <p>{formik.errors.password}</p>
          )}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%'}}>
            {
              loading ? 
              <div>....Cargando</div>
              :
              <div style={{display: "flex", alignItems: "center"}} >
                {
                  error !== '' && <div style={{color: 'red', marginRight: 15}}>{error}</div>
                }
                <Button text={'INGRESAR'} onClick={formik.handleSubmit} type='submit'/>
              </div>
            }
          </div>
        </div>
      </ContainerLogin>
    </Main>
  );
}

const initialValues:Auth = {
  nickname: '',
  password: ''
};

const SignupSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  nickname: Yup.string().required('Required'),
});

const Main = styled.main `
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin-top: 10%;
`

const ContainerLogin = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  min-width: 400px;
`

const Title = styled.h2 `
  margin: 15px 0;
  font-size: 32px;
`