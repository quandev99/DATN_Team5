import { MdDelete } from "react-icons/md";
import { useGetUserByIdQuery } from "../../../../api/user";
import { IUser } from "../../../../interface/user";
import { message } from "antd";

const UserCoupon = ({ item, setUsers, users }: { item: string, setUsers: any, users: any }) => {
    const { data: UserData } = useGetUserByIdQuery<IUser>(item);
    const userDetail: any = UserData?.user;

    const onHandleRemoveUser = (_id: string) => {
        if (_id) {
            const updateUsers = users.filter((item: string) => item !== _id);
            setUsers(updateUsers);
        } else {
            message.error("Không tìm thấy id để xóa");
        }
    };

    return (
        <div className="grid my-1 hover:shadow transition-all hover:bg-gray-100 border rounded-full bg-white shadow-sm items-center grid-cols-[15%,auto,10%]">
            <div className="w-[40px] h-[40px]">
                <img
                    className="w-full h-full rounded-full"
                    src={userDetail?.user_avatar?.url} alt="" />
            </div>
            <div>
                <h1>{userDetail?.user_fullname}</h1>
            </div>
            <div>
                <button
                    onClick={() => onHandleRemoveUser(userDetail._id)}
                    className="border text-[20px] hover:border-red-500 border-red-200 transition-all bg-red-100">
                    <MdDelete />
                </button>
            </div>
        </div>
    );
};

export default UserCoupon;
