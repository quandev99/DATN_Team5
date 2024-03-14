import { Bar } from "react-chartjs-2";
import { useGetYearQuery } from "../../api/bill";
import { useMemo } from "react";

const YearRevenue = () => {

  const { data: yearRevenue, isLoading: YearsLoading, isError: YearsError } = useGetYearQuery();
  const yeardata = useMemo(() => yearRevenue, [yearRevenue])
  const yearsRevenue = yeardata ?
    yeardata.map((item: any) => ({ year: item.year, total: item.total })) :
    [];

  const dataYearRevenue = {
    labels: yearsRevenue.map((item: any) => item.year),
    datasets: [
      {
        label: "Doanh thu",
        data: yearsRevenue.map((item: any) => item.total),
        backgroundColor: 'rgba(145, 49, 70, 0.5)',
      },
    ],
  };

  if (YearsLoading) {
    return <div>Loading...</div>;
  }

  if (YearsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div>
      <div className="text-center w-[500px] h-[h-500px]"><Bar data={dataYearRevenue} /></div>
    </div>
  );
};

export default YearRevenue;
