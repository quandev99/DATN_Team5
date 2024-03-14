import { useEffect, useMemo, useState } from "react";
import { useGetWeekQuery } from "../../api/bill";
import { Bar } from "react-chartjs-2";

const WeekRevenue = () => {
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth() + 1); // Thêm state cho tháng

  const {
    data: weeklyRevenue,
    isLoading: WeeksLoading,
    isError: WeeksError,
  } = useGetWeekQuery<any>({
    year: selectYear,
    month: selectMonth,
  });

  const weeksData = useMemo(() => weeklyRevenue?.weeklyData, [weeklyRevenue]);

  useEffect(() => {
    setSelectYear(new Date().getFullYear());
  }, [selectMonth]);

  if (WeeksLoading) {
    return <div>Loading...</div>;
  }

  if (WeeksError) {
    return <div>Error loading data</div>;
  }
  const dataWeekRevenue = {
    labels: weeksData
      ? weeksData.map((item: any) => item.week)
      : [],
    datasets: [
      {
        label: "Doanh thu",
        data: weeksData ? weeksData.map((item: any) => item.total) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div>
      <select
        value={selectMonth}
        onChange={e => setSelectMonth(parseInt(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, index) => index + 1).map(month => (
          <option key={month} value={month}>
            Tháng {month}
          </option>
        ))}
      </select>
      <div className="text-center w-[500px] h-[h-500px]"><Bar data={dataWeekRevenue} /></div>
    </div>
  );
};

export default WeekRevenue;
