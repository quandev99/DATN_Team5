import { ComponetBrand1, ComponetBrand2 } from '.'
const Group1 = () => {
  return (
    <div className='flex gap-4'>
      <div className='w-[50%]  bg-white '>
        <ComponetBrand1 />
      </div>
      <div className='w-[50%]  bg-white'>

        <ComponetBrand2 />
      </div>
    </div>
  )
}

export default Group1