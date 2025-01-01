import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(0); // Default to January
  const [days, setDays] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const year = 2025; // Assuming the year is fixed as 2025

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const fetchMonthData = async () => {
    const daysInMonth = getDaysInMonth(currentMonth, year);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      dayString: `${(currentMonth + 1).toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`,
      color: "bg-yellow-50 text-gray-700 border border-gray-300", // Default styling
      hasGym: false,
    }));

    let totalExpense = 0;
    let totalIncome = 0;

    try {
      const daysRef = collection(db, "calendarDays");
      const querySnapshot = await getDocs(daysRef);

      querySnapshot.forEach((doc) => {
        const docId = doc.id;
        const dayData = doc.data();
        const [docYear, docMonth, docDay] = docId.split("-");

        // Check if the document belongs to the current month and year
        if (
          parseInt(docYear) === year &&
          parseInt(docMonth) === currentMonth + 1
        ) {
          const dayIndex = parseInt(docDay) - 1;
          if (dayIndex >= 0 && dayIndex < daysInMonth) {
            monthDays[dayIndex] = {
              ...monthDays[dayIndex],
              color: dayData.productivity === 'bg-red-400' ? 'bg-red-400 text-white' :
                     dayData.productivity === 'bg-slate-300' ? 'bg-slate-50 text-gray-700' :
                     dayData.productivity === 'bg-green-300' ? 'bg-green-300 text-white' :
                     dayData.productivity === 'bg-green-500' ? 'bg-green-500 text-white' :
                     "bg-yellow-50 text-gray-700 border border-gray-300",
              hasGym: dayData.gym || false,
            };
            totalExpense += dayData.expense || 0;
            totalIncome += dayData.income || 0;
          }
        }
      });
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }

    setDays(monthDays);
    setTotalExpense(totalExpense);
    setTotalIncome(totalIncome);
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) =>
      direction === "prev" ? (prev === 0 ? 11 : prev - 1) : (prev === 11 ? 0 : prev + 1)
    );
  };

  return (
    <div className=" mt-10 max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-yellow-50 shadow-md rounded-md overflow-hidden font-Cedarville">
      <div className="bg-yellow-50 px-4 py-3 sm:px-6 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline rounded-md"
            onClick={() => handleMonthChange("prev")}
          >
            <FaArrowLeft className="sm:text-lg md:text-xl"/>
          </button>
          <h2 className="text-lg sm:text-xl md:text-2xl leading-6 font-normal text-gray-800">
            {months[currentMonth]} <span className="text-sm sm:text-base">{year}</span>
          </h2>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline rounded-md"
            onClick={() => handleMonthChange("next")}
          >
            <FaArrowRight className="sm:text-lg md:text-xl"/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 px-2 py-2 sm:px-4 sm:py-3">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm md:text-base text-gray-500 font-normal">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <Link key={day.date} to={`/day/${day.dayString}`}>
            <div
              className={`flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-md  ${day.color} text-sm sm:text-base md:text-lg font-medium hover:shadow-md transition-shadow duration-150 ${day.hasGym ? 'border-2 border-blue-500' : ''}`}
            >
              {day.date}
            </div>
          </Link>
        ))}
      </div>

      <div className={`pt-3 pb-4 sm:pt-4 sm:pb-5 text-center border-t border-gray-300`}>
        <h3 className="text-sm sm:text-base font-normal text-gray-700 tracking-wider uppercase">
          Summary for {months[currentMonth]}
        </h3>
        <div className="mt-2 sm:mt-3 flex justify-around">
          <div className={`${totalExpense > 3000 ? 'bg-red-300':''} p-3 w-full`}>
            <div className="text-red-500 font-medium sm:text-lg">Expense</div>
            <div className="text-gray-900 font-bold sm:text-xl">₹{totalExpense.toFixed(2)}</div>
            <div className="w-full h-px bg-gray-300 mt-1 sm:mt-2"></div>
          </div>
          <div className={`${totalIncome > 0 ? 'bg-green-300':''} p-3 w-full`}>
            <div className="text-green-500 font-medium sm:text-lg">Income</div>
            <div className="text-gray-900 font-bold sm:text-xl">₹{totalIncome.toFixed(2)}</div>
            <div className="w-full h-px bg-gray-300 mt-1 sm:mt-2"></div>
          </div>
        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
          .font-Cedarville {
            font-family: 'Cedarville Cursive', cursive;
          }
        `}
      </style>
    </div>
  );
};

export default Calendar;