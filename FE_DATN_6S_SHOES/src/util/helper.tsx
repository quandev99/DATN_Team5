import { AiFillStar, AiOutlineStar } from "react-icons/ai"

export const formatMoney = (number: number) => Number(number?.toFixed(1)).toLocaleString()

export const renderStartFromNumber = (number: any, size: any) => {
  if (!Number(number)) return
  //4 => [1,1,1,1,0]
  const stars = []
  for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange" size={size || 16} />)
  for (let i = 5; i > +number; i--) stars.push(<AiOutlineStar color="orange" size={size || 16} />)
  return stars
}

export const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}