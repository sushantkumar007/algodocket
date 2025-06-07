import React from 'react'

function Counts() {
  return (
    <section className='w-full h-[300px] flex justify-around items-center text-center border-[0.5px] rounded-lg font-bold px-16'>
        <div className='w-1/5 '>
            <div className='text-7xl border-b my-2 py-4'>1000+</div>
            <h1 className='text-4xl'>Users</h1>
        </div>
        <div className='w-1/5 '>
            <div className='text-7xl border-b my-2 py-4'>100+</div>
            <h1 className='text-4xl'>Problems</h1>
        </div>
    </section>
  )
}

export default Counts