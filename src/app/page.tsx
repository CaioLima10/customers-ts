"use client"

import { api } from "@/services/api";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface ICustomersProps{
  name: string
  email: string
  id: string
  status: boolean
  created_at: string
}

export default function Home() {

  const [ customers , setCustomers ] = useState<ICustomersProps[]>([])

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() =>{
    loadCustomers()
  },[])

  const loadCustomers = async () => {

    try {
      const response = await api.get("/customers")
      setCustomers(response.data)
      
    } catch (error) {
      throw new Error("nenhum dado encontrado")
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if(!nameRef.current?.value || !emailRef.current?.value) return

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers , response.data])

    nameRef.current.value = ''
    emailRef.current.value = ''
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete("/customer", {
        params: {
          id: id
        }
      })
      
      const allCustomers = customers.filter((customer) => customer.id !== id)

      setCustomers(allCustomers)

    } catch (error) {
      console.log(error)
    }

  }


  return (
    <main className="flex min-h-screen justify-center gray-900 px-4">
      <div className='flex flex-col w-full my-10 md:max-w-2xl'>
        <h1 className='text-4xl text-zinc-100 font-medium'>Clientes</h1>

        <form className='flex flex-col my-6' onSubmit={handleSubmit}>
          <label className='font-medium text-zinc-100'>Nome:</label>
          <input 
            type="text"
            placeholder='Digite seu Nome completo...'
            className='w-full mb-5 p-2 rounded-md text-zinc-900'
          />

          <label className='font-medium text-zinc-100'>Email:</label>
          <input 
            type="email"
            placeholder='Digite seu Email...'
            className='w-full mb-5 p-2 rounded-md text-zinc-900'
            ref={nameRef}
          />

          <input 
            type="submit" 
            value="Cadastrar"
            className='cursor-pointer w-full p-2 bg-green-500 rounded-md font-medium'
            ref={emailRef}
          />

        </form>
      
        { customers.map((customer) => (
          <section key={customer.id} className='flex flex-col relative hover:scale-105 duration-200 mb-4'>        
                <article className='w-full bg-zinc-100 text-zinc-900 rounded-md p-2'>
                  <p>Nome:<span className='font-medium '>{customer.name}</span></p>
                  <p>Email:<span className='font-medium'>{customer.email}</span></p>
                  <p>Status:<span className='font-medium'>{customer.status ? 'ATIVO' : 'INATIVO'}</span></p>

                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 w-7 h-7 flex items-center 
                    justify-center rounded-md absolute right-2 -top-3"  
                  >
                    <FaTrashAlt size={18} color="#FFF" />
                  </button>

                </article>
          </section>
        )) }
      </div>

    </main>
  )
}
