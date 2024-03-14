const ContactPage = () => {
  return (
    <section className="max-w-[1080px] w-full mx-auto bg-white mt-10 rounded-sm'">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 h-[500px]">
        <div className=" w-full px-5">
          <div><h1 className="font-bold text-[28px]">Liên hệ với chúng tôi</h1></div>
          <form className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4 mt-5">
            <div>
              <label htmlFor="" className="font-medium">Họ và tên</label><br />
              <input type="text"
                className="border rounded-md shadow-sm mt-1 px-2 py-2 w-full outline-none transition-all focus:border-green-200"
                placeholder="Họ tên..." />
            </div>
            <div>
              <label htmlFor="">Số điện thoại</label><br />
              <input type="text"
                className="border rounded-md shadow-sm mt-1 px-2 py-2 w-full outline-none transition-all focus:border-green-200"
                placeholder="Số điện thoại..." />
            </div>
            <div className="col-span-2">
              <label htmlFor="">Email</label><br />
              <input type="text"
                className="border rounded-md shadow-sm mt-1 px-2 py-2 w-full outline-none transition-all focus:border-green-200"
                placeholder="Email..." />
            </div>
            <div className="col-span-2">
              <label htmlFor="">Nội dung</label><br />
              <textarea name=""
                className="border rounded-md shadow-sm mt-1 px-2 py-2 w-full outline-none transition-all focus:border-green-200"
                id="" cols={20} rows={4} placeholder="Nội dung..."></textarea>
            </div>
            <div className="w-full bg-green-500 col-span-2 text-center text-white py-2 rounded-[30px] hover:bg-green-600 transition-all">
              <button className="block w-full">Gửi</button>
            </div>
          </form>
        </div>
        <div className="w-[300px] mx-auto">
          <img className="w-full  rounded-[40px] shadow-md" src="https://bota.vn/wp-content/uploads/2018/11/Kinh-doanh-c%C3%A2y-c%E1%BA%A3nh-hi%E1%BB%87u-qu%E1%BA%A3-v%E1%BB%9Bi-%E1%BA%A3nh-%C4%91%E1%BA%B9p-5.jpg" alt="" />
        </div>
      </div>
    </section >
  )
}

export default ContactPage