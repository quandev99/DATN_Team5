
const CartVorcher = () => {
  return (
    <div>

      <div className='w-full '>
        <div className='w-[300px] h-[120px] rounded-xl  border-red-600 border-l-8 flex bg-white shadow-md hover:shadow-red-700 '>
          <span className='flex justify-center items-center p-5 text-red-600 font-bold text-[20px] '>300k</span>
          <div className='flex flex-col text-[13px] p-2 pl-4 border-black border-l border-dotted '>
            <span className='text-[20px] font-semibold'>free deliver</span>
            <span>đơn hàng từ 30k</span>

            <p> Mã: <span className='font-bold'>MAC123X</span></p>
            <span>HSD: 12/10/2023 <button className='p2 bg-black text-white rounded-md'>Sao chép mã </button></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartVorcher