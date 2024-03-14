import { Link } from 'react-router-dom'

const SelectOption = ({ icon, Links }: any) => {
  return (
    <>
      <div className='w-10 h-10 bg-white rounded-full border shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800'>
        <Link to={Links} ><div className='w-full'>{icon}</div></Link>
      </div>

    </>
  )
}

export default SelectOption