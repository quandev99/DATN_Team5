import { ComponetBrand3, ComponetBrand4 } from '.'

const Group2 = () => {
  return (
    <div className='flex gap-2'>
      <div className='w-[50%]  bg-white '>
        <ComponetBrand3 />
      </div>
      <div className='w-[50%]  bg-white '>
        <ComponetBrand4 />
      </div>
    </div>
  )
}

export default Group2