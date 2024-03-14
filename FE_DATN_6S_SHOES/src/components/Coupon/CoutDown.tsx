
const CoutDown = ({ number, unit }: any) => {
  return (
    <div className='w-[70px] flex flex-col h-[70px] border justify-center items-center bg-gray-100 rounded-md'>
      <span className='text-[18px] text-gray-800'>{number || 20}:</span>
      <p className="text-xs text-gray-700 ">{unit || 20}</p>
    </div>

  )
}

export default CoutDown