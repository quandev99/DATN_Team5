
const VariantAdd = () => {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center">Thêm mới Biến thể</h1>
      <a href="/admin/products/:id/update">Quay về cập nhật sản phẩm</a>
      <div className="mt-10">
        <form action="" className="flex flex-col gap-y-5">
          <div className="">
            <label htmlFor="" className="font-bold">Màu <span className="text-red-700">*</span></label>
            <select name="" id="" className="w-full border h-10 rounded-md border-black">
              <option value="0">Chọn</option>
              <option value="1">Màu 1</option>
              <option value="2">Màu 2</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="" className="font-bold">Kích cỡ <span className="text-red-700">*</span></label>
            <select name="" id="" className="w-full border h-10 rounded-md border-black">
              <option value="0">Chọn</option>
              <option value="1">Kích cỡ 1</option>
              <option value="2">Kích cỡ 2</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="" className="font-bold">Giá<span className="text-red-700">*</span></label>
            <input type="number" className="border w-full h-10 rounded-md border-black" />
          </div>
          <div className="">
            <label htmlFor="" className="font-bold">Kho</label>
            <input type="number" className="border w-full h-10 rounded-md border-black" />
          </div>
          <div className="">
            <label htmlFor="" className="font-bold">Số lượng</label>
            <input type="number" className="border w-full h-10 rounded-md border-black" />
          </div>
          <div className="">
            <label htmlFor="" className="font-bold">Giảm giá</label>
            <input type="number" className="border w-full h-10 rounded-md border-black" />
          </div>

          <button className="border w-52 h-10 rounded-lg bg-green-400 font-bold">Thêm mới biến thể</button>

        </form>
      </div>
    </div>
  )
}

export default VariantAdd