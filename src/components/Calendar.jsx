import { DateCalendar } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import "./Calendar.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Badge } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";
import { DayCalendarSkeleton } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

function Calendar({ onChange, refreshData, data, value }) {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);

  useEffect(() => {
    refreshData(value);
  }, []);

  function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "🔴" : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  }

  const fetchHighlightedDays = () => {
    const days = data.map((unavailability) =>
      dayjs(unavailability.start_date).date()
    );
    setHighlightedDays(days);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHighlightedDays();
  }, [data]);

  const handleMonthChange = async (date) => {
    setIsLoading(true);
    setHighlightedDays([]);
    await refreshData(date);
    fetchHighlightedDays(date);
    setIsLoading(false);
  };

  const handleDateChange = (newValue) => {
    // onChange(dayjs(newValue).format("YYYY-MM-DD"));
    onChange(dayjs(newValue));
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DateCalendar
          locale={"pt-br"}
          onChange={handleDateChange}
          views={["year", "month", "day"]}
          value={value}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{ day: ServerDay }}
          slotProps={{
            previousIconButton: { title: "Mês anterior" },
            nextIconButton: { title: "Próximo mês" },
            day: { highlightedDays },
          }}
          showDaysOutsideCurrentMonth
        />
      </LocalizationProvider>
    </div>
  );
}

export default Calendar;
