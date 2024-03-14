import { useState, useEffect, useMemo } from "react";
import "chart.js/auto";
import { useGetMonthQuery } from "../../api/bill";
import { Bar } from "react-chartjs-2";

const MonthRevenue = () => {
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const { data: monthRevenue, isLoading: MonthsLoading, isError: MonthsError } = useGetMonthQuery<any>({
    year: selectYear,
  });
  const monthData = useMemo(() => monthRevenue?.monthlyData, [monthRevenue]);

  const monthsRevenue = monthData ?
    monthData.map((item: any) => ({ month: item.month, total: item.total })) :
    [];

  useEffect(() => {
    // Gọi setSelectYear sau khi component đã được mount
    setSelectYear(new Date().getFullYear());
  }, []);

  const dataMonthRevenue = {
    labels: monthsRevenue.map((item: any) => item.month),
    datasets: [
      {
        label: "Doanh thu",
        data: monthsRevenue.map((item: any) => item.total),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  if (MonthsLoading) {
    return <div>Loading...</div>;
  }

  if (MonthsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <select value={selectYear} id="selectYear" onChange={(e) => setSelectYear(parseInt(e.target.value))}>
        {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div className="text-center w-[500px] h-[h-500px]">{dataMonthRevenue && <Bar data={dataMonthRevenue} />}</div>
    </div>
  );
};

export default MonthRevenue;
